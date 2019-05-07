const { CanvasImagePlacement } = require('./canvas-image-placement');
const FileUpload = require('./file-upload');
const Logger = require('./logger');

const canvasSize = {
    width: 15,
    height: 10
};
const preLoadedImageConfig = {
    canvas: {
        ...canvasSize,
        photo: {
            id: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80',
            width: 67.5,
            height: 45,
            x: -16.5,
            y :-11.5
        }
    }
};

function App () {
    let canvasImage;
    const imageContainer = document.getElementById('imageContainer');

    function fileUploadCallback () {
        canvasImage = new CanvasImagePlacement({
            container: imageContainer,
            logger,
            config: {
                canvas: {
                    ...canvasSize,
                    photo: {
                        id: this.result
                    }
                }
            }
        });
    }

    function importConfig () {
        canvasImage = new CanvasImagePlacement({
            container: imageContainer,
            logger,
            config: preLoadedImageConfig
        });
    }

    function exportConfig () {
        const config = canvasImage.exportConfig();
        log(JSON.stringify(config));
    }

    function addClickEventHandlers () {
        document.getElementById('sizeIncrease').onclick = () => canvasImage.sizeIncrease();
        document.getElementById('sizeDecrease').onclick = () => canvasImage.sizeDecrease();
        document.getElementById('moveLeft').onclick = () => canvasImage.moveLeft();
        document.getElementById('moveRight').onclick = () => canvasImage.moveRight();
        document.getElementById('moveUp').onclick = () => canvasImage.moveUp();
        document.getElementById('moveDown').onclick = () => canvasImage.moveDown();
        document.getElementById('scaleToFit').onclick = () => canvasImage.scaleToFit();
        document.getElementById('importButton').onclick = importConfig;
        document.getElementById('generateButton').onclick = exportConfig;
    }

    function addKeyDownEventHandlers () {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'i') {
                importConfig();
            }
            if (!canvasImage) {
                return;
            }
            switch (event.key) {
                case 'ArrowUp':
                    canvasImage.moveUp();
                    break;
                case 'ArrowDown':
                    canvasImage.moveDown();
                    break;
                case 'ArrowLeft':
                    canvasImage.moveLeft();
                    break;
                case 'ArrowRight':
                    canvasImage.moveRight();
                    break;
                case '-':
                    canvasImage.sizeDecrease();
                    break;
                case '+':
                case '=':
                    canvasImage.sizeIncrease();
                    break;
                case 'e':
                    exportConfig();
                    break;
            }
        }, false);
    }

    function addEventHandlers () {
        addClickEventHandlers();
        addKeyDownEventHandlers();

        new FileUpload(document.getElementById('fileSelector'), fileUploadCallback);
    }

    function init () {
        addEventHandlers();
        return new Logger(document.getElementById('debugContainer'));
    }

    function log (data) {
        logger.log(data);
    }

    const logger = init();

    return {
        log
    }
}

module.exports = App;
