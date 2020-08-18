(function () {

  const svg = `
<svg id="ukeChordSvg" width="90" height="112" viewBox="0 0 90 112"
      style="font-family: sans-serif; font-size: 11px;"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink">
  <title id="title">uke-chord</title>
  <text id="chordName" x="50%" y="16"  text-anchor="middle" style="font-size: 16px;"></text>
  <defs>
    <circle id="bubble" r="6" transform="translate(1,11)"/>
    <path id="ex" d="M0,0L8,8m0,-8L0,8" stroke="black" stroke-width="1.1" transform="translate(-3,-11)"/>
    <circle id="openString" cx="0" r="4" fill="none" stroke="black" stroke-width="1" transform="translate(0,-7)"/>
    <rect id="diamond" width="14" height="14" transform="translate(1,2),rotate(45)"></rect>
  </defs>
  <g id="svgChord">
    <text id="position" x="-14" y="17" text-anchor="middle"></text>
    <g id="frets"></g>
    <g id="strings"></g>
  </g>
</svg>`;
  const defaultFretCount = 4;
  
  function _translate(x, y, el) {
    el.setAttribute("transform", "translate(" + x + "," + y + ")");
  }

  function _node(name, attributes){
    const node = document.createElementNS("http://www.w3.org/2000/svg", name);
    Object.keys(attributes).forEach(key => {
      node.setAttribute(key, attributes[key] + '' );
    })
    return node;
  }

  function _use(refName, attributes) {
    const node = _node("use", attributes);
    node.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#' + refName);
    return node;
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

      this.frets = this.frets ? this.frets.split("").slice(0,10) : [];
      this.tabWidth = (this.frets.length - 1) * 20 + 2;
      this.viewBoxWidth = this.tabWidth + 30;
      this.fretCount = parseInt(this.length) || defaultFretCount;
      this.tabHeight = this.fretCount * 20;
      this.viewBoxHeight = this.tabHeight + 25 + (this.name ? 25 : 0)
      this.fingers = this.fingers ? this.fingers.split("") : [];
      this.sub = this.parseSub(this.sub)
      this.r = this.r ? this.r.split("") : [];
      
      this.showPosition();
      this.showName();
      this.setSize();
      this.setTitle();

      this.render()
    }

    render() {
      // add horizontal fret lines
      for(let i=0; i< this.fretCount + 1; i++){
        const fret = _node("rect", {x: 0,  y: i * 20, width: this.tabWidth, fill: 'black', height: 2 })
        this.$["frets"].appendChild(fret)
      }

      // for each string add a vertical string, a bubble, open marker, x marker, or fingering
      this.frets.forEach((fret, idx) => {
        const x = idx * 20;
        const string = _node("rect", {x,  y: 0, width: 2, fill: 'black', height: this.tabHeight })
        this.$["strings"].appendChild(string)

        // add diamond heads, strings on ukulele are counted from the right to the left, so 1 equals idx 3, 2=2, 3=1, 4=0
        if(this.r.includes(this.frets.length - idx + '')){
          const y = (parseInt(fret) - 1) * 20;
          const diamond = _use('diamond', { x, y })
          this.$["strings"].appendChild(diamond)
        }
        
        if (fret === "0") {
          const circle = _use('openString', {x})
          this.$["strings"].appendChild(circle)
        } else if(fret === "x" || fret === 'X'){
          const ex = _use('ex', { x })
          this.$["strings"].appendChild(ex)
        } else if(parseInt(fret) > 0){
          const y = (parseInt(fret) - 1) * 20;
          const bubble = _use('bubble', { x, y })
          this.$["strings"].appendChild(bubble)

            // add finger numbers on top of the bubbles
          if(this.fingers[idx]){
            const text = _node("text", { x: x + 1, y: y + 15, fill: 'white', 'text-anchor': 'middle' })
            text.innerHTML = this.fingers[idx] !== "0" ? this.fingers[idx] : '';
            this.$["strings"].appendChild(text)
          }
        }

        // add the text under the tab
        if(this.sub[idx]){
          const y = this.tabHeight + 13;
          const text = _node("text", { x, y, 'text-anchor': 'middle' })
          text.innerHTML = this.sub[idx] !== "_" ? this.sub[idx] : '';
          this.$["svgChord"].appendChild(text)
        }
      });

      const tabX = (this.viewBoxWidth - this.tabWidth)/2
      _translate(tabX, 12 + (this.name ? 25 : 0), this.$.svgChord);
    }

    // show start position on the left side of the tab
    showPosition() {
      const position = parseInt(this.position);
      if (position === 0) {
        const nut = _node("rect", {x: 0,  y: -1, width: this.tabWidth, fill: 'black', height: 4 })
        this.$["frets"].appendChild(nut)
      } else if (position > 0 && position < 100) {
        this.$.position.innerHTML = position;
      }
    }

    parseSub(sub) {
      let subText;
      if (!sub) return [];
      //if using commas in the sub text as separators
      if (sub.indexOf(",") > 0) {
        subText = this.sub.split(",");
      } else {
        subText = this.sub.split("");
      }
      return subText || [];
    }

    // show chord name above the tab
    showName() {
      if (this.name && this.name.length > 0) {
        // move tab down so that there's room for the text above
        _translate(20, 35, this.$.svgChord);
        this.$.chordName.innerHTML = this.name;
        this.$.ukeChordSvg.setAttribute("height", this.viewBoxHeight);
        this.$.ukeChordSvg.setAttribute("viewBox", `0 0 ${this.viewBoxWidth} ${this.viewBoxHeight}`);
      }
    }

    setSize() {
      let ratio = 1
      
      if (this.size === "L" || this.size === "l") {
        ratio = 1.8
      }
      else if(parseFloat(this.size) > 0){
        ratio = this.size;
      }

      this.$.ukeChordSvg.setAttribute("width", this.viewBoxWidth * ratio);
      this.$.ukeChordSvg.setAttribute("height", this.viewBoxHeight * ratio);
      this.$.ukeChordSvg.setAttribute("viewBox", `0 0 ${this.viewBoxWidth} ${this.viewBoxHeight}`);
    }

    setTitle(){
      this.$.title.innerHTML = this.name ? this.name : 'Tab chord';
    } 
  }

  customElements.define('uke-chord', UkeChord);
})();