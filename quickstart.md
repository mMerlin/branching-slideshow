# Branching slide show quick start

To get a slide show up and running on an existing page:

* copy the `branching-slideshow.css` file to your css folder
* copy the `branching-slideshow.js` file to your javascript folder
* in the `head` section of your page, add a reference to the css file
  * `<link rel="stylesheet" href="css/branching-slideshow.css">`
* at the end of the `body` section, load the javascript file
  * `<script src="js/branching-slideshow.js"></script>`
* add `class="branching-slideshow"` to the html element that contains the slides as it's children

For a basic slide show, with only next and previous slide navigation, that is all that is needed.  To provide the option to view the slides in full screen, add `data-full-screen="true"` to the slide show wrapper element, along with the class.

Any styling of the slide content is up to you.

If no slide show content yet exists, one basic structure is:

```html
<div class="branching-slideshow" data-full-screen="true">
    <section><!-- slide 1 content --></section>
    <section><!-- slide 2 content --></section>
</div>
```

section could be changed to article, but to pass validation, either need to contain a header element.  div can easily be changed to article or section, but again, the validator will complain about a lack of a header element.  A generic div will work for both cases, but does not provide much in the way of semantic meaning.  See the [documentation](docs/README.html), [demo](demo/README.html), and [test](tests/README.html) files for details and examples.
