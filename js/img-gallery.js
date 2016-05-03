// Get frequently used HTML elements
var imgGalleryViewer = document.getElementById('img-gallery-viewer');
var imgGalleryThumbs = document.getElementById('img-gallery-thumbs');
var imgGalleryFolders = document.getElementById('img-gallery-folders');

// INIT width and height. Defaults to 100% if there's no attributes in HTML elements.
imgGalleryViewer.style.width = imgGalleryViewer.getAttribute('ig-width') || '100%';
imgGalleryViewer.style.height = imgGalleryViewer.getAttribute('ig-height') || '100%';

imgGalleryThumbs.style.width = imgGalleryThumbs.getAttribute('ig-width') || '100%';
imgGalleryThumbs.style.height = imgGalleryThumbs.getAttribute('ig-height') || '100%';

imgGalleryFolders.style.width = imgGalleryFolders.getAttribute('ig-width') || '100%';
imgGalleryFolders.style.height = imgGalleryFolders.getAttribute('ig-height') || '100%';

// Get frequently used attribute values
var folderThumbWidth = imgGalleryFolders.getAttribute('ig-thumb-width') || '200px';
var folderThumbHeight = imgGalleryFolders.getAttribute('ig-thumb-height') || '200px';

var galleryThumbWidth = imgGalleryThumbs.getAttribute('ig-thumb-width') || '200px';
var galleryThumbHeight = imgGalleryThumbs.getAttribute('ig-thumb-height') || '200px';

console.log( galleryLocation );






// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 
// DEV TESTS

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
                    temp += '<img src="' + galleryLocation + 'thumb_' + location + '/' + key + '" />';
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