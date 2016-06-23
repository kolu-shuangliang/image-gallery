var ImageGallery = function(){
    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
    // VARIABLES
    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
    var location = null;
    
    var viewer = {
        dom: initViewer(),
        widthHalf: null
    };
    var closeButton = {
        dom: initCloseButton()
    };
    var files = {
        dom: initFiles(),
        width: null,
        height: null,
        current: 1,
        max: 0,
        selected: null
    };
    var folders = {
        dom: initFolders(),
        titleWidth: null,
        titleHeight: null,
        thumbWidth: null,
        thumbHeight: null,
        selected: null
    };


    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
    //
    // PUBLIC FUNCTIONS
    //
    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
    function init( galleryLocation ){
        console.log( 'Initializing Image Gallery!' );
        console.log( '-- Location: [ ' + galleryLocation + ' ] ' );
        
        location = galleryLocation;

        // Calculate width/height. Thumbnails width/height ratio are 1:1
        folders.titleWidth = Number( ( folders.dom.offsetWidth ) / Number( folders.dom.getAttribute( 'ig-fpr' ) ) ) - 10;
        folders.titleHeight = 40;
        folders.thumbWidth =  folders.titleWidth;
        folders.thumbHeight = folders.titleWidth;

        // Calculate half width of viewer element for click event
        viewer.widthHalf = viewer.dom.offsetWidth / 2;
        
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
    function initViewer(){
        var tempEle = document.createElement('div');
        document.body.appendChild( tempEle );
        tempEle.id = 'image-gallery-viewer';
        tempEle.addEventListener( 'click', function( event ){
            event.preventDefault();
            event.stopPropagation();
            // Check if click position is on left or right side of viewer
            // Also checks if there's more images to left/right by using folders.current
            if( ( event.pageX - this.offsetLeft ) < viewer.widthHalf && ( files.current - 1 ) > 0 ){
                eventFire( document.querySelector( '.thumb-nro-' + --files.current ), 'click' );
            }
            else if( files.current + 1 <= files.max ){
                eventFire( document.querySelector( '.thumb-nro-' + ++files.current ), 'click' );
            }
        }, false );
        return tempEle;
    }
    // Initialize button that closes viewer when it's visible.
    function initCloseButton(){
        var tempEle = document.createElement('div');
        document.body.appendChild( tempEle );
        tempEle.id = 'image-gallery-close';
        tempEle.addEventListener( 'click', function( event ){
            viewer.dom.style.display = 'none';
            files.dom.style.display = 'none';
            this.style.display = 'none';

            // Empty files thumbnails
            while( files.dom.firstChild ){
                files.dom.removeChild( files.dom.firstChild );
            }
            // Reset files counters
            files.current = 1;
            files.max = 0;
        }, false );
        return tempEle;
    }

    // Initialize file elements.
    // List all files inside selected folder
    function initFiles(){
        var tempEle = document.createElement('div');
        tempEle.id = 'image-gallery-files';
        document.body.appendChild( tempEle );

        return tempEle;
    }

    // Initialize folders. Just return DOM element with #image-gallery-folders.
    function initFolders(){
        return document.getElementById( 'image-gallery-folders' );
    }

    // Simulate event on element
    function eventFire( element, eventType ){
        if ( element.fireEvent ) {
            element.fireEvent( 'on' + eventType );
        }
        else {
            var eventObject = document.createEvent( 'Events' );
            eventObject.initEvent( eventType, true, false );
            element.dispatchEvent( eventObject );
        }
    }
    // Generates image gallery elements.
    function generateImageGallery(){
        for( var key in folderStructure.structure ){
            // Create container for this folder
            var folderContainer = document.createElement( 'div' );
            folders.dom.appendChild( folderContainer );
            folderContainer.className = 'folder-container';
            folderContainer.style.width = folders.titleWidth + 'px';
            folderContainer.style.height = ( folders.titleHeight + folders.thumbHeight ) + 'px';
            folderContainer.setAttribute( 'folder', key );
            folderContainer.addEventListener( 'click', folderClickEvent, false );
        
            // Create title element for this folder
            var title = document.createElement( 'div' );
            folderContainer.appendChild( title );
            title.style.width = folders.titleWidth + 'px';
            title.style.height = folders.titleHeight + 'px';
            title.style.lineHeight = folders.titleHeight + 'px';
            title.className = 'title';
            title.innerHTML = key;
            title.title = key;
            
            // Create image container for this folder
            var imgContainer = document.createElement( 'div' );
            folderContainer.appendChild( imgContainer );
            imgContainer.style.width = folders.thumbWidth + 'px';
            imgContainer.style.height = folders.thumbHeight + 'px';
            imgContainer.className = 'image-container';
            imgContainer.title = key;
            
            // Create image for this folder
            var image = new Image();
            image.className = 'image-gallery-img';
            // Appends image into imgContainer on image load
            image.addEventListener( 'load', onLoadAppend( imgContainer, image ) );
            // Gets first image from this folder as thumbnail
            for( var imageFile in folderStructure.structure[ key ] ){
                image.src = location + '/thumb_gallery/' + key + '/' + imageFile;
                break;
            }
        }
    }

    function folderClickEvent( event ){
        event.preventDefault();
        event.stopPropagation();
        // Show viewer, closeButton and files.
        viewer.dom.style.display = 'block';
        viewer.widthHalf = viewer.dom.offsetWidth / 2;
        files.dom.style.display = 'block';
        closeButton.dom.style.display = 'block';
        // Calculate files thumbnails width/height
        files.height = files.dom.offsetHeight;
        files.width = files.height;

        var selectedFolder = this.getAttribute( 'folder' );
        
        // Start constructing new files thumbnails for selected folder
        var overflowContainer = document.createElement( 'div' );
        overflowContainer.style.height = files.height + 'px';
        overflowContainer.className = 'overflow-container';
        files.dom.appendChild( overflowContainer );
        // Generate all thumbnails inside selected folder.
        for( var file in folderStructure.structure[ selectedFolder ] ){
            if( folderStructure.structure[ selectedFolder ][ file ] === 'file' ){
                // Raise max thumb, also uses it as counter during foreach loop
                files.max++;
                // Create and sets attribtues for image container div element
                var imgContainer = document.createElement( 'div' );
                overflowContainer.appendChild( imgContainer );
                imgContainer.style.width = files.width + 'px';
                imgContainer.style.height = files.height + 'px';
                imgContainer.className = 'image-container';
                imgContainer.className += ' thumb-nro-' + files.max;
                imgContainer.setAttribute( 'thumb', files.max );
                imgContainer.setAttribute( 'folder', selectedFolder );
                imgContainer.setAttribute( 'file', file );
                imgContainer.addEventListener( 'click', fileClickEvent, false );
                
                var image = new Image();
                image.className = 'image-gallery-img';
                image.addEventListener( 'load', onLoadAppend( imgContainer, image ) );
                image.src = location + '/thumb_gallery/' + selectedFolder + "/" + file;
            }
        }
        
        // Calculate overflow-container width while adding total of 10px left/right margin to all images
        overflowContainer.style.width = ( files.max * ( files.width + 10 ) ) + 'px';
        // Simulate click on first thumbnail to fill viewer
        eventFire( document.querySelector( '.thumb-nro-' + ( files.current ) ), 'click' );
    }
    
    function fileClickEvent( event ){
        event.preventDefault();
                            
        this.scrollIntoView();
        
        // Reset img-gallery-viewer
        while( viewer.dom.firstChild ){
            viewer.dom.removeChild( viewer.dom.firstChild );
        }
        
        // Loads original image into image-viewer
        var image = new Image();
        image.className = 'image-gallery-img';
        image.addEventListener( 'load', onLoadAppend( viewer.dom, image ) );
        image.src = location + '/gallery/' + this.getAttribute( 'folder' ) + '/' + this.getAttribute( 'file' );
        
        viewer.dom.scrollIntoView();
        
        files.current = Number( this.getAttribute( 'thumb' ) );
        
        // Changes removes old 'selected' and sets this as selected
        if ( files.selected != null ){
            files.selected.className = files.selected.className.replace( /\bselected\b/, '' );
        }
        
        this.className += ' selected';
        files.selected = this;
    }
    
    // Onload function that add element to target
    function onLoadAppend( target, element ){
        target.appendChild( element );
    }
    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
    // RETURN - Public functions needs to be returned
    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
    return {
        init: init
    }
}();