function roundToDecimals (precision) {
    return function round (number) {
        return +(number).toFixed(precision);
    }
}

const roundToOneDecimal = roundToDecimals(1);

function CanvasImagePlacement ({container, logger, config}) {
    const body = document.getElementById('body');
    let canvasSizePixels = {};
    let dx = 0, dy = 0;
    let sizeMultiplier = 1;
    let context;
    let img;

    // --- initialisation start ---
    function getCanvasContextAndSize () {
        context = container.getContext('2d');
        canvasSizePixels.width = context.canvas.clientWidth;
        canvasSizePixels.height = context.canvas.clientHeight;
    }

    function loadImage () {
        img = new Image();
        img.src = config.canvas.photo.id;
        img.onload = () => {
            body.classList.add('image-loaded');
            draw();
            logger.log('Image is loaded');
        };
    }

    function setInitialImagePosition () {
        const conversionRate = canvasSizePixels.width / config.canvas.width;
        dx = roundToOneDecimal(config.canvas.photo.x * conversionRate || 0);
        dy = roundToOneDecimal(config.canvas.photo.y * conversionRate || 0);
        sizeMultiplier = roundToOneDecimal(config.canvas.photo.width * conversionRate / canvasSizePixels.width || 1);
    }

    function init () {
        getCanvasContextAndSize();
        loadImage();
        setInitialImagePosition();
    }
    // --- initialisation end ---

    function clear () {
        context.clearRect(0, 0, canvasSizePixels.width, canvasSizePixels.height);
    }

    function draw () {
        clear();
        const newWidth = roundToOneDecimal(canvasSizePixels.width * sizeMultiplier);
        const newHeight = roundToOneDecimal(canvasSizePixels.height * sizeMultiplier);
        context.drawImage(img, dx, dy, newWidth, newHeight);
    }

    function validateImagePlacement (newSizeMultiplier, newDx, newDy) {
        if (
            newDx > 0 || newDy > 0 ||
            canvasSizePixels.width * newSizeMultiplier + newDx < canvasSizePixels.width ||
            canvasSizePixels.height * newSizeMultiplier + newDy < canvasSizePixels.height
        ) {
            logger.log('Action cannot be performed');
            return false;
        }
        return true;
    }

    function sizeIncrease () {
        sizeMultiplier = roundToOneDecimal(sizeMultiplier + 0.1);
        draw();
        logger.log('Size 10% increase');
    }

    function sizeDecrease () {
        const newSizeMultiplier = roundToOneDecimal(sizeMultiplier - 0.1);
        const isPlacementValid = validateImagePlacement(newSizeMultiplier, dx, dy);

        if (!isPlacementValid) {
            return
        }

        sizeMultiplier = newSizeMultiplier;
        draw();
        logger.log('Size 10% decrease');
    }

    function moveLeft () {
        const isPlacementValid = validateImagePlacement(sizeMultiplier, dx - 10, dy);

        if (!isPlacementValid) {
            return
        }

        dx -= 10;
        draw();
        logger.log('Move left');
    }

    function moveRight () {
        const isPlacementValid = validateImagePlacement(sizeMultiplier, dx + 10, dy);

        if (!isPlacementValid) {
            return
        }

        dx += 10;
        draw();
        logger.log('Move right');
    }

    function moveUp () {
        const isPlacementValid = validateImagePlacement(sizeMultiplier, dx, dy - 10);

        if (!isPlacementValid) {
            return
        }

        dy -= 10;
        draw();
        logger.log('Move up');
    }

    function moveDown () {
        const isPlacementValid = validateImagePlacement(sizeMultiplier, dx, dy + 10);

        if (!isPlacementValid) {
            return
        }

        dy += 10;
        draw();
        logger.log('Move down');
    }

    function scaleToFit () {
        sizeMultiplier = 1;
        dx = 0;
        dy = 0;
        draw();
        logger.log('Scaled to fit');
    }

    function exportConfig () {
        const conversionRate = canvasSizePixels.width / config.canvas.width;
        return {
            canvas: {
                width: config.canvas.width,
                height: config.canvas.height,
                photo : {
                    id: 'fileName',
                    width: roundToOneDecimal(canvasSizePixels.width * sizeMultiplier / conversionRate),
                    height: roundToOneDecimal(canvasSizePixels.height * sizeMultiplier / conversionRate),
                    x: roundToOneDecimal(dx / conversionRate),
                    y: roundToOneDecimal(dy / conversionRate)
                }
            }
        };
    }

    init();

    // exposed api
    return {
        sizeIncrease,
        sizeDecrease,
        moveLeft,
        moveRight,
        moveUp,
        moveDown,
        scaleToFit,
        exportConfig
    };
}

module.exports = { CanvasImagePlacement, roundToDecimals };
