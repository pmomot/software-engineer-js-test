function Logger (debugContainer) {
    const maxVisibleMessages = 10;
    let counter = 0;

    function log (msg) {
        // show debug/state message on screen

        if (counter > maxVisibleMessages) {
            debugContainer.firstChild.remove();
        } else {
            counter += 1;
        }
        debugContainer.innerHTML += `<p> ${msg} </p>`;
    }

    return {
        log
    }
}

module.exports = Logger;
