// Get frequently used HTML elements
var imgGalleryViewer = document.getElementById('img-gallery-viewer');
var imgGalleryThumbs = document.getElementById('img-gallery-thumbs');
var imgGalleryFolders = document.getElementById('img-gallery-folders');

var currentThumb = 0;
var currentMaxThumb = 0;

// INIT width and height. Defaults to 100% if there's no attributes in HTML elements.
imgGalleryViewer.style.width = imgGalleryViewer.getAttribute('ig-width') || '100%';
imgGalleryViewer.style.height = imgGalleryViewer.getAttribute('ig-height') || '100%';

imgGalleryThumbs.style.width = imgGalleryThumbs.getAttribute('ig-width') || '100%';
imgGalleryThumbs.style.height = imgGalleryThumbs.getAttribute('ig-height') || '100%';

imgGalleryFolders.style.width = imgGalleryFolders.getAttribute('ig-width') || '100%';
imgGalleryFolders.style.height = imgGalleryFolders.getAttribute('ig-height') || '100%';

// Get frequently used attribute values
var folderTitleWidth = imgGalleryFolders.getAttribute('ig-title-width') || '200px';
var folderTitleHeight = imgGalleryFolders.getAttribute('ig-title-height') || '20px';

var folderThumbWidth = imgGalleryFolders.getAttribute('ig-thumb-width') || '200px';
var folderThumbHeight = imgGalleryFolders.getAttribute('ig-thumb-height') || '200px';

var galleryThumbWidth = imgGalleryThumbs.getAttribute('ig-thumb-width') || '200px';
var galleryThumbHeight = imgGalleryThumbs.getAttribute('ig-thumb-height') || '200px';


// Generate folders previews
generateGalleryFolders( imgGalleryFolders, galleryLocation );




function generateGalleryFolders( parent, galleryLocation ){
    
    for( var folder in folderStructure.structure ){
        
        // Create new div container for folder and set it's attributes
        var folderContainer = document.createElement( 'div' );
        folderContainer.className = 'folder-container';
        folderContainer.style.width = folderThumbWidth;
        folderContainer.style.height = folderTitleHeight + folderThumbHeight;
        folderContainer.setAttribute( 'folder', folder );
        parent.appendChild( folderContainer );
        
        folderContainer.addEventListener( 'click', foldersClickEvent, false );
        
        // Create title element for current folder
        var title = document.createElement( 'div' );
        title.style.width = folderThumbWidth;
        title.style.height = folderTitleHeight;
        title.style.lineHeight = folderTitleHeight;
        title.className = 'title';
        title.innerHTML = folder;
        title.title = folder;
        folderContainer.appendChild( title );
        
        // Create image container for current folder
        var imgContainer = document.createElement( 'div' );
        imgContainer.style.width = folderThumbWidth;
        imgContainer.style.height = folderThumbHeight;
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
    
    // Reset img-gallery-viewer, img-gallery-thumbs and counters
    imgGalleryViewer.innerHTML = '';
    imgGalleryThumbs.innerHTML = '';
    currentThumb = 0;
    currentMaxThumb = 0;
    
    // Start constructing new img-gallery-thumbs contents
    var overflowContainer = document.createElement( 'div' );
    overflowContainer.style.height = galleryThumbHeight;
    overflowContainer.className = 'overflow-container';
    imgGalleryThumbs.appendChild( overflowContainer );
    
    for( var file in folderStructure.structure[ folder ] ){
        if( folderStructure.structure[ folder ][ file ] == 'file' ){
            // Raise max thumb, also uses it as counter during foreach loop
            currentMaxThumb++;
            
            // Create div container for image element
            var imgContainer = document.createElement( 'div' );
            imgContainer.style.width = galleryThumbWidth;
            imgContainer.style.height = galleryThumbHeight;
            imgContainer.className = 'image-container';
            imgContainer.id = 'thumb-nro' + currentMaxThumb;
            imgContainer.setAttribute( 'thumb', currentMaxThumb );
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
    var tempWidth = galleryThumbWidth.substring( 0, galleryThumbWidth.length - 2 );
    overflowContainer.style.width = ( currentMaxThumb * ( Number( tempWidth ) + 10 ) ) + 'px';
    
    // There's one extra "container" inside img-gallery-thumbs for creating vertical overflow
    var preview = document.createElement( 'div' );
    
}

// Click event function for gallery thumbnails
function thumbnailClickEvent(){
    
    console.log( this );
    
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