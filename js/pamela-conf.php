<?php
require_once("../config.php");
header('Content-Type: application/javascript');
?>
config = new function() {
  this.bgcolor = "<?php echo PAM_BGCOLOR; ?>";
  this.image =  "<?php echo PAM_IMAGE; ?>";
  this.buttonColor = "<?php echo PAM_BUT_COLOR; ?>";
  this.buttonShow = <?php echo PAM_BUT_SHOW=="TRUE"?"true":"false"; ?>;
  this.scannerDownloadLink = "<?php echo PAM_SCANNER_LINK; ?>";
}
