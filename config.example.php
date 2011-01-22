<?php 

// Filename and path of the sqlite db file. The file does not have to exist.
// The directory does need to exist though, and the directory must be writable.
define("SQLITE_DB", "/yourdir/pamela/db/pamela.sql");

// The background color for pamela
define("PAM_BGCOLOR", "#fff");

// The image shown in the center of the pamela interface
#define("PAM_IMAGE", "img/ccc.png");
#define("PAM_IMAGE", "img/norbert.png");
#define("PAM_IMAGE", "img/norbert-8bit.png");
define("PAM_IMAGE", "img/0x20.png");

// Set to FALSE to prevent the scanner button to be shown
define("PAM_BUT_SHOW", "TRUE");

// The text color for the text shown when hovering over the download button
define("PAM_BUT_COLOR", "#777");

// Number of seconds a data item remains valid. If it's older it will be removed.
define("DATA_TTL", "300");

// Url of the scanner script to download when the user clicks the download button.
define("PAM_SCANNER_LINK", "scanner/pamela-scanner.sh");

