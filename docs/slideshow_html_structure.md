# HTML structure for a slide show

A slide show is created as a series of child elements (slides) wrapped inside of another element (slide show).  The outer slide show element needs to have the `branching-slideshow` class.  That is really all there is to it.  Both the slide show element and the slide wrapper elements can be almost any html tag that is valid to use in the body of a document.  They do not even need to be known html tags.  The class name and the location of the child elements are enough.

Exceptions: Using a `table` element for the slide show with tr slides does not work (at least) with recent browsers.  Even without an explicit tbody tag, the parser inserts one around the tr entries.  That makes the tbody tag the slide, instead of each row.  Using some non-standard html, a variation **does** work.  A table slide show with multiple tbody elements processes them as separate slides.

A basic html page that can be used to create a slide show.

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <!-- fill in whatever else you want to use -->
    <link rel="stylesheet" href="css/branching-slideshow.css">
    <link rel="stylesheet" href="css/yourstyling.css">
</head>
<body>
    <!-- optional content -->
    <slideshow class="branching-slideshow">
        <slide>
            <!-- slide content -->
        </slide>
        <slide>
            <!-- slide content -->
        </slide>
        <!-- and repeat -->
    </slideshow>
    <!-- optional content, including additional slideshows, with the same or different tags -->

    <script src="js/branching-slideshow.js"></script>
</body>
</html>
```

Make sure that the javascript is loaded after the slide shows.  The tagged slide show and slide elements must be available in the DOM when the javascript code starts.  If slide content is being loaded dynamically, only the tagged slideshow and child slide elements need to exist for `branching-slideshow.js` to run successfully.

`slideshow` can be, as shown, a non-standard html element name.  In most situations, a standard block, wrapping tag is appropriate.  article, div and section will generally provide [semantic markup](https://html.com/semantic-markup/).  An `ol` slide show works well in some cases.  Each list item becomes a separate slide, with the bonus that number styling specified is shown before each slide.

Inline html tags, like span, em, i, etc also work, though I do not see any reason to use them.

`slide` can be, as shown, a non-standard html element name.  In most situations, a standard block, wrapping tag is appropriate.  article, div and section will generally provide [semantic markup](https://html.com/semantic-markup/).  An additional constraint, is that it needs be an appropriate child element of whatever is used for the `slideshow` element.  For regular html container elements, that is generally not important.  But if `table` or `ol` is used for the slideshow element, `tbody` or `li` better be used for the `slide` element.
