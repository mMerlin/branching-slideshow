# Development considerations

This is **not** part of the basic project goals.  It **is** a list of some things to be kept in mind while doing development.  Not for immediate implementation (unless convenient), but used to guide decisions that could adversely affect the ability to extend the functionality without major refactoring.

* Jump directly to a specific slide, run time selectable by user
  * outside of the coded navigation links
* auto advance
  * when no branching choices
  * random or rules base branch selection
  * set initial speed (frame rate) in slide show configuration
  * change speed at any slide (transition)
  * full or specified time pause at any slide
  * loop (sub) sequence of slides (cell animation)
    * until user intervention
    * length of time, number of loops
* extensibility
* caching element attributes, but being able to handle if they are changed by outside code
* more `special function` buttons
  * restart, end, refresh, reload, menu (of labelled slides)
  * google (and other) hamburger, 3 bars menu icon, to open sub menu
* (detect) dynamic add/remove/insert slides by other code
* detect dynamic modification of (at least) the active slide attributes
  * adjust the active controls while slide is displayed
* postage stamp slide show, that is not usable until toggled to full screen: only full screen control is available to start
* power point style presentation
* user does not want to have (one of) a previous or next link from a slide
  * full stop start and end
* provide method for slide show developer to associate icon information with navigation controls
  * add custom tags (class, other) to control elements to allow user to target directly
  * suppress normal project styling
  * image file(s)
  * pure css
* delayed navigation control tooltip on hover
