# &lt;uke-chord&gt;

A [Polymer](https://www.polymer-project.org) element for a ukulele chord diagram using SVG graphics. See usage examples and a live demo at <http://pianosnake.github.io/uke-chord/>

![alt tag](https://92fcb41a43d1d336366489008203152e7a54f1a8-www.googledrive.com/host/0B2yJBQz-_X5XSk9KMXd0UEgzYmM/sample-chord.png)

## Install

### Using the repo directly

Download this repo using the 'Download' button and load the two files from the `dist` directory into your page's HEAD tag.
	
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

Run `gulp` to populate the dist directory before pushing changes.

## License

[MIT License](http://opensource.org/licenses/MIT)