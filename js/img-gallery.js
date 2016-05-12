

var ImageGallery = function( version ){
    
    this.self = this;
    
    this.version = Number( version );
    
    // Store most used elements from DOM as variables. No need to getElementById all time.
    this.imgGalleryViewer = document.getElementById('img-gallery-viewer');
    this.imgGalleryThumbs = document.getElementById('img-gallery-thumbs');
    this.imgGalleryFolders = document.getElementById('img-gallery-folders');

    this.folderTitleWidth = 0;
    this.folderTitleHeight = 0;

    this.folderThumbWidth = 0;
    this.folderThumbHeight = 0;

    this.galleryThumbWidth = 0;
    this.galleryThumbHeight = 0;

    this.imgGalleryViewerHalfWidth = 0;
    
    // Counters for currently selected thumbnails and it's max value
    this.currenThumb = 0;
    this.currentMaxThumb = 0;
    this.currentThumb = 0;
    this.currentMaxThumb = 0;
    
    // Currently selected elements
    this.selectedFolder = '';
    this.selectedThumbnail = '';
}

ImageGallery.prototype.constructHTML = function( galleryLocation ){
    
    // Sets elements width/height differently depending on version used
    switch( this.version ){
        case 1:
            this.imgGalleryViewer.style.width = this.imgGalleryViewer.getAttribute('ig-width') + 'px';
            this.imgGalleryViewer.style.height = this.imgGalleryViewer.getAttribute('ig-height') + 'px';
            
            this.imgGalleryThumbs.style.width = this.imgGalleryThumbs.getAttribute('ig-width') + 'px';
            this.imgGalleryThumbs.style.height = this.imgGalleryThumbs.getAttribute('ig-height') + 'px';

            this.imgGalleryFolders.style.width = this.imgGalleryFolders.getAttribute('ig-width') + 'px';
            this.imgGalleryFolders.style.height = this.imgGalleryFolders.getAttribute('ig-height') + 'px';
            
            this.folderTitleWidth = this.imgGalleryFolders.getAttribute('ig-title-width') + 'px';
            this.folderTitleHeight = this.imgGalleryFolders.getAttribute('ig-title-height') + 'px';

            this.folderThumbWidth = this.imgGalleryFolders.getAttribute('ig-thumb-width') + 'px';
            this.folderThumbHeight = this.imgGalleryFolders.getAttribute('ig-thumb-height') + 'px';

            this.galleryThumbWidth = this.imgGalleryThumbs.getAttribute('ig-thumb-width') + 'px';
            this.galleryThumbHeight = this.imgGalleryThumbs.getAttribute('ig-thumb-height') + 'px';
            
            break;
        case 2:
        
            console.log( 'constructHTML: version-' + this.version );
            
            break;
    }
    
    this.imgGalleryViewer.tabIndex = 1;
    
    this.imgGalleryViewerHalfWidth = this.imgGalleryViewer.offsetWidth / 2;
    
    var temp = this.self;
    
    // Add click eventlistener to imgGalleryViewer
    this.imgGalleryViewer.addEventListener( 'click', function( event ){
        
        var posX = event.offsetX ? ( event.offsetX ) : event.pageX - this.offsetLeft;
        
        // Check if clicks on left or right from middle of img-gallery-viewer
        if( posX < temp.imgGalleryViewerHalfWidth ){
            // Checks if there's more thumbnails on "left"
            if( temp.currentThumb - 1 > 0 ){
                
                temp.currentThumb = temp.currentThumb - 1;
                
                eventFire( document.querySelector( '.thumb-nro-' +  temp.currentThumb ), 'click' );
                
            }
        }
        else{
            // Checks if there's more thumbnails on "right"
            if( ( temp.currentThumb + 1 ) <= temp.currentMaxThumb ){
                
                temp.currentThumb = temp.currentThumb + 1;
                
                eventFire( document.querySelector( '.thumb-nro-' + temp.currentThumb ), 'click' );
                
            }
        }
        
    }, false );
    
    // Starts generating HTML
    generateGalleryFolders( this.imgGalleryFolders, galleryLocation, this.self );
    
}

function generateGalleryFolders( parent, galleryLocation, obj ){
    
    for( var folder in folderStructure.structure ){
        
        // Create new div container for folder and set it's attributes
        var folderContainer = document.createElement( 'div' );
        folderContainer.className = 'folder-container';
        folderContainer.style.width = tempTest.folderThumbWidth;
        folderContainer.style.height = tempTest.folderTitleHeight + tempTest.folderThumbHeight;
        folderContainer.setAttribute( 'folder', folder );
        parent.appendChild( folderContainer );
        
        folderContainer.addEventListener( 'click', function( event ){ foldersClickEvent( event, this, obj ); }, false );
        
        // Create title element for current folder
        var title = document.createElement( 'div' );
        title.style.width = tempTest.folderThumbWidth;
        title.style.height = tempTest.folderTitleHeight;
        title.style.lineHeight = tempTest.folderTitleHeight;
        title.className = 'title';
        title.innerHTML = folder;
        title.title = folder;
        folderContainer.appendChild( title );
        
        // Create image container for current folder
        var imgContainer = document.createElement( 'div' );
        imgContainer.style.width = tempTest.folderThumbWidth;
        imgContainer.style.height = tempTest.folderThumbHeight;
        imgContainer.className = 'image-container';
        folderContainer.appendChild( imgContainer );
        
        // Get first image from current folder and display it as thumnail
        var image = new Image();
        image.className = 'ig-img';
        image.addEventListener( 'load', onLoadAppend( imgContainer, image ) );
        for( var imageFile in folderStructure.structure[ folder ] ){
            image.src = galleryLocation + '/thumb_gallery/' + folder + '/' + imageFile;
            break;
        }
    }
    
}

// Click event function for folders previews
function foldersClickEvent( event, self, obj ){
    var folder = self.getAttribute( 'folder' );
    
    // Reset img-gallery-thumbs and counters
    obj.imgGalleryThumbs.innerHTML = '';
    obj.currentThumb = 1;
    obj.currentMaxThumb = 0;
    
    // Start constructing new img-gallery-thumbs contents
    var overflowContainer = document.createElement( 'div' );
    overflowContainer.style.height = obj.galleryThumbHeight;
    overflowContainer.className = 'overflow-container';
    obj.imgGalleryThumbs.appendChild( overflowContainer );
    
    for( var file in folderStructure.structure[ folder ] ){
        if( folderStructure.structure[ folder ][ file ] == 'file' ){
            // Raise max thumb, also uses it as counter during foreach loop
            obj.currentMaxThumb++;
            
            // Create and sets attribtues for image container div element
            var imgContainer = document.createElement( 'div' );
            imgContainer.style.width = obj.galleryThumbWidth;
            imgContainer.style.height = obj.galleryThumbHeight;
            imgContainer.className = 'image-container';
            imgContainer.className += ' thumb-nro-' + obj.currentMaxThumb;
            imgContainer.setAttribute( 'thumb', obj.currentMaxThumb );
            imgContainer.setAttribute( 'folder', folder );
            imgContainer.setAttribute( 'file', file );
            imgContainer.tabIndex = 1;
            imgContainer.addEventListener( 'click', function( event){ thumbnailClickEvent( event, this, obj ) }, false );
            overflowContainer.appendChild( imgContainer );
            
            var image = new Image();
            image.className = 'ig-img';
            image.src = galleryLocation + '/thumb_gallery/' + folder + "/" + file;
            image.addEventListener( 'load', onLoadAppend( imgContainer, image ) );
        }
    }
    // Calculate overflow-container width while adding 10px left/right margin to all images
    var tempWidth = obj.galleryThumbWidth.substring( 0, obj.galleryThumbWidth.length - 2 );
    overflowContainer.style.width = ( obj.currentMaxThumb * ( Number( tempWidth ) + 10 ) ) + 'px';
    
    // There's one extra "container" inside img-gallery-thumbs for creating vertical overflow
    var preview = document.createElement( 'div' );
    
    // Changes removes old 'selected' and sets this as selected
    if ( obj.selectedFolder != '' ){
        obj.selectedFolder.className = obj.selectedFolder.className.replace( /\bselected\b/, '' );
    }
    self.className += ' selected';
    selectedFolder = self.target;
    
    // Simulate click on first thumnail to fill image-viewer
    eventFire( document.querySelector( '.thumb-nro-' + ( obj.currentThumb ) ), 'click' );
}

// Click event function for gallery thumbnails
function thumbnailClickEvent( event, self, obj ){
    self.focus();
    
    // Reset image-viewer
    obj.imgGalleryViewer.innerHTML = '';
    
    // Loads original image into image-viewer
    var image = new Image();
    image.className = 'ig-img';
    image.src = galleryLocation + '/gallery/' + self.getAttribute( 'folder' ) + '/' + self.getAttribute( 'file' );
    image.addEventListener( 'load', onLoadAppend( obj.imgGalleryViewer, image ) );
    
    obj.imgGalleryViewer.focus();
    
    obj.currentThumb = Number( self.getAttribute( 'thumb' ) );
    
    // Changes removes old 'selected' and sets this as selected
    if ( obj.selectedThumbnail != '' ){
        obj.selectedThumbnail.className = obj.selectedThumbnail.className.replace( /\bselected\b/, '' );
    }
    
    self.className += ' selected';
    obj.selectedThumbnail = self;
    
    
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



// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 
// DEV TESTS
/*
var genHtml = "<ul>";
genHtml += testListAllImage( folderStructure.structure, galleryLocation, "gallery" );
genHtml += "</ul>";
document.getElementById( "testContainer" ).innerHTML = genHtml;

function testListAllImage( list, galleryLocation, location ){
    var temp = "";
    for( var key in list ){
        if( list.hasOwnProperty( key ) ){
            if( list[ key ] === "file" ){
                temp += '<div class="img-gallery">';
                    temp += '<img src="' + galleryLocation + '/thumb_' + location + '/' + key + '" />';
                    temp += '<span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span>';
                temp += '</div>';
            }
            else{
                temp += '<span class="title">' + key + '</span>';
                temp += '<div class="img-gallery-container">';
                temp += testListAllImage( list[ key ], galleryLocation, ( location + "/" + key ) );
                temp += '</div>';
            }
        }
    }
    return temp;
}

*/