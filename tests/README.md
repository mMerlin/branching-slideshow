# Branching Slideshow test files

This folder contains files to (regression) test and exercise the slide show functionality.  If you are interested, these will show ways to push the capabilities to the limits, abuse html, and maybe abuse css as well.  Mostly not anything I would recommend as examples to clone from.  But ideas from small segments could be incorporated into your projects.  With care and consideration of what it means in that context.  The idea, in addition to basic regression test cases, was that if the page and browser did not fall over and play dead when feed some of this, the slideshow code should work fairly well when used with any close to reasonable page.

* [smoke test](smoke-test.html) ¦ basic slide show without customizations.  With full screen, and a bit of different slide content
* [alignment test](alignment-test.html) ¦ vertical navigation control centering check
* [convoluted test](convoluted-test.html)
* [multiple slideshow wrappers](multiple-slideshow-wrappers-test.html)

Planned:

* Extensive (all) slide styling (interaction with controls).
* nested element class overlap with controls
* complex navigation
* duplicate left and right controls
* multiple controls on slide pointing to same slide

Not (intended to be) handled

Target slide that does not exist
adjusting controls to available space (control name = "the slide page with the complete description of this funky feature")
