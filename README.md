# Branching Slide Show

This evolved out of a need to have a slide show that provided user selectable branching paths.  Initial research found some slide show functionality using standard html and css based on anchor tags, and more mixing in javascript to manipulate tags that are used by css.  Nothing simply enough that provided the functionality I wanted.

Still trying to keep it small and simple, the functionality has been extended to handle additional envisioned scenarios.  To handle as wide of range of markup, styling and standards compliance as practical.  This tries not to enforce any constraints on the web page developer.  Using variations of [normalizer](https://necolas.github.io/normalize.css/) or [reset](https://cssauthor.com/css-reset-stylesheets/) (or full css framework environments) can make pages look much more consistent across browsers.  But none of that is used here, where it would likely conflict with the choices made by the page developers.  Which means that tuning of the slide show css rules might be needed to fit your existing environment.  A trade-off against fine tuning the slide show appearance so much that it interferes with the content and page that is supposed to support.

* [quick start](quickstart.html)
* [Goals](#link_goals)
* [usage considerations](#link_usage_considerations)
* [Documentation](docs/README.html)
* [Implementation](#link_implementation)
* [Development Considerations](considerations.html)
* [Scratch pad notes](scratchpad.html)
* [version](#link_version)

<!--
* [Link](#link_link)
## <a name="link_link">⚓</a> Link
-->

## <a name="link_usage_considerations">⚓</a> Usage Considerations

With the basic structure used, standard html page loading will fully load all slide content, thought it is not initially visible. This makes the slide show very responsive (to user requests).  This also means though that initial page load can be slow.  In most situations, you will probably not want to created a slide show of a hundred high resolution images.  That situation can be handled, as well as slides that need to load dynamic information, by initially only creating (and loading) the shell of the slide show, plus the first slide.  Then after the page itself is loaded and rendered, continue to load content in the background with variations of thumbnails, ajax, websockets, asynchronous and lazy loading.  Branching-slideshow will handle that just fine.  It only cares that the wrapper elements exist, to that it can build an internal list, and cache the navigation information.

## <a name="link_goals">⚓</a> Goals

* support (but do not limit to) semantic markup
* no DOM namespace pollution
* configuration using optional attributes on slide show wrapper element
  * no parameters passed in calls to the javascript code
* control actions using optional attributes on slide wrapper elements
* multiple slide shows in a single page
* minimal markup needed for a single threaded slide series
* robust and standard javascript code
* small footprint
* simplicity for the common use cases
* power and flexibility without needing additional javascript
* no adjustments needed to existing content when inserting a new slide
* no changes to existing slide show when adding another slide show to the same page
* avoid naming collisions between slide shows, and with user content in and outside of the slide shows.

## <a name="link_implementation">⚓</a> Implementation information

This uses javascript to insert a slide show control interface into a slide show wrapper element.  Each child element in the wrapper can be (usually is) an individual slide.  Styling of the slide content is left up to user.  The branching slide show and css provide navigation controls and manage displaying one slide at time.  Other effects are up to who ever is writing the web page.  Opacity is used for hiding and showing slides, so simple transparency transition effects are easy to add.

Both the slide show wrapper and slide show element tags are very flexible.  Anything that is capable of being set to `display: block` should work.  The slide wrapper of course needs to be able to contain what ever is to be displayed.  The demos «to be written» show some possibilities sticking with standard, html5.  Suggestions are section, article, div for the slide show, section, article, div, figure for slides.  Most things that work with standard page layout should work.

## <a name="link_version">⚓</a> Version

Branching Slideshow version 0.1.0
