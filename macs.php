<?php  
/*
    Copyright 2009 Pieter Iserbyt

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

header("Content-type: application/javascript");  
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");  
header("Cache-Control: no-cache");  
header("Pragma: no-cache");   

require_once("config.php");
require_once("lib/macs.php");

// for debug purposes, increases the numbers of macs artificially
function multiply() {
 global $macs;
 $c = count($macs);
 for ($j = 0; $j < $c; $j++) {
  for ($i = 0; $i <10; $i++) {
    $macs[] = $macs[$j].$i;
   }
 }
}

$macs = macs_get();
if (count($macs) > 0) {
//multiply();
 echo('["'.implode('", "', $macs).'"]');
} else {
 echo('[]');
} 
macs_purge();
