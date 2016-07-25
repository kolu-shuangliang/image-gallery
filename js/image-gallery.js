var ImageGallery = function () {
    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
    // VARIABLES
    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
    var location = null;

    var viewer = {
        dom: init_viewer(),
        widthHalf: null
    };
    var closeButton = {
        dom: init_close_button()
    };
    var files = {
        dom: document.getElementById('ig-thumbnail-container'),
        current: 0,
        max: 0,
        selected: null
    };
    var folders = {
        dom: document.getElementById('ig-container'),
        ipr: null,
        minWidth: null,
        selected: null
    };


    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
    //
    // PUBLIC FUNCTIONS
    //
    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
    function init(galleryLocation) {
        console.log('Initializing Image Gallery!');
        console.log('-- Location: [ ' + galleryLocation + ' ] ');

        location = galleryLocation;

        // Calculate width/height. Thumbnails width/height ratio are 1:1
        folders.ipr = Number( folders.dom.getAttribute( 'ig-fpr' ) );
        folders.minWidth = Number( folders.dom.getAttribute( 'ig-w' ) );
        folders.titleHeight = 40;

        // Calculate half width of viewer element for click event
        viewer.widthHalf = document.body.offsetWidth / 2;

        // Generate DOM content for img-gallery-folders
        generateImageGallery();
    }


    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
    //
    // PRIVATE FUNCTIONS
    //
    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

    // Initialize viewer and close viewer button.
    // returns viewer at end.
    function init_viewer() {
        var tempEle = document.getElementById('ig-viewer');

        tempEle.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            // Check if click position is on left or right side of viewer
            // Also checks if there's more images to left/right by using folders.current
            if ((event.pageX - this.offsetLeft) < viewer.widthHalf && files.current - 1 >= 0) {
                eventFire(files.dom.querySelector('[nro="' + --files.current + '"]'), 'click');
            }
            if ((event.pageX - this.offsetLeft) >= viewer.widthHalf && files.current + 1 < files.max) {
                eventFire(files.dom.querySelector('[nro="' + ++files.current + '"]'), 'click');
            }
        }, false);

        window.addEventListener('resize', function () { viewer.widthHalf = document.body.offsetWidth / 2; });

        return tempEle;
    }
    // Initialize button that closes viewer when it's visible.
    function init_close_button() {
        var tempEle = document.getElementById('ig-close');
        tempEle.addEventListener('click', function (event) {
            viewer.dom.style.display = 'none';
            files.dom.style.display = 'none';
            closeButton.dom.style.display = 'none';

            // Empty files thumbnails
            while (files.dom.firstChild) {
                files.dom.removeChild(files.dom.firstChild);
            }
            // Reset files counters
            files.current = 0;
            files.max = 0;
        }, false);
        return tempEle;
    }
    // Generates image gallery elements.
    function generateImageGallery() {
        for (var key in folderStructure) {
            if (folderStructure.hasOwnProperty(key)) {
                // Create container for this folder
                var folder = document.createElement('div');
                folders.dom.appendChild(folder);
                folder.style.minWidth = folders.minWidth + 'px';
                folder.style.width = 'calc(100% / ' + folders.ipr + ')';
                folder.className = 'folder-container';
                folder.setAttribute('folder', key);

                // Create title element for this folder
                var title = document.createElement('div');
                folder.appendChild(title);
                title.className = 'title';
                title.textContent = key;
                title.title = key;

                // Create image container for this folder
                var imgContainer = document.createElement('div');
                folder.appendChild(imgContainer);
                imgContainer.className = 'image-container';
                imgContainer.title = key;

                var pusher = document.createElement('div');
                imgContainer.appendChild(pusher);
                pusher.className = 'pusher';

                // Create image for this folder
                var image = new Image();
                image.className = 'ig-img';
                image.addEventListener('load', onLoadAppend(imgContainer, image));
                image.src = location + '/thumb_gallery/' + key + '/' + folderStructure[key][0];


                folder.addEventListener('click', function(){
                    // Show viewer, closeButton and files.
                    viewer.dom.style.display = 'block';
                    files.dom.style.display = 'block';
                    closeButton.dom.style.display = 'block';

                    // Calculate files thumbnails size
                    var size = files.dom.offsetHeight;

                    // Set selected folder
                    folders.selected = this.getAttribute('folder');

                    // Start constructing new files thumbnails for selected folder
                    var overflowContainer = document.createElement('div');
                    overflowContainer.style.height = size + 'px';
                    overflowContainer.className = 'overflow-container';
                    files.dom.appendChild(overflowContainer);
                    // Generate all thumbnails inside selected folder.
                    for (var i = 0; i < folderStructure[folders.selected].length; i++) {
                        // Create and sets attribtues for image container div element
                        var imgContainer = document.createElement('div');
                        overflowContainer.appendChild(imgContainer);
                        imgContainer.style.width = size + 'px';
                        imgContainer.style.height = size + 'px';
                        imgContainer.className = 'image-container';
                        
                        imgContainer.setAttribute('nro', files.max);
                        imgContainer.addEventListener('click', fileClickEvent, false);

                        var image = new Image();
                        image.className = 'ig-img';
                        image.addEventListener('load', onLoadAppend(imgContainer, image));
                        image.src = location + '/thumb_gallery/' + folders.selected + "/" + folderStructure[folders.selected][i];
                        
                        files.max++;
                    }

                    // Calculate overflow-container width while adding total of 10px left/right margin to all images
                    overflowContainer.style.width = (files.max * (size + 10)) + 'px';
                    // Simulate click on first thumbnail to fill viewer
                    eventFire(files.dom.querySelector('[nro="'+(files.current)+'"]'), 'click');
                }, false);
            }
        }
    }


    function fileClickEvent(event) {
        event.preventDefault();

        this.scrollIntoView();

        // Reset img-gallery-viewer
        while (viewer.dom.firstChild) {
            viewer.dom.removeChild(viewer.dom.firstChild);
        }

        files.current = Number(this.getAttribute('nro'));

        // Loads original image into image-viewer
        var image = new Image();
        image.className = 'ig-img';
        image.addEventListener('load', onLoadAppend(viewer.dom, image));
        image.src = location + '/gallery/' + folders.selected + '/' + folderStructure[folders.selected][files.current];

        viewer.dom.scrollIntoView();


        // Changes removes old 'selected' and sets this as selected
        if (files.selected != null) {
            files.selected.className = files.selected.className.replace(/\bselected\b/, '');
        }
        this.className += ' selected';
        files.selected = this;
    }

    // Onload function that add element to target
    function onLoadAppend(target, element) {
        target.appendChild(element);
    }
    // Simulate event on element
    function eventFire(element, eventType) {
        if (element.fireEvent) {
            element.fireEvent('on' + eventType);
        }
        else {
            var eventObject = document.createEvent('Events');
            eventObject.initEvent(eventType, true, false);
            element.dispatchEvent(eventObject);
        }
    }
    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
    // RETURN - Public functions needs to be returned
    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
    return {
        init: init
    }
} ();