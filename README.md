# image-gallery

## Still developing! ##

Only single version now ( version 3 ).

Other versions feel little too wonky. Requires too much for on page for viewer and thumbnails

### Limits ###
Folder structure only support 1 folder depth.

images/gallery/cake/ -> creates gallery named cake with images inside cake/ folder.

images/gallery/flower/ -> creates gallery named flower with images inside flower/ folder.

images/gallery/cake/creamcake/ -> fails.

## Usage ##

Check index.html for includes.

Execute ´images/generate-folders-json.php´.

## ? ##

### Folder element ###
<pre>
div.folder-container
    width/height
        Calculated at init.
        Maybe recalculate on resize?
    attributes
        folder
            this folder's name
    click event
        function: folderClickEvent
    elements
        div.title
            title/folder name,
        div.image-container
            contain image element that scales to this this size.
</pre>

### file element ###
<pre>
div.overflow-container
    width
        calculated by JavaScript depending on how many thumbnails there are.
    height
        Take from parent div.image-gallery-files
    elements
        div.image-container.thumb-nro-x
            width/height
                Calculated by JavaScript
            attributes
                thumb
                    id number. same as x from this class thumb-nro-x
                folder
                    Folder name. Used to open original file.
                file
                    File name. Used to open original file.
            click event
                function: fileClickEvent
</pre>

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
