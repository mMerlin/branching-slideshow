# Branching Slide Show Documentation

This folder contains documentation for creating and controlling a web page slide show with the provided script.  WIP.  Have to wait and see just how much detail gets created.

* [html structure](slideshow_html_structure.html)

The wrapper element around the whole slide show

* `branching-slideshow` class.  The only required content modification to get a basic slide show to work.

* `data-fullscreen` optional attribute.  Used to control when a full screen toggle link is included with the slide navigation controls.  When not specified, defaults to false (no full screen toggle).  The attribute value is interpreted as javascript `truthy` or `falsy`.  An empty string is falsy, but be aware that the attribute values are strings, so "0" is truthy.  Normally, just leave this attribute off if you do not want full screen toggling.  Set it to "1" or "true" when you do want the ability to toggle full screen for the slide show.

* `data-selector` optional attribute.  Used to limit which html elements within the branching-slideshow class are treated as individual slides.  This is javascript element selector, so if you are using something generic like a `div` element to wrap each slide, and you also use `div` elements within the slide, then a selector of `div` will not do what you want.  It would match the nested div elements as well.
  * The default selector, when none is specific, is `.branching-slideshow > *`, which matches all child elements of the slideshow wrapper element, without any nesting.  To properly match only `div` element children, use `.branching-slideshow > div`.  An explicit class name works fine, like `.my-slide`.  If the slide wrapper element you are using is not nested inside of the slide, it can be used by itself like, `section`.

* 'data-start'

The wrapper element around individual slides

* `id` optional attribute.  A unique name for the slide.  The value can be used in `data-left-slide` and `data-right-slide` attribute csv lists, to specify the target slides for navigation controls displayed on (over) the left and right sides of the slide.
* `data-left-slides` attribute. csv list. previous sequential slide, wrapping to the end
* `data-right-slides` attribute. csv list. next sequential slide, wrapping to the beginning
* `data-left-labels` attribute. "»"
* `data-right-labels` attribute. "»"

* `current-slide` class.  This is set dynamical on the current slide being displayed.  Use this to target css (or code) to the visible slide.

Navigation controls are created dynamically by the javascript code.  They will be child (nested) elements of `branching-slideshow` class elements, but will not be matched by the `data-selector`.  The element types of wrappers and individual controls is an implementation detail that could change at any time, or be different from one control to the next.  Do not rely on any historical value in the next version of the code.  Even a minor dot version could change details here.  It is all supposed to be internal.

side control sets

`«side»-nav` class

individual controls

* `data-goto-slide` attribute.  Dynamically created, deleted, populated attribute specifying the current target slide if the control is invoked.  Any currently useable (visible) slide navigation control will have this attribute.

* `data-nav-control` attribute.  The name of the control.  This is taken from the slide `data-left-control` and `data-right-control` attribute values.  "«" and "»" are predefined, for the the left and right navigation control sets respectively.
  * Not ignoring the warning about relying on historical values, it **IS** <u>possible</u> to apply additional styling to navigation controls.  By matching the side navigation class, control name, and slide target information.  Be aware that the control name is not globally unique.  It is quite possible to have a "chapter 1" navigation control in both the left and right sets.  Which is why, in addition to wanting to avoid collisions with other page content, that the id attribute was not used here.
