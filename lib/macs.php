<?php
require_once("lib/db.php");

function macs_get() {
	$results = array();
	$db = get_db();
	$q = $db->query("select mac from macs where committime > strftime('%s','now') - ".MACFILE_TTL);
	if (!$q) return $results;
	while($row = $q->fetch_array(SQLITE_ASSOC)) {
		$results[] = $row['mac'];
	}
	return $results;
}

function macs_add($mac) {
	$db = get_db();
	$mac = $db->escape_string($mac);
	return $db->exec("insert or replace into macs values (\"$mac\", strftime('%s','now'))");
}

function macs_purge() {
	$db = get_db();
	return $db->exec("delete from macs where committime <= strftime('%s','now') - ".MACFILE_TTL);
}
