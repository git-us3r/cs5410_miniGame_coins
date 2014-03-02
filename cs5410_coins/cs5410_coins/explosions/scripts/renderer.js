/*jslint browser: true, white: true */
/*global CanvasRenderingContext2D, requestAnimationFrame, console, MYGAME */
// ------------------------------------------------------------------
// 
// This is the game object.  Everything about the game is located in 
// this object.
//
// ------------------------------------------------------------------


// Quick fix to adapt rendere to work without externals
// 1. create new game object
MYGAME = {};
MYGAME.graphics = {};
MYGAME.images = {};
MYGAME.particles = {};


// CHANGE: set particle animation to last just a few seconds
//
// This two members are used in the explosion annimation
// They might be modified inside the click handler.
//
MYGAME.explosionDuration = 0;       // tracks annimation time.
MYGAME.explosionLength = 2;      // Annimation length in seconds

// 6) ... see MYGAME.graphicsInit
MYGAME.canvas = {};
MYGAME.context = {};


// 2. execute later
 MYGAME.graphicsInit = function() {
    // 'use strict';


    // 6) Give the canvas and context to the game
     //var canvas = document.getElementById('canvas-main');
     //var context = canvas.getContext('2d');
     MYGAME.canvas = document.getElementById('canvas-main');
     MYGAME.context = MYGAME.canvas.getContext('2d');


     // This might grow!!!
     MYGAME.canvas.onmousedown = function (e) {

         var location = {
             x: e.x,
             y: e.y
         };
         MYGAME.setParticles(location);
         MYGAME.explosionDuration = 0;
     };



    //------------------------------------------------------------------
    //
    // Place a 'clear' function on the Canvas prototype, this makes it a part
    // of the canvas, rather than making a function that calls and does it.
    //
    //------------------------------------------------------------------
    CanvasRenderingContext2D.prototype.clear = function () {
        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);
        // this.clearRect(0, 0, canvas.width, canvas.height);
        this.clearRect(0, 0, MYGAME.canvas.width, MYGAME.canvas.height);
        this.restore();
    };

    //------------------------------------------------------------------
    //
    // Expose a 'clear' method for the canvas.
    //
    //------------------------------------------------------------------
    function clear() {
        MYGAME.context.clear();
    }

    //------------------------------------------------------------------
    //
    // Expose an ability to draw an image/texture on the canvas.
    //
    //------------------------------------------------------------------
    function drawImage(spec) {
        MYGAME.context.save();

        MYGAME.context.translate(spec.center.x, spec.center.y);
        MYGAME.context.rotate(spec.rotation);
        MYGAME.context.translate(-spec.center.x, -spec.center.y);

        MYGAME.context.drawImage(
			spec.image,
			spec.center.x - spec.size / 2,
			spec.center.y - spec.size / 2,
			spec.size, spec.size);

        MYGAME.context.restore();
    }

    return {
        clear: clear,
        drawImage: drawImage
    };
};




// 7) Encapsulate particles - away from game loop.
 MYGAME.particlesAnnimation = function (elapsedTime) {

     if (MYGAME.explosionDuration < MYGAME.explosionLength) {
         //
         // Update the current set of particles
         MYGAME.particles.particlesFire.update(elapsedTime);
         MYGAME.particles.particlesSmoke.update(elapsedTime);

         //
         // Render the current set of particles
         MYGAME.particles.particlesFire.render();
         MYGAME.particles.particlesSmoke.render();

         //
         // Generate some new particles
         MYGAME.particles.particlesFire.create();
         MYGAME.particles.particlesFire.create();
         MYGAME.particles.particlesSmoke.create();

         MYGAME.explosionDuration += elapsedTime;

     }
 };




 //------------------------------------------------------------------
 //
 // This is the Game Loop function!
 //
 //------------------------------------------------------------------
 MYGAME.gameLoop = function (time) {

     MYGAME.graphics.clear();

     //
     // Compute elapsed time in seconds
     var elapsedTime = (time - MYGAME.lastTimeStamp) / 1000;
     MYGAME.lastTimeStamp = time;

     MYGAME.particlesAnnimation(elapsedTime);

     requestAnimationFrame(MYGAME.gameLoop);
 };



// 5) Encapsulate particle system creation
 MYGAME.setParticles = function (location) {

     if (location === undefined) {

         location = {
             x: 300,
             y: 300
         };
     }

    
    MYGAME.particles.particlesFire = particleSystem({
       image: MYGAME.images.pic_fire,
         center: { x: location.x, y: location.y },
         speed: { mean: 25, stdev: 10 },
         lifetime: { mean: 1, stdev: 1 }
     },
       MYGAME.graphics
    );

    //MYGAME.particles.particlesSmoke.render();
    MYGAME.particles.particlesSmoke = particleSystem({
        image: MYGAME.images.pic_smoke,
        center: { x: location.x, y: location.y },
            speed: { mean: 25, stdev: 10 },
            lifetime: { mean: 1, stdev: 1 }
        },
     	MYGAME.graphics
    );

 };




//------------------------------------------------------------------
//
// This function performs the one-time game initialization.
//
//------------------------------------------------------------------
MYGAME.initialize = function initialize() {
    //'use strict';

    console.log('game initializing...');

    // 2) ... initialize MYGAME.graphics
    MYGAME.graphics = MYGAME.graphicsInit();


    //
    // One particle system for the fire particles
    //
    // 3. Use new image
    var img1 = new Image();
    img1.src = 'textures/fire.png';
    MYGAME.images.pic_fire = img1;

    // 4. Associate particle systems with MYGAME
    // see MYGAME.setParticles
   // MYGAME.particlesFire = particleSystem({
   //     image: img1,
   //     center: { x: 300, y: 300 },
   //     speed: { mean: 50, stdev: 25 },
   //     lifetime: { mean: 4, stdev: 1 }
   // },
   //    MYGAME.graphics
   //);



    //
    // Another particle system for the smoke particles
    // 3) ...
    var img2 = new Image();
    img2.src = 'textures/smoke.png';
    MYGAME.images.pic_smoke = img2;


    // 4. ...
    //MYGAME.particlesSmoke = particleSystem({
    //    image: img2,
    //    center: { x: 300, y: 300 },
    //    speed: { mean: 50, stdev: 25 },
    //    lifetime: { mean: 4, stdev: 1 }
    //},
	//	MYGAME.graphics
	//);

    
    // 4 ....
    MYGAME.setParticles();


    //
    // Set the initial time stamp
    MYGAME.lastTimeStamp = performance.now();

    requestAnimationFrame(MYGAME.gameLoop);
};


window.onload = function () {

    MYGAME.initialize();
};