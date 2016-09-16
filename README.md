# &lt;uke-chord&gt;

A [Polymer](https://www.polymer-project.org) element for a ukulele chord diagram using SVG graphics. See [usage examples and a live demo here](http://pianosnake.github.io/uke-chord/)

![alt tag](http://pianosnake.github.io/uke-chord/big-f.svg)

## Install

### Using the repo directly

Download this repo using the 'Download' button and load the two files from the `dist` directory into your page's HEAD tag. The HTML file is [vulcanized](https://github.com/Polymer/vulcanize) to include all Polymer dependencies.
	
	<script src="dist/webcomponents-lite.min.js"></script>
	<link rel="import" href="dist/uke-chord.html">

### Using Bower

Install using [Bower](http://bower.io/)

	bower install uke-chord

Import the webcomponents.js polyfill and link `uke-chord.html` in the HEAD tag.

	<script src="bower_components/webcomponentsjs/webcomponents-lite.js"></script>
	<link rel="import" href="bower_components/uke-chord/uke-chord.html">

## Develop

Download this repo and submit pull requests.

Start `polyserve` and visit <http://localhost:8080/components/uke-chord/>

Before pushing changes, run `gulp` to populate the dist directory and vulcanize all Polymer dependencies.

## License

[MIT License](http://opensource.org/licenses/MIT)
