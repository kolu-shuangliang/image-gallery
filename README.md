# image-gallery

## Still developing! ##

### Limits ###
Folder structure only support 1 folder depth.
images/gallery/cake/ -> creates gallery named cake with images inside cake/ folder.
images/gallery/flower/ -> creates gallery named flower with images inside flower/ folder.

images/gallery/cake/creamcake/ -> fails.

### How to use. NOT WORKING YET, but I hope it will work like this... ###

1. Put folders/images inside images/gallery
2. Generate folder structure using generate-folders-json.php

3. Include css/img-gallery.css
4. Include generated json file (located in images folder) at end of the body element.
5. Sets required varibles inside script tag (example in index.html).
6. Include js/img-gallery.js after generated json files include.

7. Create required HTML elements and set their attributes.
