<?php 
/*
    Copyright 2010 Pieter Iserbyt

    This file is part of Pamela.

    Pamela is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Pamela is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Pamela.  If not, see <http://www.gnu.org/licenses/>.
*/

require_once("config.php");
?><html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>Pamela</title>
    <script src="js/jquery-1.3.2.js" type="text/javascript"></script>
    <script src="js/pamela-conf.php" type="text/javascript"></script>
    <script src="js/pamela-buttons.js" type="text/javascript"></script>
    <script src="js/pamela-nodes.js" type="text/javascript"></script>
    <script src="js/pamela-matrices.js" type="text/javascript"></script>
    <script src="js/pamela.js" type="text/javascript"></script>
    <style type="text/css">
      * {
        margin:0; 
        padding:0;
      } 
      
      body { 
        background-color: <?php echo PAM_BGCOLOR; ?>; 
      }
      </style>
  </head>
  <body>
 	  <canvas id="pamela"></canvas>
  </body>
</html>
