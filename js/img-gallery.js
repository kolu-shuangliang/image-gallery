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