// mini game make a stack of boxes fall un button press.




// Data

var GAME = {};
GAME.Graphics = {};

GAME.Data = {};
GAME.Data.numberOfBlocks = 10;
GAME.Data.blocks = [];
GAME.Data.oldTime = 0;
GAME.Data.elapsedTime = 0;
GAME.Data.blockDim = 50;
GAME.Data.oldTime = 0;
//GAME.Data.refresh = false;

GAME.graphicsInit = function () {
    // Graphics / input
    var canvas = document.getElementById('canvas-main');        // private
    canvas.onmousedown = function (e) {

        var location = { x: e.x, y: e.y };

        // for each block
        // if click matches
        // paint different color.
        GAME.Data.blocks.forEach(function (element, index, array) {


            if (element.clickMatches(location)) {

                element.color = 'red';
            }
        });

    };


    // Context
    var ctx = canvas.getContext('2d');
    ctx.clear = function () {
        ctx.save();
        ctx.fillStyle = 'blue';                                 // in general, background
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    };


    // Bundle the graphics object.
    GAME.Graphics.canvas = canvas;
    GAME.Graphics.context = ctx;
    GAME.Graphics.clear = GAME.Graphics.context.clear;
};



//function clickMatches(_event, _block) {
//    var offset = 5;
//    if (_event.x >= _block.center.x - (_block.blockDim / 2)
//        && _event.x <= _block.center.x + (_block.blockDim / 2)
//        && _event.y >= _block.center.y - (_block.blockDim / 2 + offset)
//        && _event.y <= _block.center.y + (_block.blockDim / 2 - offset)) {

//        // if click occurred anywhere within the box return true
//        return true;
//    }

//    return false;
//}





    


//ctx.drawBlock = function (_block) {

//    ctx.save();
//    ctx.fillStyle = _block.color;
//    ctx.translate(_block.center.x - _block.blockDim, _block.center.y - _block.blockDim);
//    ctx.fillRect(0, 0, _block.blockDim, _block.blockDim);
//    ctx.restore();
//};



// WTF !? ... 
//ctx.i = 10;
//ctx.j = 10;



// private ... Ctor of private member block ... kindda ;)
//function Block(_x, _y, _motionRate, _blockDim) {

//    var block = {};
//    block.blockDim = _blockDim || 50;
//    block.center = { x: _x, y: _y };
//    block.motionRate = _motionRate || 1;
//    block.outOfCanvas = false;                         // if true the block if out of the canvas
//    block.color = 'black';
//    block.moveDown = function (timeElapsed) {

//        block.center.y += Math.floor(block.motionRate * (timeElapsed));
//        //block.center.y += block.motionRate;

//    };

//    return block;

//}



// Deprecated .... in favor of random.js
GAME.rangedRand = function (_lBound, _rBound) {

    _lBound = _lBound || 0;

    if (!_rBound || _rBound === 1) {

        _rBound = 1;
    }
    else {

        _rBound++;
    }


    var r = 1;
    if (_lBound === 0 && _rBound === 1) {

        r = Math.random();
    }
    else {

        r = Math.floor(_lBound + Math.random() * _rBound);
    }
    return r;

}



// private
GAME.initializeRandomBlocks = function () {

    // Reset blocks.
    GAME.Data.blocks.length = 0;

    var canvasMean = GAME.Graphics.canvas.width / 2 - 50;
    var canvaStd = canvasMean - GAME.Data.blockDim;

    for (var i = 0; i < GAME.Data.numberOfBlocks; ++i) {

        //blocks.push(Block(rangedRand(0, canvas.width - that.defaultBlockDim), 0, rangedRand(100, 200)));

        // Adjust small and negative numbers
        var xPosition = Math.max(GAME.Data.blockDim, Random.nextGaussian(canvasMean, canvaStd));
        xPosition = Math.min(xPosition, GAME.Graphics.canvas.width - 100);          // OJO this is important for menus.

        // Adjust negative speeds
        var speed = Math.max(80, Random.nextGaussian(120, 50));

        GAME.Data.blocks.push(Block(xPosition, 0, speed, GAME.Data.blockDim));
    }

    //GAME.Data.refresh = false;
}




// private
GAME.updateBlocks = function (elapsedTime) {

    GAME.Data.blocks.forEach(function (element, index, array) {

        element.updateBlock(elapsedTime);

        console.log('updating block at: (' + element.center.x + ', ' + element.center.y + ')');

        if (element.center.y > GAME.Graphics.canvas.height + (element.blockDim / 2)) {

            element.visible = false;
        }

    });


    var doneBlocks = 0;
    for (var i = 0; i < GAME.Data.blocks.length; i++) {

        if (!GAME.Data.blocks[i].visible) {

            doneBlocks++;
        }
    }

    
    if (doneBlocks === GAME.Data.blocks.length) {

        GAME.initializeRandomBlocks();
    }

    
}



// private
GAME.drawBlocks = function() {
    
    GAME.Graphics.clear();

    GAME.Data.blocks.forEach(function (element, index, array) {

        if (element.visible) {

            console.log('drawing at: (' + element.center.x + ', ' + element.center.y + ')');

            element.drawBlock(GAME.Graphics.context);

        }
    });
}



GAME.annimationLoop = function () {

    GAME.Data.elapsedTime = performance.now() - GAME.Data.oldTime;
    GAME.updateBlocks(GAME.Data.elapsedTime / 1000);           // send it in seconds
    GAME.drawBlocks();
    GAME.Data.oldTime = performance.now();
    //oldTime = elapsedTime;
    requestAnimationFrame(GAME.annimationLoop);
}



GAME.runAnnimation = function () {

    GAME.graphicsInit();
    GAME.initializeRandomBlocks();

    GAME.Data.oldTime = performance.now();
    //requestAnimationFrame(annimationLoop);
   GAME.annimationLoop();
};


window.onload = function () {

    GAME.runAnnimation();
};