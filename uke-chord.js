(function () {
  const svg = `
<svg id="ukeChordSvg" width="90" height="112" viewBox="0 0 90 112" style="font-family: sans-serif; font-size: 11px;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <title id="title">uke-chord</title>
  <text id="chordName" x="50%" y="16"  text-anchor="middle" style="font-size: 16px;"></text>
  <defs>
    <circle id="bubble" r="6" transform="translate(1,11)"/>
    <path id="ex" d="M0,0L8,8m0,-8L0,8" stroke="black" stroke-width="1.1" transform="translate(-3,-11)"/>
    <circle id="openString" r="4" fill="none" stroke="black" stroke-width="1" transform="translate(1,-7)"/>
    <rect id="diamond" width="14" height="14" transform="translate(1,2),rotate(45)"></rect>
  </defs>
  <g id="tab">
    <text id="position" x="-6" y="15" text-anchor="end"></text>
    <g id="frets"></g>
    <g id="strings"></g>
  </g>
</svg>`;
  const defaultFretCount = 4;
  const maxFretCount = 20;
  const maxStringCount = 10;

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

      // add all svg elements with an id to this.$
      const elementsWithId = template.content.querySelectorAll('*[id]');
      this.$ = {};
      elementsWithId.forEach(el => { this.$[el.id] = el; })
      
      // parameter parsing
      if(this.frets){
        this.frets = this.frets ? this.frets.split("").slice(0, maxStringCount) : [];
      }else{
        throw Error('frets attribute is required')
      }
      
      this.fingers = this.fingers ? this.fingers.split("") : [];
      this.sub = this.parseSub(this.sub)
      this.size = this.parseSize(this.size)
      this.r = this.r ? this.r.split("") : [];
      this.position = parseInt(this.position) || null;
      this.name = (this.name && this.name.length > 0) ? this.name : null
      this.fretCount = this.parseLength(this.length)

      // computed properties
      this.tabWidth = (this.frets.length - 1) * 20 + 2;
      this.viewBoxWidth = this.tabWidth + 30 + (this.position ? 6 : 0);
      this.tabHeight = this.fretCount * 20;
      this.viewBoxHeight = this.tabHeight + 25 + (this.name ? 25 : 0);
      this.tabX = (this.viewBoxWidth - this.tabWidth)/2;
      this.tabY = 12 + (this.name ? 20 : 0);
      
      this.render()

      if(this.hasAttribute('img')){
        // create an image that can be saved by the user and possibly indexed by search engines
        const img= document.createElement("img");
        img.alt = (this.name ? `${this.name} ` : '' ) + 'chord'
        img.title = img.alt
        img.src = `data:image/svg+xml;utf8,${encodeURIComponent(template.innerHTML.replace(/\s*(\r\n|\n|\r)\s*/gm,""))}`
        this.shadowRoot.appendChild(img)
      }else{
        // append the SVG inline by appending the template content
        this.shadowRoot.appendChild(template.content);
      }
    }

    render() {
      this.showPosition();
      this.showName();

      // add horizontal fret lines
      for(let i=0; i< this.fretCount + 1; i++){
        const fret = _node("rect", {x: 0,  y: i * 20, width: this.tabWidth, fill: 'black', height: 2 })
        this.$["frets"].appendChild(fret)
      }

      // add vertical strings, and for each string a bubble, an open circle marker, an x marker, and a fingering
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

        // add the text under each string
        if(this.sub[idx]){
          const y = this.tabHeight + 13;
          const text = _node("text", { x, y, 'text-anchor': 'middle' })
          text.innerHTML = this.sub[idx] !== "_" ? this.sub[idx] : '';
          this.$["tab"].appendChild(text)
        }
      });

      _translate(this.tabX, this.tabY, this.$.tab);
      this.$.ukeChordSvg.setAttribute("width", this.viewBoxWidth * this.size);
      this.$.ukeChordSvg.setAttribute("height", this.viewBoxHeight * this.size);
      this.$.ukeChordSvg.setAttribute("viewBox", `0 0 ${this.viewBoxWidth} ${this.viewBoxHeight}`);
    }

    // show start position on the left side of the tab
    showPosition() {
      const p = this.position;
      if (p === 0) {
        // draw a thick bar at the top representing the nut
        const nut = _node("rect", {x: 0,  y: -1, width: this.tabWidth, fill: 'black', height: 4 })
        this.$["frets"].appendChild(nut)
      } else if (p > 0 && p < 100) {
        this.$.position.innerHTML = p;
      }
    }

    // show chord name above the tab
    showName() {
      if(this.name) this.$.chordName.innerHTML = this.name;
      this.$.title.innerHTML = this.name || 'Tab';
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

    parseSize(size) {
      let ratio = 1
      if (size === "L" || size === "l") {
        ratio = 1.8
      } else if(parseFloat(size) > 0){
        ratio = size;
      }
      return ratio
    }

    parseLength(length){
      let len = parseInt(length)
      if(!len || len > maxFretCount) len = defaultFretCount;
      return len;
    }
  }

  customElements.define('uke-chord', UkeChord);
})();
