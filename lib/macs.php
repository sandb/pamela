<?php
require_once("lib/db.php");

function macs_get() {
	$results = array();
	$db = get_db();
	$q = sqlite_query($db, "select mac from macs where committime > strftime('%s','now') - ".MACFILE_TTL);
	if (!$q) return $results;
	while(sqlite_has_more($q)) {
		$row = sqlite_fetch_array($q, SQLITE_ASSOC);
		$results[] = $row['mac'];
	}
	return $results;
}

function macs_add($mac) {
	$db = get_db();
	$mac = sqlite_escape_string($mac);
	return sqlite_exec($db, "insert or replace into macs values (\"$mac\", strftime('%s','now'))");
}

function macs_purge() {
	$db = get_db();
	return sqlite_exec($db, "delete from macs where committime <= strftime('%s','now') - ".MACFILE_TTL);
}
