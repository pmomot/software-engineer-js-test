function FileUpload (fileSelector, fileUploadCallback) {
    function fileChange (e) {
        const validFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
        // get all selected Files
        const files = e.target.files;
        let file;

        for (let i = 0; i < files.length; ++i) {
            file = files[i];
            // check if file is valid Image (just a MIME check)
            if (!validFileTypes.includes(file.type)) {
                return;
            }
            const reader = new FileReader();
            reader.onload = fileUploadCallback;
            reader.readAsDataURL(file);
            // process just one file.
        }
    }

    function init () {
        fileSelector.onchange = fileChange;
    }

    init();
}

module.exports = FileUpload;
