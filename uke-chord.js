(function () {

  const svg = `
<svg id="ukeChordSvg" width="90" height="112" viewBox="0 0 90 112"
      style="font-family: sans-serif; font-size: 11px;"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink">
  <title id="title">uke-chord</title>
  <text id="chordName" x="48" y="16" text-anchor="middle" style="font-size: 16px;"></text>
  <g id="svgChord" transform="translate(19,12)">
    <text id="position" x="-14" y="17" text-anchor="middle"></text>
    <rect id="nut" height="4" width="62" fill="black" style="visibility: hidden;"/>
    <g id="diamond" style="visibility:hidden;">
      <rect width="14" height="14" transform="translate(0,-10),rotate(45)"></rect>
    </g>
    <g id="strings" transform="translate(0,2)">
      <rect height="80" width="2" x="0"  fill="black"/>
      <rect height="80" width="2" x="20" fill="black"/>
      <rect height="80" width="2" x="40" fill="black"/>
      <rect height="80" width="2" x="60" fill="black"/>
    </g>
    <g id="frets" transform="translate(0,2)">
      <rect height="2" width="62" y="0"  fill="black"/>
      <rect height="2" width="62" y="20" fill="black"/>
      <rect height="2" width="62" y="40" fill="black"/>
      <rect height="2" width="62" y="60" fill="black"/>
      <rect height="2" width="62" y="80" fill="black"/>
    </g>
    <g id="closedStrings" transform="translate(1,13)">
      <g id="closedString0" style="visibility: hidden;">
        <circle r="6"/>
        <text fill="white" id="finger0" y="4" text-anchor="middle"></text>
      </g>
      <g id="closedString1" style="visibility: hidden;">
        <circle r="6"/>
        <text fill="white" id="finger1" y="4" text-anchor="middle"></text>
      </g>
      <g id="closedString2" style="visibility: hidden;">
        <circle r="6"/>
        <text fill="white" id="finger2" y="4" text-anchor="middle"></text>
      </g>
      <g id="closedString3" style="visibility: hidden;">
        <circle r="6"/>
        <text fill="white" id="finger3" y="4" text-anchor="middle"></text>
      </g>
    </g>
    <g id="openStrings" transform="translate(1,-6)">
      <circle id="openString0" cx="0"  r="4" fill="none" stroke="black" stroke-width="1" style="visibility: hidden;"/>
      <circle id="openString1" cx="20" r="4" fill="none" stroke="black" stroke-width="1" style="visibility: hidden;"/>
      <circle id="openString2" cx="40" r="4" fill="none" stroke="black" stroke-width="1" style="visibility: hidden;"/>
      <circle id="openString3" cx="60" r="4" fill="none" stroke="black" stroke-width="1" style="visibility: hidden;"/>
    </g>
    <g id="xedStrings" transform="translate(-3,-10)">
      <path id="xString0" d="M0,0L8,8m0,-8L0,8" stroke="black" style="visibility: hidden;" stroke-width="1"/>
      <path id="xString1" d="M0,0L8,8m0,-8L0,8" stroke="black" style="visibility: hidden;" stroke-width="1" transform="translate(20,0)"/>
      <path id="xString2" d="M0,0L8,8m0,-8L0,8" stroke="black" style="visibility: hidden;" stroke-width="1" transform="translate(40,0)"/>
      <path id="xString3" d="M0,0L8,8m0,-8L0,8" stroke="black" style="visibility: hidden;" stroke-width="1" transform="translate(60,0)"/>
    </g>
    <g id="subText" transform="translate(1,98)">
      <text id="subText0" x="0" text-anchor="middle"></text>
      <text id="subText1" x="20" text-anchor="middle"></text>
      <text id="subText2" x="40" text-anchor="middle"></text>
      <text id="subText3" x="60" text-anchor="middle"></text>
    </g>
  </g>
</svg>`;

  const stringsNum = 4;

  const _translate = function (x, y, el) {
    el.setAttribute("transform", "translate(" + x + "," + y + ")");
  }

  class UkeChord extends HTMLElement {
    connectedCallback() {
      // attach the named attributes to 'this'
      for (let i = 0; i < this.attributes.length; i++) {
        this[this.attributes[i].name] = this.attributes[i].value;
      }

      this.attachShadow({ mode: 'open' });
      const template = document.createElement("template");
      template.innerHTML = svg;

      const elementsWithId = template.content.querySelectorAll('*[id]');
      this.$ = {};
      // add all svg elements with an id to this.$
      elementsWithId.forEach(el => { this.$[el.id] = el; })
      this.shadowRoot.appendChild(template.content);

      this.parseFrets();
      this.parseFingers();
      this.showPosition();
      this.parseSub();
      this.showName();
      this.setSize();
      this.setRoot();
      this.setTitle();
    }

    parseFrets() {
      if (!this.frets) return;

      const frets = this.frets.split("");
      if (frets.length !== stringsNum) return;

      frets.forEach((fret, idx) => {
        if (fret === "0") {
          this.$["openString" + idx].style.visibility = "visible";
        } else if(fret === "x" || fret === 'X'){
          console.log('found an X')
          this.$["xString" + idx].style.visibility = "visible";
        } else {
          this.$["closedString" + idx].style.visibility = "visible";
        }

        if(parseInt(fret) > 0){
          _translate(idx * 20, (fret - 1) * 20, this.$["closedString" + idx]);
        }
      });
    }

    parseFingers() {
      if (!this.fingers) return;

      const fingers = this.fingers.split("");
      if (fingers.length !== stringsNum) return;

      fingers.forEach((finger, idx) => {
        this.$["finger" + idx].innerHTML = finger !== "0" ? finger : "";
      });
    }


    showPosition() {
      const position = parseInt(this.position);
      if (position === 0) {
        this.$.nut.style.visibility = "visible";
      } else if (position > 0 && position < 100) {
        this.$.position.innerHTML = position;
      }
    }

    parseSub() {
      let subText;
      if (!this.sub) return;

      //if using commas in the sub text as separators
      if (this.sub.indexOf(",") > 0) {
        subText = this.sub.split(",");
      } else {
        subText = this.sub.split("");
      }
      if (subText.length !== stringsNum) return;

      subText.forEach((text, idx) => {
        this.$["subText" + idx].innerHTML = text !== "_" ? text : "";
      });
    }

    showName() {
      if (this.name && this.name.length > 0) {
        _translate(16, 28, this.$.svgChord);
        this.$.chordName.innerHTML = this.name;
        this.$.ukeChordSvg.setAttribute("height", 134);
        this.$.ukeChordSvg.setAttribute("viewBox", "0 0 84 134");
      }
    }

    setSize() {
      if (!this.size) return;
      if (this.size === "L" || this.size === "l") {
        this.$.ukeChordSvg.setAttribute("width", 180);
        if (this.name) {
          this.$.ukeChordSvg.setAttribute("height", 268);
        } else {
          this.$.ukeChordSvg.setAttribute("height", 224);
        }
      }
    }

    setRoot() {
      if (!this.r) return;

      this.r.split("").forEach(r => {
        const root = parseInt(r);
        if (root > stringsNum || root < 1) return;
        const stringIdx = stringsNum - root;
        const string = this.$["closedString" + stringIdx];
        const circle = this.$["closedString" + stringIdx].getElementsByTagName("circle")[0];
        const diamond = this.$.diamond.cloneNode(true);
        diamond.style.visibility = "visible";
        string.insertBefore(diamond, circle);
        string.removeChild(circle);
      });
    }

    setTitle(){
      this.$.title.innerHTML = this.name ? this.name : 'Ukulele chord';
    } 
  }

  customElements.define('uke-chord', UkeChord);
})();