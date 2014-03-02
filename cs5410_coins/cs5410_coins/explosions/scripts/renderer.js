
MYGAME = {};

// Members
MYGAME.graphics = {};           // Graphics object to interface with particle-system
MYGAME.images = {};             // Conntains images (fire, smoke, coins, etc).
MYGAME.explosions = [];         // Contains active and past explosions.
MYGAME.canvas = {};
MYGAME.context = {};

// Not sure if these are in use ...
MYGAME.explosionDuration = 0;       // tracks annimation time.
MYGAME.explosionLength = 2;      // Annimation length in seconds



// Functions
MYGAME.explosion = function (_maxDuration, _particles) {

    var that = {};
    that.maxDuration = _maxDuration || 2;
    that.duration = 0;
    that.active = false;
    that.particles = _particles;

    return that;
};



// Initializes graphics members.
MYGAME.graphicsInit = function() {

    MYGAME.canvas = document.getElementById('canvas-main');
    MYGAME.context = MYGAME.canvas.getContext('2d');


    //
    // Consider making this a function,
    // since there are more images. .... TODO
    //
    // Load up images
    var img1 = new Image();
    img1.src = 'textures/fire.png';
    MYGAME.images.pic_fire = img1;

    var img2 = new Image();
    img2.src = 'textures/smoke.png';
    MYGAME.images.pic_smoke = img2;


    // Mouse handling
    MYGAME.canvas.onmousedown = function (e) {

        // Replace the body with a function call and write it outside.
        var location = {
             x: e.x,
             y: e.y
         };
         
         MYGAME.setParticles(location);
     };


    ////
    // Expose clear function
    // Copied from Dr. Mathias : USU 5410 Spr2014
    ///
     MYGAME.context.clear = function () {

         MYGAME.context.save();
         MYGAME.context.setTransform(1, 0, 0, 1, 0, 0);
         MYGAME.context.clearRect(0, 0, MYGAME.canvas.width, MYGAME.canvas.height);
         MYGAME.context.restore();
     };
    


    //////
    // Expose an ability to draw an image/texture on the canvas.
    // Copied from Dr. Mathias : USU 5410 Spr2014
    ////
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


    // Return graphics public interface (clear and drawImage functions).
    return {
        clear: MYGAME.context.clear,
        drawImage: drawImage
    };
};




// 7) Encapsulate particles - away from game loop.
MYGAME.particlesAnnimation = function (elapsedTime) {

    MYGAME.explosions.forEach(function (element, index, array) {

        // Algorithm adapted from Dr. Mathias Particles example.
        if (element.active) {
            element.particles.fire.update(elapsedTime);
            element.particles.smoke.update(elapsedTime);

            element.particles.fire.render();
            element.particles.smoke.render();

            element.particles.fire.create();
            element.particles.fire.create();
            element.particles.smoke.create();
        }

    });
};



// Update scores and animations
MYGAME.update = function (elapsedTime) {


    // Update all active explosions
    for (var i = 0; i < MYGAME.explosions.length; i++) {

        if (MYGAME.explosions[i].active) {

            MYGAME.explosions[i].duration += elapsedTime;

            if (MYGAME.explosions[i].duration > MYGAME.explosions[i].maxDuration) {

                MYGAME.explosions[i].active = false;
            }
        }
    }



    // other updates.
    // TODO:
    // Here is where clicks are verified and explosions setup ... eventually.
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

     MYGAME.update(elapsedTime);

     // This needs to be changed to a more general function
     // which calls particlesAnnimation, but also the rest.
     MYGAME.particlesAnnimation(elapsedTime);

     requestAnimationFrame(MYGAME.gameLoop);
 };



/////
// Creates a particle system and assigns it to most
// appropriate location in explosions member.
//////
MYGAME.setParticles = function (location) {


    // Default location : hopefully never used.
    if (location === undefined) {

        location = {
            x: 300,
            y: 300
        };
    }

    
    // Fire particle system
    var fire = particleSystem({
       image: MYGAME.images.pic_fire,
         center: { x: location.x, y: location.y },
         speed: { mean: 25, stdev: 10 },
         lifetime: { mean: 1, stdev: 1 }
     },
       MYGAME.graphics
    );

  
    // Smoke particle system
    var smoke = particleSystem({
        image: MYGAME.images.pic_smoke,
        center: { x: location.x, y: location.y },
            speed: { mean: 25, stdev: 10 },
            lifetime: { mean: 1, stdev: 1 }
        },
     	MYGAME.graphics
    );


    // Bundle the particle systems (fire/smoke) into explosion object
    var prt = {fire: fire, smoke: smoke};
    var ex = MYGAME.explosion(MYGAME.explosionDuration, prt);
    ex.active = true;


    // find innactive explosion in explosions (or create one) and add ex to it.
    var added = false;
    for (var i = 0; i < MYGAME.explosions.length; i++) {

        if (!MYGAME.explosions[i].active) {

            MYGAME.explosions[i] = ex;
            added = true;
            break;
        }
    }

    if (!added){
    
        MYGAME.explosions.push(ex);
    }  

};




//------------------------------------------------------------------
//
// This function performs the one-time game initialization.
//
//------------------------------------------------------------------
MYGAME.initialize = function initialize() {

    console.log('game initializing...');

    // Initialize graphics.
    MYGAME.graphics = MYGAME.graphicsInit();

    //
    // Set the initial time stamp.
    MYGAME.lastTimeStamp = performance.now();

    // Begin annimation loop.
    requestAnimationFrame(MYGAME.gameLoop);
};


window.onload = function () {

    MYGAME.initialize();
};