
function Block(_x, _y, _motionRate, _blockDim) {

    // Da block
    var block = {};

    // Members
    block.blockDim = _blockDim || 50;
    block.center = { x: _x, y: _y };
    block.motionRate = _motionRate || 1;
    block.visible = true;                         // if false this block shouldn't be.
    block.color = 'black';
    block.img = {};



    // Functions
    block.moveDown = function (timeElapsed) {

        block.center.y += Math.floor(block.motionRate * (timeElapsed));
        //block.center.y += block.motionRate;

    };




    block.updateBlock = function (elapsedTime) {

        if (block.visible) {

            block.moveDown(elapsedTime);
        }
    };




    block.drawBlock = function (graphics) {

        graphics.save();
        graphics.fillStyle = block.color;
        graphics.translate(block.center.x - block.blockDim, block.center.y - block.blockDim);
        graphics.fillRect(0, 0, block.blockDim, block.blockDim);
        graphics.restore();
    };




    block.clickMatches = function(location) {
        var offset = 5;
        if (location.x >= block.center.x - (block.blockDim / 2)
            && location.x <= block.center.x + (block.blockDim / 2)
            && location.y >= block.center.y - (block.blockDim / 2 + offset)
            && location.y <= block.center.y + (block.blockDim / 2 - offset)) {

            // if click occurred anywhere within the box return true
            return true;
        }

        return false;
    }



    return block;
}