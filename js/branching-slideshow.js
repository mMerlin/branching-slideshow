/* Branching Slideshow version 0.1.0 */
/*global Hammer */
/*property
    init, jumpToSlide, injectNavigationControls, nextSlide, prevSlide, toggleFullScreen,
    addEventListeners,
    $slides, activeSlide, controls, firstSlide, fullScreen, fullscreenElement,
    el, left, right, navigationControls, numSlides, opts, selector,
    slideNameAttrLookup, slideNumberLookup, swipe, targets,
    add, addEventListener, appendChild, classList, create, concat,
    ALLOW_KEYBOARD_INPUT,
    createDocumentFragment, createElement, documentElement, exitFullscreen,
    forEach, getAttribute,
    hasAttribute, hasOwnProperty, innerHTML, isNaN,
    keys, length, log, mozCancelFullScreen,
    mozFullScreenElement, mozRequestFullScreen, msExitFullscreen,
    msFullscreenElement, msRequestFullscreen, navControlLookup,
    on, push,
    querySelector, querySelectorAll, remove, removeAttribute, requestFullscreen,
    setAttribute, split, srcElement, target, toString,
    webkitExitFullscreen, webkitFullscreenElement, webkitRequestFullscreen
*/
/*property
*/
(function () {
    "use strict";
    const slideConfigSelectorAttr = "data-selector";
    const slideConfigFullScreenAttr = "data-full-screen";
    const slideConfigureStartAttr = "data-start";
    const slideConfigureSwipeAttr = "data-swipe"; // auto-detect library and touch interface? ¦ not enough: user might want one for some slide shows and not others
    // https://www.geeksforgeeks.org/how-to-detect-touch-screen-device-using-javascript/
    // ontouchstart; «msM¦m»axTouchPoints
    // https://github.com/rafrex/detect-touch «obsolete firefox»
    // window.DocumentTouch && document instanceof DocumentTouch
    // const slideConfigControlsAttr = "data-control-definitions";
    const slideNameAttr = "id";
    const navTargetSlideAttr = "data-goto-slide";

    const toggleFullScreenClass = "nav-fullscreen";
    const slideShowingClass = "current-slide";
    const prevLabel = "«";
    const nextLabel = "»";
    const navControlElement = "p";
    const navWrapperElement = "section";
    const navSideElement = "div";
    const navControlsClass = "slide-show-nav-controls";
    const wrapperSelector = ".branching-slideshow"; // used by css
    // const navTargetSelector = "[" + navTargetSlideAttr + "]";
    const navFullScreenSelector = "." + toggleFullScreenClass;
    const navControlSides = ["left", "right"]; // + top + bottom
    const navTargetAttrSuffix = "-slides";
    const navControlAttrSuffix = "-labels";
    const attributeNamePrefix = "data-";
    const sideCssClassSuffix = "-nav";
    // const sideElementSelector = navControlSides.map(function (sideName) {
    //     return navSideElement + "." + sideName + sideCssClassSuffix;
    // }).join(", ");

    const $slideshows = document.querySelectorAll(wrapperSelector); // a collection of all of the slideshow wrapper elements
    const Slideshow = {
        init(el) {
            // console.log("Slideshow.init"); // TRACE
            const that = this;

            // private functions to make the main body of the function easier to read

            function getSlideShowConfiguration(el) {
                // Read slideshow configuration options from the specified element, building
                // a dictionary of settings
                const config_options = {};
                config_options.selector = el.getAttribute(slideConfigSelectorAttr);
                if (config_options.selector === null || config_options.selector === "") {
                    // default to all child elements, regardless of node type, attributes, etc
                    config_options.selector = wrapperSelector + " > *";
                }
                config_options.fullScreen = Boolean(el.getAttribute(slideConfigFullScreenAttr));
                config_options.swipe = Boolean(el.getAttribute(slideConfigureSwipeAttr));
                const raw_option = el.getAttribute(slideConfigureStartAttr);
                config_options.firstSlide = (
                    (raw_option === null || raw_option === "")
                    ? 0
                    : raw_option
                );

                // IDEA: (slideConfigureControlsAttr)

                return config_options;
            } // end of function getSlideShowConfiguration ()

            function cacheSlideInformation() {
                // Collect and store internally information about the slides in the current slideshow
                that.$slides = that.el.querySelectorAll(that.opts.selector); // a collection of all of the slides, caching for performance
                // .children would be a alive nodeList, including the navigation controls, and now allowing slideshow specific overrides
                that.numSlides = that.$slides.length; // total number of slides
                that.slideNameAttrLookup = {};
                that.slideNumberLookup = {};

                // TODO need to refactor this, since need to do again if detect name on a different number, or specified number no longer has the name
                that.$slides.forEach(function (slideEle, slideIndex) {
                    const slideId = slideEle.getAttribute(slideNameAttr);
                    if (slideId !== null) {
                        that.slideNumberLookup[slideId] = slideIndex; // slide number lookup by name
                        that.slideNameAttrLookup[slideIndex] = slideId; // slide name lookup by number
                    }
                });
            } // end of function cacheSlideInformation()

            this.el = el; // current slideshow container element

            this.opts = getSlideShowConfiguration(this.el);
            cacheSlideInformation();

            this.injectNavigationControls(el);
            this.addEventListeners(el);

            this.jumpToSlide(this.opts.firstSlide);
        }, // end init() function

        // Display the requested slide, and setup so navigation points to the correct `next` slides
        jumpToSlide(slideRequest) {
            // console.log("Slideshow.jumpToSlide '" + slideRequest + "'"); // TRACE

            const that = this;
            function slideRequestToIndex(slideIdentifier) {
                if (that.slideNumberLookup.hasOwnProperty(slideIdentifier)) {
                    return that.slideNumberLookup[slideIdentifier];
                }
                // Not a currently recognized named slide identifier.  Try it as a simple numeric index. With range checking
                const slideNumber = Number(slideIdentifier);
                const calcSlide = (
                    (parseInt(slideIdentifier) === slideNumber && slideNumber >= 0 && slideNumber < that.numSlides)
                    ? slideNumber
                    : NaN
                );
                if (calcSlide.isNaN) {
                    // does not seem to be a slide index number either
                    console.log("conversion of '" + slideIdentifier + "' to slide number got NaN result"); // LOG
                }
                return calcSlide;
            } // end function slideRequestToIndex()
            function getNavOptions(slideNumber) {
                // Get the raw navigation options from the slide
                const navOptions = {};
                const sourceSlide = that.$slides[slideNumber];
                navControlSides.forEach(function (sideName) {
                    // Split each of the slide target and control name csv strings to arrays
                    navOptions[sideName] = {};
                    let csvValue = sourceSlide.getAttribute(attributeNamePrefix + sideName + navTargetAttrSuffix);
                    navOptions[sideName].targets = (
                        csvValue === null
                        ? []
                        : csvValue.split(",") // TODO: trim leading and trailing whitespace from entries
                    );
                    csvValue = sourceSlide.getAttribute(attributeNamePrefix + sideName + navControlAttrSuffix);
                    navOptions[sideName].controls = (
                        csvValue === null
                        ? []
                        : csvValue.split(",")
                    );
                });
                if (navOptions.left.targets.length === 0) {
                    navOptions.left.targets.push(that.prevSlide());
                }
                if (navOptions.left.controls.length === 0) {
                    navOptions.left.controls.push(prevLabel);
                }
                if (navOptions.right.targets.length === 0) {
                    navOptions.right.targets.push(that.nextSlide());
                }
                if (navOptions.right.controls.length === 0) {
                    navOptions.right.controls.push(nextLabel);
                }
                return navOptions;
            } // end of function getNavOptions()
            function setNavControlTargets(choices) {
                // Set the navigation controls to provide available choices
                // console.log(choices); // DEBUG
                function getNavigationControl(sideName, navName) {
                    if (that.navControlLookup.hasOwnProperty(sideName)) {
                        if (that.navControlLookup[sideName].hasOwnProperty(navName)) {
                            return that.navControlLookup[sideName][navName];
                        }
                        console.log("requested navigation control '" + navName + "' not found for " + sideName + " side");
                        return null;
                    }
                    console.log("requested navigation control side '" + sideName + "' not found");
                    return null;
                } // end of function getNavigationControl()
                Object.keys(choices).forEach(function (sideName) {
                    choices[sideName].targets.forEach(function (targetSlide, targetIndex) {
                        // const navCtl = choices[sideName].controls[targetIndex];
                        // const navEle = getNavigationControl(sideName, navCtl);
                        const navEle = getNavigationControl(sideName, choices[sideName].controls[targetIndex]);
                        if (navEle !== null) {
                            navEle.setAttribute(navTargetSlideAttr, targetSlide);
                        }
                    });
                });
            } // end of function setNavControlTargets()

            this.activeSlide = slideRequestToIndex(slideRequest); // Get index to the slide to be shown
            // console.log("this.activeSlide = " + this.activeSlide); // TRACE

            // remove showing flag from whichever slide element currently has it
            this.$slides.forEach(function (el) {
                el.classList.remove(slideShowingClass);
            });
            // add showing flag to the one slide item that's supposed to have it now
            this.$slides[this.activeSlide].classList.add(slideShowingClass);

            // configure navigation controls to continue from the current slide

            // remove slide target data from all navigation controls
            this.navigationControls.forEach(function (el) {
                el.removeAttribute(navTargetSlideAttr);
            });
            const navPaths = getNavOptions(this.activeSlide);
            setNavControlTargets(navPaths);
        }, // end jumpToSlide() function

        injectNavigationControls(el) {
            // console.log("start injectNavigationControls"); // TRACE
            // build and inject all of the navigation controls
            // all of the data-right-label and data-left-label csv values,
            // plus the basic previous and next

            // Collect the displayable labels to use as navigation links
            // IDEA: any that are not already configured as part of the slide show
            const rawSides = {};
            navControlSides.forEach(function (sideName) {
                rawSides[sideName] = [];
            });
            this.$slides.forEach(function (el) {
                navControlSides.forEach(function (sideName) {
                    const controlSourceAttr = attributeNamePrefix + sideName + navControlAttrSuffix;
                    if (el.hasAttribute(controlSourceAttr)) {
                        rawSides[sideName] = rawSides[sideName].concat(el.getAttribute(controlSourceAttr).split(","));
                    }
                });
            });
            rawSides.left.push(prevLabel); // Make sure the basic ±1 controls exist
            rawSides.right.push(nextLabel);
            const uniqueSideControls = {};
            navControlSides.forEach(function (sideName) {
                uniqueSideControls[sideName] = [...new Set(rawSides[sideName])];
            });
            const navControlsRoot = document.createElement(navWrapperElement);
            const navControlLookup = {};
            navControlsRoot.classList.add(navControlsClass);
            navControlSides.forEach(function (sideName) {
                navControlLookup[sideName] = {};
                const sideWrapperEle = document.createElement(navSideElement);
                sideWrapperEle.classList.add(sideName + sideCssClassSuffix);
                navControlsRoot.appendChild(sideWrapperEle);
                uniqueSideControls[sideName].forEach(function (navControlId) {
                    const navControlEle = document.createElement(navControlElement);
                    navControlLookup[sideName][navControlId] = navControlEle;
                    navControlEle.innerHTML = navControlId; // «later» separate label from id
                    sideWrapperEle.appendChild(navControlEle);
                });
            });
            this.navControlLookup = navControlLookup;

            // COULD move this to after fragment appended to document, after query select
            if (this.opts.fullScreen) {
                const fullScreenControlEle = document.createElement("span");
                fullScreenControlEle.classList.add(toggleFullScreenClass);
                navControlsRoot.appendChild(fullScreenControlEle);
            }

            // this.navControlsRoot = navControlsRoot;
            const docFrag = document.createDocumentFragment();
            // docFrag.appendChild(this.navControlsRoot);
            docFrag.appendChild(navControlsRoot);
            el.appendChild(docFrag);

            // Need to reference the generated navigation controls regularly (each slide transition).  Create a static nodeList and save it, so will not need to (do repeatedly) later.
            // const tempSelector = "." + navControlsClass + " > " + navSideElement + " > " + navControlElement;
            // console.log("query selector: '" + tempSelector + "'");
            this.navigationControls = el.querySelectorAll("." + navControlsClass + " > " + navSideElement + " > " + navControlElement);

            // Apparent bug in the javascript debugger.  Everything is being reported correctly here, but some elements of the structure are being shown as a single line with no expandable content.
            // const refEle = null; // DEBUG block
            // const refEle1 = null;
            // const refEle2 = null;
            // console.log("navigation element structure built");
            // refEle = el.children[el.childElementCount - 1];
            // console.log(refEle.getAttribute("class")); // slide-show-nav-controls
            // console.log(refEle.childElementCount); // 3
            // refEle1 = refEle.children[0];
            // console.log(refEle1.getAttribute("class")); // left-nav
            // console.log(refEle1.childElementCount); // 1
            // console.log(refEle1.children[0].nodeName); // P
            // console.log(refEle1.children[0].innerHTML); // «
            // refEle2 = refEle.children[1];
            // console.log(refEle2.getAttribute("class")); // right-nav
            // console.log(refEle2.childElementCount); // 1
            // console.log(refEle2.children[0].nodeName); // P
            // console.log(refEle2.children[0].innerHTML); // »
            // if (this.opts.fullScreen) {
            //     console.log(refEle.children[2].nodeName); // SPAN
            //     console.log(refEle.children[2].getAttribute("class")); // nav-fullscreen
            // }
            // console.log("full navigation structure");
        }, // end of injectNavigationControls() function

        addEventListeners(el) {
            const that = this;
            function navClickHandler(event) {
                const evTarget = event.target || event.srcElement;
                const targetSlide = evTarget.getAttribute(navTargetSlideAttr);
                that.jumpToSlide(targetSlide);
            }
            function toggleClickHandler() {
                that.toggleFullScreen(el);
            }

            this.navigationControls.forEach(function (navCtl) {
                navCtl.addEventListener("click", navClickHandler);
            });

            // Add click handler if the full screen toggle control was created
            const optionalControlEle = el.querySelector(navFullScreenSelector);
            if (optionalControlEle !== null) {
                optionalControlEle.addEventListener("click", toggleClickHandler, false);
            }

            if (this.opts.swipe) {
                // TODO detect if hammer.js is loaded
                const ht = new Hammer(el);
                // IDEA: can this be switches to use addEventListener syntax??
                ht.on("swiperight", function (ignore) {
                    that.jumpToSlide(that.prevSlide());
                });
                ht.on("swipeleft", function (ignore) {
                    that.jumpToSlide(that.nextSlide());
                });
            }

            // el.onkeydown = function (e) {
            //     e = e || window.event;
            //     if (e.keyCode === 37) {
            //         that.jumpToSlide(-1); // decrement & show
            //     } else if (e.keyCode === 39) {
            //         that.jumpToSlide(1); // increment & show
            //     }
            // };
        }, // end of addEventListeners() function

        // addSwipe(el) { // move add listener method
        //     const that = this,
        //         ht = new Hammer(el);
        //     ht.on("swiperight", function (e) {
        //         that.jumpToSlide(-1); // decrement & show
        //     });
        //     ht.on("swipeleft", function (e) {
        //         that.jumpToSlide(1); // increment & show
        //     });
        // }, // end of addSwipe() function

        nextSlide() {
            // Determine the next slide number, moving forward, with wrap
            return String(
                this.activeSlide + 1 >= this.numSlides
                ? 0
                : this.activeSlide + 1
            );
        }, // end of nextSlide() function
        prevSlide() {
            // Determine the previous slide number, moving backward, with wrap
            return String(
                this.activeSlide - 1 < 0
                ? this.numSlides - 1
                : this.activeSlide - 1
            );
        }, // end of prevSlide() function

        toggleFullScreen(el) {
            // https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode
            // console.log("start slideShow.toggleFullScreen"); // TRACE
            if (!document.fullscreenElement &&    // alternative standard method
                // IDEA: use memoization so only need to check which function to use one time?  How to store/lookup the ?name? of function on an element?  el does not change from call to call?
                !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {  // current working methods
                if (document.documentElement.requestFullscreen) {
                    el.requestFullscreen();
                } else if (document.documentElement.msRequestFullscreen) {
                    el.msRequestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    el.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    el.webkitRequestFullscreen(el.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }
        } // end toggleFullScreen() function

    }; // end of Slideshow object

    // make instances of Slideshow as needed
    $slideshows.forEach(function (el) {
        const oneShow = Object.create(Slideshow);
        oneShow.init(el);
    });
}());
