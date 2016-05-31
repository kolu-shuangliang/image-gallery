# image-gallery

## Still developing! ##

Check out some versions here.

* [Version 1](http://kolu-shuangliang.xyz/image-gallery/version_1.html)

* [Version 2](http://kolu-shuangliang.xyz/image-gallery/version_2.html)

* [Version 3](http://kolu-shuangliang.xyz/image-gallery/version_3.html)

### Limits ###
Folder structure only support 1 folder depth.

images/gallery/cake/ -> creates gallery named cake with images inside cake/ folder.

images/gallery/flower/ -> creates gallery named flower with images inside flower/ folder.

images/gallery/cake/creamcake/ -> fails.

### Version 1. Works somehow but still working on it. ###

Version 1 requires width/height elements from attributes.

Example in version_1.html

1. Put folders/images inside images/gallery

2. Generate folder structure using generate-folders-json.php

3. Include css/img-gallery.css, js/img-gallery.js and generated json file (located in images folder).

4. Create required HTML elements and set their attributes.

5. Sets required varibles inside script tag at end of the body.

### Version 2. Works somehow but still working on it. ###

Version 2 inherit width/height from parent elements.

Example in version_2.html

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
