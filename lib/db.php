<?php
require_once("config.php");

function get_db() {
	static $db = NULL;
	if ($db == NULL) {
		$db = new SQLite3(SQLITE_DB);
	}
	return $db;
}

