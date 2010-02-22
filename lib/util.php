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

/* Converts value to int if it is numeric, else returns default */
function intvaldef($value, $default) {
	if (is_numeric($value)) return intval($value);
	return $default;
}

/* Checks if a $_GET param is set and returns it or NULL if it's not set */
function getQuery($name, $default = NULL) {
	if (!querySet($name)) return $default;
	return unescape_gpc($_GET[$name]);
}

/* Returns TRUE if a $_GET param is set */
function querySet($name) {
	return isset($_GET[$name]);
}

/* Checks if a $_POST param is set and returns it or NULL if it's not set */
function getPost($name, $default = NULL) {
	if (!postSet($name)) return $default;
	return unescape_gpc($_POST[$name]);
}

function unescape_gpc_array($a) {
  $result = array();
  foreach ($a as $key => $value) {
    $result[$key] = unescape_gpc($value);
  }
  return $result;
}

/* Returns TRUE if a $_POST param is set */
function postSet($name) {
	return isset($_POST[$name]);
}

/* array_map_function used to recursively stripslashes by unescape_gpc */
function stripslashes_deep($value) { 
	return is_array($value) ? array_map('stripslashes_deep', $value) : stripslashes($value); 
}

/* Unescapes get/post/cookie vars/arrays if magic_quotes_gpc is turned on */
function unescape_gpc($gpc) {
	if (get_magic_quotes_gpc()) {
		//unescape recursively if needed		
		$gpc = is_array($gpc) ? array_map('stripslashes_deep', $gpc) : stripslashes($gpc);
	}
	return $gpc; 
}

/*
stripos implementation for php4 (by "heavyraptor")
http://be.php.net/manual/en/function.stripos.php#63370
*/
if (!function_exists("stripos")) {
  function stripos($str,$needle) {
   return strpos(strtolower($str),strtolower($needle));
  }
}

/* Redirects to sender */
function redirectToSender() {
        $url = $_SERVER["HTTP_REFERER"];
        header("Location: $url");  
}

/* Returns the name of current page */
function currentPage() {
  return basename($_SERVER['PHP_SELF']);
}

/** outputs include for script in head */
function script($source) {
?>
  <script type="text/javascript" src="<?=$source?>"></script>
<?php
}

function echoln($str) {
	echo("$str\n");
}

