# Socializer.css

Socializer is a css library to create customizable social media sharing buttons and sharebar easily with handful of predefined classes and styles. 

## Features

- **35 icon color schemes** including all famous social media sites
- 6 button shapes, 8 hover styles, 5 text styles, 3 layout types, 17 border, background and shadow styles in total = **12240 different customizations**. See below for the class names.
- Support for **vertical icons**
- Support for vertical and horizontal **sharebar**
- Support for **more** menu

### The HTML

```HTML
<ul class="socializer sr-32px sr-icon-white"> <!-- Customization class names go here -->
	<li class="sr-twitter">
		<a href="#"><i class="fa fa-twitter"></i></a>
	</li>
	<li class="sr-facebook">
		<a href="#"><i class="fa fa-facebook"></i></a>
	</li>
	<li class="sr-googleplus">
		<a href="#"><i class="fa fa-google-plus"></i></a>
	</li>
	<li class="sr-rss">
		<a href="#"><i class="fa fa-rss"></i></a>
        <span class="text">RSS</span>
	</li>
</ul>
```
### With socializer.js
```HTML
<div class="socializer" data-features="32px,circle,icon-white,pad" data-sites="facebook,googleplus,print,email,rss"></div>

<script src="socializer.js"></script>
<script>
(function(){
    socializer( '.socializer' );
}());
</script>
```

## Available CSS classes
Social bar is identified with the class `socializer`. All classes below should be prefixed with `sr-`

|Shapes|Hover effects|Layout types|Text styles|Color styles|Border styles|Others
|----|----|----|----|----|----|----|
|circle|opacity|fluid|text-in|bdr-white|bdr-sm|pad
|squircle|rotate|vertical|text-out|bdr-dark|bdr-md|multiline
|squircle-2|zoom||text-below|bdr-grey|bdr-lg|
|diamond|shrink||text-hover|bg-white|bdr-none|
|drop|float|||bg-dark||
|ribbon|sink|||bg-grey||
||fade-white|||bg-none||
||fade-black|||||

## Sharebar

Wrap the social bar with the predefined sharebar class.
```HTML
<div class="sr-sharebar sr-sb-hl sr-sb-top">
    <!-- Socializer sharebar HTML -->
</div>
```

### Available sharebar CSS classes
Sharebar is identified with the `sr-sharebar` class assigned to the parent of the social bar. All classes below should be prefixed with `sr-sb-`
|Type|Position|Themes|
|---|---|---|
|hl|top|white|
|vl|bottom|dark|
||left||
||right||