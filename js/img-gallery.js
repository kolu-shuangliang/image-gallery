var ImageGallery = function(){
    
    var version = null;
    var location = null;
    
    var viewer = {
        dom: null,
        widthHalf: null
    };
    
    var folder = {
        dom: null,
        titleWidth: null,
        titleHeight: null,
        thumbWidth: null,
        thumbHeight: null,
        selected: null
    }
    
    var gallery = {
        dom: null,
        width: null,
        height: null,
        current: null,
        max: null,
        selected: null
    }
    
    function init( galleryVersion, galleryLocation ){
        
        console.log( 'Initializing Image Gallery elements!' );
        console.log( '--  Version: [ ' + galleryVersion + ' ] ' );
        console.log( '--  Location: [ ' + galleryLocation + ' ] ' );
        
        version = Number( galleryVersion );
        location = galleryLocation;
        
        // Get all DOM elements
        viewer.dom = document.getElementById( 'img-gallery-viewer' );
        gallery.dom = document.getElementById( 'img-gallery-thumbs' );
        folder.dom = document.getElementById( 'img-gallery-folders' );
        
        // Set styles width/height and width/height variables depending on version given
        switch( version ){
            case 1:
                // Sets styles width/height with parameters from DOM elements attributes
                viewer.dom.style.width = viewer.dom.getAttribute( 'ig-width' ) + 'px';
                viewer.dom.style.height = viewer.dom.getAttribute( 'ig-height' ) + 'px';
                gallery.dom.style.width = gallery.dom.getAttribute('ig-width') + 'px';
                gallery.dom.style.height = gallery.dom.getAttribute('ig-height') + 'px';
                folder.dom.style.width = folder.dom.getAttribute('ig-width') + 'px';
                folder.dom.style.height = folder.dom.getAttribute('ig-height') + 'px';
                
                // Sets variables with parameters from DOM elements attributes
                folder.titleWidth = Number( folder.dom.getAttribute('ig-title-width') );
                folder.titleHeight = Number( folder.dom.getAttribute('ig-title-height') );
                folder.thumbWidth = Number( folder.dom.getAttribute('ig-thumb-width') );
                folder.thumbHeight = Number( folder.dom.getAttribute('ig-thumb-height') );
                gallery.width = Number( gallery.dom.getAttribute('ig-thumb-width') );
                gallery.height = Number( gallery.dom.getAttribute('ig-thumb-height') );
                
                break;
                
            case 2:
                // Version 2 inherit width/height from parent elements
                viewer.dom.style.width = '100%';
                viewer.dom.style.height = '100%';
                gallery.dom.style.width = '100%';
                gallery.dom.style.height = '100%';
                folder.dom.style.width = '100%';
                folder.dom.style.height = '100%';
                
                // Calculate width/height. Thumbnails width/height ratio are 1:1
                folder.titleWidth = Number( ( folder.dom.offsetWidth ) / Number( folder.dom.getAttribute( 'ig-fpr' ) ) ) - 10;
                folder.titleHeight = 40;
                
                folder.thumbWidth =  folder.titleWidth;
                folder.thumbHeight = folder.titleWidth;
                
                gallery.height = gallery.dom.offsetHeight;
                gallery.width = gallery.height;
                
                break;
        }
        
        // Calculate half width of viewer element for click event
        viewer.widthHalf = viewer.dom.offsetWidth / 2;
        
        // Add eventlistener to viewer
        viewer.dom.addEventListener( 'click', function( event ){
            // Only performs click event if user have selected gallery from folders
            // gallery.current will be initialized when user selectes gallery
            if( gallery.current != null ){
                // Get click position
                var posX = event.offsetX ? ( event.offsetX ) : event.pageX - this.offsetLeft;
                // Check if click position is on left or right side of viewer
                // Also checks if there's more images to left/right by using gallery.current
                if( posX < viewer.widthHalf ){
                    if( gallery.current - 1 > 0 ){
                        eventFire( document.querySelector( '.thumb-nro-' +  --gallery.current ), 'click' );
                    }
                }
                else{
                    if( gallery.current + 1 <= gallery.max ){
                        eventFire( document.querySelector( '.thumb-nro-' + ++gallery.current ), 'click' );
                    }
                }
            }
        }, false );
        
        // Generate DOM content for img-gallery-folders
        generateImageGallery();
    }
    
    function generateImageGallery(){
        
        for( var key in folderStructure.structure ){
            // Create container element for this folder
            var folderContainer = document.createElement( 'div' );
            folderContainer.className = 'folder-container';
            folderContainer.style.width = folder.titleWidth + 'px';
            folderContainer.style.height = ( folder.titleHeight + folder.thumbHeight ) + 'px';
            folderContainer.setAttribute( 'folder', key );
            folder.dom.appendChild( folderContainer );
            
            // Adds click eventlistener to img-gallery-folders
            folderContainer.addEventListener( 'click', function( event ){
                var clickedFolder = this.getAttribute( 'folder' );
                
                // Reset img-gallery-thumbs contents and counters
                gallery.dom.innerHTML = '';
                gallery.current = 1;
                gallery.max = 0;
                
                // Start constructing new img-gallery-thumbs content
                var overflowContainer = document.createElement( 'div' );
                overflowContainer.style.height = gallery.height + 'px';
                overflowContainer.className = 'overflow-container';
                gallery.dom.appendChild( overflowContainer );
                
                // Generate thumnail element for all images inside folder
                for( var file in folderStructure.structure[ clickedFolder ] ){
                    if( folderStructure.structure[ clickedFolder ][ file ] == 'file' ){
                        // Raise max thumb, also uses it as counter during foreach loop
                        gallery.max++;
                        
                        // Create and sets attribtues for image container div element
                        var imgContainer = document.createElement( 'div' );
                        imgContainer.style.width = gallery.width + 'px';
                        imgContainer.style.height = gallery.height + 'px';
                        imgContainer.className = 'image-container';
                        imgContainer.className += ' thumb-nro-' + gallery.max;
                        imgContainer.setAttribute( 'thumb', gallery.max );
                        imgContainer.setAttribute( 'folder', clickedFolder );
                        imgContainer.setAttribute( 'file', file );
                        imgContainer.tabIndex = 1;
                        
                        imgContainer.addEventListener( 'click', function( event){
                            // TODO - Moves vertical scroll to this instead of focus()
                            this.focus();
                            
                            // Reset img-gallery-viewer
                            viewer.dom.innerHTML = '';
                            
                            // Loads original image into image-viewer
                            var image = new Image();
                            image.className = 'ig-img';
                            image.addEventListener( 'load', onLoadAppend( viewer.dom, image ) );
                            image.src = location + '/gallery/' + this.getAttribute( 'folder' ) + '/' + this.getAttribute( 'file' );
                            
                            // TODO - Scrolls to viewer instead of focus()
                            viewer.dom.focus();
                            
                            gallery.current = Number( this.getAttribute( 'thumb' ) );
                            
                            // Changes removes old 'selected' and sets this as selected
                            if ( gallery.selected != null ){
                                gallery.selected.className = gallery.selected.className.replace( /\bselected\b/, '' );
                            }
                            
                            this.className += ' selected';
                            gallery.selected = this;
                        }, false );
                        
                        overflowContainer.appendChild( imgContainer );
                        
                        var image = new Image();
                        image.className = 'ig-img';
                        image.addEventListener( 'load', onLoadAppend( imgContainer, image ) );
                        image.src = location + '/thumb_gallery/' + clickedFolder + "/" + file;
                    }
                }
                
                // Calculate overflow-container width while adding total of 10px left/right margin to all images
                overflowContainer.style.width = ( gallery.max * ( gallery.width + 10 ) ) + 'px';
                
                // There's one extra "container" inside img-gallery-thumbs for creating vertical overflow
                var preview = document.createElement( 'div' );
                
                // Changes removes old 'selected' and sets this as selected
                if ( folder.selected != null ){
                    folder.selected.className = folder.selected.className.replace( /\bselected\b/, '' );
                }
                this.className += ' selected';
                folder.selected = this;
                
                // Simulate click on first thumnail to fill image-viewer
                eventFire( document.querySelector( '.thumb-nro-' + ( gallery.current ) ), 'click' );
            }, false );
        
            // Create title element for this folder
            var title = document.createElement( 'div' );
            title.style.width = folder.titleWidth + 'px';
            title.style.height = folder.titleHeight + 'px';
            title.style.lineHeight = folder.titleHeight + 'px';
            title.className = 'title';
            title.innerHTML = key;
            title.title = key;
            folderContainer.appendChild( title );
            
            // Create image container for this folder
            var imgContainer = document.createElement( 'div' );
            imgContainer.style.width = folder.thumbWidth + 'px';
            imgContainer.style.height = folder.thumbHeight + 'px';
            imgContainer.className = 'image-container';
            folderContainer.appendChild( imgContainer );
            
            // Create image for this folder
            var image = new Image();
            image.className = 'ig-img';
            // Appends image into imgContainer on image load
            image.addEventListener( 'load', onLoadAppend( imgContainer, image ) );
            // Gets first image from this folder as thumbnail
            for( var imageFile in folderStructure.structure[ key ] ){
                image.src = location + '/thumb_gallery/' + key + '/' + imageFile;
                break;
            }
        }
    }
    
    // Onload function that add element to target
    function onLoadAppend( target, element ){
        target.appendChild( element );
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
    
    return {
        init: init
    }
}();

// Keep this recursive version for now.
    // Parent element. Should be imgGalleryFolders
    // Folder structure list. Should be folderStructure.structure from folder-structure.js
    // Gallery location. Should be variable 'galleryLocation' set before this script file. it's "image" in this example
    // Current folder. Should start with "gallery"
/*
function generateGalleryFolders( parent, list, galleryLocation, location ){
    // Loops through all "files" in current location
    var counter = 0;
    for( var key in list ){
        if( list.hasOwnProperty( key ) ){
            if( list[ key ] === 'file' ){
                console.log( 'file' );
            }
            else{
                console.log( 'folder' );
            }
        }
    }
}
*/