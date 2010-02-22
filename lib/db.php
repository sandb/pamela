<?php
require_once("config.php");

function get_db() {
	static $db = NULL;
	if ($db == NULL) {
		$db = sqlite_open(SQLITE_DB);
	}
	return $db;
}

