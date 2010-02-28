<?php
require_once("lib/trans.php");
?>
<html xmlns="http://www.w3.org/1999/xhtml">
 <head>
   <title>Pamela</title>
   <script src="js/jquery-1.3.2.js" type="text/javascript"></script>
   <link rel="stylesheet" href="pamela.css" type="text/css" media="screen" /> 
 </head>
 <body>
  <header id="hdr">
   <div>
    <img src="img/pamela-logo.png" alt="Pamela" />
   </div>
  </header>
  <h1>Name your macs</h1>
  <p>If you want to have a name shown instead of your mac, enter your mac and desired name below.</p>
  <form method="post">
   <table>
    <thead>
     <th>Mac</th>
     <th>Name</th>
     <th>Visible</th>
    </thead>
    <tbody>
<?php
     $known_macs = known_macs_get();
     $counter = 0;
     foreach ($known_macs as $mac => $name) {
?>
     <tr>
      <td><input name="mac-<?=$counter?>" type="text" value="<?=$mac?>" /></td>
      <td><input name="name-<?=$counter?>" type="text" value="<?=$name?>" /></td>
      <td><input name="show-<?=$counter?>" type="checkbox" <?=$name==NULL?"":"checked"?> /></td>
     </tr>
<?php
      $counter++;
     }
?>
     <tr>
      <td><input name="mac-<?=$counter?>" type="text" /></td>
      <td><input name="name-<?=$counter?>" type="text" /></td>
      <td><input name="show-<?=$counter?>" type="checkbox" /></td>
     </tr>
    </tbody>
   </table>
   <input type="submit" value="submit" name="submit" />
  </form>
 </body>
</html>
