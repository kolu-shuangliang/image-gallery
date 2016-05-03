<?php
// 10 min limits
set_time_limit( 10 * 60 );

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
// USER VARIABLES
// Set thumnail sizes in pixels
$thumbnail_width = 180;
$thumbnail_height = 180;
// Folder that contains all images.
$galleryDir = "gallery";

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
// Create json file that lists all folders and images inside them.
// Create thumbnails for those images in same folder structure.
// Thumbnails directory and files have 'thumb_' before their names.
// Example
	// "./gallery" - contain images.
	// "./thumb_gallery" - contain generated thumbnails.

// Change current umaks. Changes back at end
$old = umask( 0 );
// Start by creating array that will be converted to json.
$filesArray = array();

// Remove old thumbnail folders.
rrmdir( "thumb_" . $galleryDir );
// Create ne thumnail folders
mkdir( "thumb_" . $galleryDir );

// Folder/file list are inside "structure" node.
// Maybe add some other properties later.
// listDirectory is function that recursively generate list
$filesArray[ "structure" ] = listDirectory( $galleryDir, $thumbnail_width, $thumbnail_height );

// Shows generated data
print "<pre>";
print_r( $filesArray );
print "</pre>";

// Pass data to JavaScript variable "folderStructure"
// HTML can then <script type="text/javascript" src="folder-structure.json"></script>
// and just call folderStructure variable.
$file = file_put_contents( "folder-structure.js", "var folderStructure = " . json_encode( $filesArray ) . ";" );

umask( $old );


// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
// FUNCTIONS

// Function that lists all folder/files recursively
function listDirectory( $directory, $thumbnail_width, $thumbnail_height ){
	// Scan given directory
    $files = scandir( $directory );
	// Temporary array for folding folders/images inside this directory
	$tempArray = [];
	
	// Goes through all folders/images in current directory
    foreach( $files as $file ){
		// skip "." and ".."
        if( $file != '.' && $file != '..' ){
			// Check if file is folder or image
            if( is_dir( $directory . '/' . $file ) ){
				// If file is folder. We need to create thumnail folder
				// thumb_"directory"/"file"
				// Example
					// directory = "gallery/random"
					// file = "random001folder"
					// aboves creates thumb_gallery/random/random001folder
				mkdir( ( "thumb_" . $directory . '/' . $file ) );
				// Recursively calls itself and add all content inside this folder to array
				// arrays key is folder
				// Files will have values "file" so array that contain datas are folders.
				$tempArray[ $file ] = listDirectory( $directory . '/' . $file, $thumbnail_width, $thumbnail_height );
			}
			else{
				// If file is image. we create thumbnail and add file to list.
				$thumbnail_directory = "thumb_" . $directory;
				makeThumbnail( $directory, $file, $thumbnail_directory, $thumbnail_width, $thumbnail_height );
				$tempArray[ $file ] = "file";
			}
        }
    }
	// Returns list of this directory to folder above it
	return $tempArray;
}

// Function that deletes folder and contents inside it.
function rrmdir( $dir ){
	if( is_dir( $dir ) ){
		$objects = scandir( $dir );
		foreach ( $objects as $object ) {
		if ($object != "." && $object != "..") {
			if( is_dir( $dir."/".$object ) )
				rrmdir( $dir."/".$object );
			else
				unlink($dir."/".$object); 
		} 
		}
		rmdir($dir); 
	}
}

function makeThumbnail( $directory, $image, $thumbnail_directory, $thumbnail_width, $thumbnail_height ){
	
    $image_details = getimagesize( ( $directory . '/' . $image ) );
	
    $original_width = $image_details[0];
    $original_height = $image_details[1];
	
    if( $original_width > $original_height ){
        $new_width = $thumbnail_width;
        $new_height = intval( $new_width * ( $original_height / $original_width ) );
    }
	else{
        $new_height = $thumbnail_height;
        $new_width = intval( $new_height * ( $original_width / $original_height ) );
    }
	
    $dest_x = intval( ( $thumbnail_width - $new_width ) / 2 );
    $dest_y = intval( ( $thumbnail_height - $new_height ) / 2 );
	
    if( $image_details[2] == 1 ){
        $imgt = "ImageGIF";
        $imgcreatefrom = "ImageCreateFromGIF";
    }
    if( $image_details[2] == 2 ){
        $imgt = "ImageJPEG";
        $imgcreatefrom = "ImageCreateFromJPEG";
    }
    if( $image_details[2] == 3 ){
        $imgt = "ImagePNG";
        $imgcreatefrom = "ImageCreateFromPNG";
    }
    if( $imgt ){
        $old_image = $imgcreatefrom( $directory . '/' . $image );
        $new_image = imagecreatetruecolor( $thumbnail_width, $thumbnail_height );
		
		$background = imagecolorallocate( $new_image, 0, 0, 0 );
		imagecolortransparent( $new_image, $background );
		
        imagecopyresized( $new_image, $old_image, $dest_x, $dest_y, 0, 0, $new_width, $new_height, $original_width, $original_height );
		imagealphablending( $new_image, false );
        $imgt( $new_image, $thumbnail_directory . '/' . $image );
    }
}
?>