# image-gallery

## Still developing! ##

### Limits ###
Folder structure only support 1 folder depth.

images/gallery/cake/ -> creates gallery named cake with images inside cake/ folder.

images/gallery/flower/ -> creates gallery named flower with images inside flower/ folder.

images/gallery/cake/creamcake/ -> fails.

### Version 1. Works somehow but still working on it. ###

Example in index.html

1. Put folders/images inside images/gallery

2. Generate folder structure using generate-folders-json.php

3. Include css/img-gallery.css, js/img-gallery.js and generated json file (located in images folder).

4. Create required HTML elements and set their attributes.

5. Sets required varibles inside script tag at end of the body.


### Generated "json" structure ###
<pre>
{
    "structure": {
        "folder1": {
            "file1name": "file",
            "file2name": "file",
            "file3name": "file"
        },
        "folder2": {
            "file1name": "file",
            "file2name": "file",
            "file3name": "file"
        }
    }   
}
</pre>