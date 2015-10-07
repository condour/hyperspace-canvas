function createBanner(utils, assets) { // u is utils, a is assets
    "use strict";
    // onetime setup 

    /* 

    Main.js, written 2015 by Michael Condouris
    Closure which creates a standard banner object.

    Objects to know:

    utils                               Contains a series of utility functions.

    utils.clone(object1,object2)        Takes the values in object2 and overwrites those values in object1. 
                                        Easy shorthand for copying styles into object.

    makeSprite(asset)                   Curried to take dimensions. Takes an asset, as specified in assets.js. Returns a div, positioned per the bounding 
                                        box in the asset object. Asset contains a bounding box reflecting the original asset size and offset, a multiplier reflecting whether it's 
                                        intended to be 1x or retina.

    makeSplitSprite(asset)              Curried to take dimensions. Takes an asset, as specified in assets.js, and splits it along transparenct vertical lines. 
                                        Returns a div that has divs representing each split within it.
                                        Ideal for copy that needs to stagger.

    makeSizedSprite(                    Curried to take dimensions. Takes any url as the first param, sets it up as an image with the exact positioning specified. 
                uri,x,y,width,height)   Useful for elements that aren't in Assets, or aren't automatically positioned.

    utils.pixify(number)                Rounds the number and adds 'px'.

    assets                              An object which contains all the assets made by the gulp process. These can be used to make sprites using 
                                        the methods above.

    sprites                             An object to which divs are assigned a reference, to maintain a clean namespace.

    */

    // create a variable to track banner time.
    var initialTime = new Date().getTime();
    var observer = undefined;
    var tl = new TimelineMax({onUpdate: function(){if(tl.observer){tl.observer.update(tl)}}});
    var sprites = {};
    var flakes = [];
    var BORDER = "1px solid white"
    // extract dimension sizes from metatag in markup
    var dimensions = utils.extractSize(document.querySelectorAll("[name='ad.size']")[0].getAttributeNode("content").value);
   
var hyperspace;
    function render() {
        

        
        var makeSprite = utils.makeSprite(dimensions);
        //var makeContainer = utils.makeContainer(dimensions);
        var makeSplitSprite = utils.makeSplitSprite(dimensions);
        // pass assets through filter to remove those we don't need, based on whether we're retina or not.
        assets = utils.eliminateRedundantAssetsBasedOnDPI(assets);
        
        // retrieve main layers from markup
        
        sprites.container = document.querySelectorAll('.container')[0]; // everything goes in here
        sprites.aboveClickTag = document.querySelectorAll('.above-click-tag')[0]; // items that don't respond to clicktag, like replay
        sprites.ctaContainer = document.querySelectorAll('.cta-container')[0]; // cta itself (with rollover)
        sprites.belowClickTag = document.querySelectorAll('.below-click-tag')[0]; // anything below cta, which just responds to clicktag

        // set css for the main container to the metatag dimensions

        TweenLite.set(sprites.container, {
            width: utils.pixify(dimensions.width),
            height: utils.pixify(dimensions.height)
        })

        // add border and dimensions to belowClickTag.
        utils.clone(sprites.belowClickTag.style, {
            width: utils.pixify(dimensions.width),
            height: utils.pixify(dimensions.height),
            border: BORDER
        });
        hyperspace = makeHyperspace(0,dimensions,500);
//        sprites.cta = utils.containerize([sprites.cta_arrow,sprites.cta_main],assets.cta_arrow.bbox);
      utils.appendChildrenTo(sprites.belowClickTag)(
                            hyperspace.canvas
                            );

        if(assets.length){
            utils.subscribe("loaded", animate);
        } else {
            animate();
        }
    }

    //The first function in our sequence of animations

    function animate() {
     
            



        sprites.container.style.display = 'block';
        var twnDelay = 0; // running tally of the animation
        var tt = .75; // short for transition time
        var lastPlusSmall = "-=" + (tt * .9);

        
        tl.to(hyperspace,1.5,{length:100,ease:Strong.easeIn})
            /*set(sprites.replayButton, {
                display: "none"
            })*/
           
    }

    function doCtaRollover() {
       console.log("restarting")
       ro.seek(0)
       

    }

    function doCtaRollout() {
/*        TweenLite.to(sprites.ctaRolledOver, .3, {
            opacity: 0
        })*/
    }

    function doReplayRollover() {
        TweenLite.to(sprites.replayButton, .5, {
            rotation: -360,
            transformOrigin: "50% 54%",
            onComplete: resetReplay,
            ease: Linear.easeNone
        });
    }

    function resetReplay() {
        TweenLite.set(sprites.replayButton, {
            rotation: 0
        })
    }

    //Replay the ad
    function replay() {

        tl.restart();
    }

    return {
        start: function() {
            render();
        },
        replay: function(){
            replay();
        },
        pause: function(){
            tl.pause();
        },
        seek: function(t){
            tl.seek(t);
        },
        play: function(){
            tl.play();
        },
        registerUpdateObserver: function(observer){
            tl.observer = observer;
        },
        getDuration: function(){
            return tl.duration();
        }
    }

}
