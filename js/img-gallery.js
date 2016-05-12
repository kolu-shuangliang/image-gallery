

var ImageGallery = function( version ){
    
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
    
    // Counters for currently selected thumbnails and it's max value
    this.counters = {
        currenThumb: 0,
        currentMaxThumb: 0
    };
    this.currentThumb = 0;
    this.currentMaxThumb = 0;
    
    // Currently selected elements
    this.selectedFolder = '';
    this.selectedThumbnail = '';
}

ImageGallery.prototype.constructHTML = function( galleryLocation, obj ){
    
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
    
    // Add click eventlistener to imgGalleryViewer
    this.imgGalleryViewer.addEventListener( 'click', function( event ){
        
        var posX = event.offsetX ? ( event.offsetX ) : event.pageX - this.offsetLeft;
        
        // Check if clicks on left or right from middle of img-gallery-viewer
        if( posX < ( this.offsetLeft / 2 ) ){
            // Checks if there's more thumbnails on "left"
            if( obj.currentThumb - 1 > 0 ){
                
                eventFire( document.querySelector( '.thumb-nro-' +  --obj.currentThumb ), 'click' );
                
            }
        }
        else{
            // Checks if there's more thumbnails on "right"
            if( ( obj.currentThumb + 1 ) <= obj.currentMaxThumb ){
                
                eventFire( document.querySelector( '.thumb-nro-' + ( ++obj.currentThumb ) ), 'click' );
                
            }
        }
        
    }, false );
    
    // Starts generating HTML
    generateGalleryFolders( this.imgGalleryFolders, galleryLocation );
    
}


var tempTest = new ImageGallery( 1 );
tempTest.constructHTML( galleryLocation, tempTest );


function generateGalleryFolders( parent, galleryLocation ){
    
    for( var folder in folderStructure.structure ){
        
        // Create new div container for folder and set it's attributes
        var folderContainer = document.createElement( 'div' );
        folderContainer.className = 'folder-container';
        folderContainer.style.width = tempTest.folderThumbWidth;
        folderContainer.style.height = tempTest.folderTitleHeight + tempTest.folderThumbHeight;
        folderContainer.setAttribute( 'folder', folder );
        parent.appendChild( folderContainer );
        
        folderContainer.addEventListener( 'click', foldersClickEvent, false );
        
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
function foldersClickEvent(){
    var folder = this.getAttribute( 'folder' );
    
    // Reset img-gallery-thumbs and counters
    tempTest.imgGalleryThumbs.innerHTML = '';
    tempTest.currentThumb = 1;
    tempTest.currentMaxThumb = 0;
    
    // Start constructing new img-gallery-thumbs contents
    var overflowContainer = document.createElement( 'div' );
    overflowContainer.style.height = tempTest.galleryThumbHeight;
    overflowContainer.className = 'overflow-container';
    tempTest.imgGalleryThumbs.appendChild( overflowContainer );
    
    for( var file in folderStructure.structure[ folder ] ){
        if( folderStructure.structure[ folder ][ file ] == 'file' ){
            // Raise max thumb, also uses it as counter during foreach loop
            tempTest.currentMaxThumb++;
            
            // Create and sets attribtues for image container div element
            var imgContainer = document.createElement( 'div' );
            imgContainer.style.width = tempTest.galleryThumbWidth;
            imgContainer.style.height = tempTest.galleryThumbHeight;
            imgContainer.className = 'image-container';
            imgContainer.className += ' thumb-nro-' + tempTest.currentMaxThumb;
            imgContainer.setAttribute( 'thumb', tempTest.currentMaxThumb );
            imgContainer.setAttribute( 'folder', folder );
            imgContainer.setAttribute( 'file', file );
            imgContainer.tabIndex = 1;
            imgContainer.addEventListener( 'click', thumbnailClickEvent, false );
            overflowContainer.appendChild( imgContainer );
            
            var image = new Image();
            image.className = 'ig-img';
            image.src = galleryLocation + '/thumb_gallery/' + folder + "/" + file;
            image.addEventListener( 'load', onLoadAppend( imgContainer, image ) );
        }
    }
    // Calculate overflow-container width while adding 10px left/right margin to all images
    var tempWidth = tempTest.galleryThumbWidth.substring( 0, tempTest.galleryThumbWidth.length - 2 );
    overflowContainer.style.width = ( tempTest.currentMaxThumb * ( Number( tempWidth ) + 10 ) ) + 'px';
    
    // There's one extra "container" inside img-gallery-thumbs for creating vertical overflow
    var preview = document.createElement( 'div' );
    
    // Changes removes old 'selected' and sets this as selected
    if ( tempTest.selectedFolder != '' ){
        tempTest.selectedFolder.className = tempTest.selectedFolder.className.replace( /\bselected\b/, '' );
    }
    this.className += ' selected';
    selectedFolder = this;
    
    // Simulate click on first thumnail to fill image-viewer
    eventFire( document.querySelector( '.thumb-nro-' + ( tempTest.currentThumb ) ), 'click' );
}

// Click event function for gallery thumbnails
function thumbnailClickEvent(){
    this.focus();
    
    // Reset image-viewer
    tempTest.imgGalleryViewer.innerHTML = '';
    
    // Loads original image into image-viewer
    var image = new Image();
    image.className = 'ig-img';
    image.src = galleryLocation + '/gallery/' + this.getAttribute( 'folder' ) + '/' + this.getAttribute( 'file' );
    image.addEventListener( 'load', onLoadAppend( tempTest.imgGalleryViewer, image ) );
    
    tempTest.imgGalleryViewer.focus();
    
    // Changes removes old 'selected' and sets this as selected
    if ( tempTest.selectedThumbnail != '' ){
        tempTest.selectedThumbnail.className = tempTest.selectedThumbnail.className.replace( /\bselected\b/, '' );
    }
    this.className += ' selected';
    tempTest.selectedThumbnail = this;
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