<?php
require_once("lib/db.php");

function known_macs_get() {
	$results = array();
	$db = get_db();
	$q = sqlite_query($db, "select * from knownmacs");
	if (!$q) return $results;
	while(sqlite_has_more($q)) {
		$row = sqlite_fetch_array($q, SQLITE_ASSOC);
		$results[$row['mac']] = $row['name']; 
	}
	return $results;
}

function known_macs_get_by_user($userid) {
	$results = array();
	$db = get_db();
	$q = sqlite_query($db, "select * from knownmacs where userid = \"userid\"");
	if (!$q) return $results;
	while(sqlite_has_more($q)) {
		$row = sqlite_fetch_array($q, SQLITE_ASSOC);
		$results[$row['mac']] = $row['name']; 
	}
	return $results;
}

function known_macs_upsert($mac, $name, $show) {
	$db = get_db();
	$mac = sqlite_escape_string($mac);
	$name = sqlite_escape_string($name);
	$show = sqlite_escape_string($show);
	return sqlite_exec($db, "insert into knownmacs or replace (mac, name, show) values (\"$mac\", \"$name\", \"$show\")");
}

function known_macs_translate($macs) {
	$known_macs = known_macs_get();
	$results = array();
	foreach($macs as $mac) {

		// no translation info? return as-is
		if (!array_key_exists($mac, $known_macs)) {
			$results[] = $mac;
			continue;
		}

		// private mac? skip
		if ($known_macs[$mac] == NULL) continue;

		// return translation
		$results[] = $known_macs[$mac];

	}
	return $results;
}

//$mac_translation_table=array(
//	'00:30:05:25:b2:f5' => 'appelblauwzeegroen', //192.168.42.11 appelblauwzeegroen FreeBSD 8.0   00:30:05:25:B2:F5  man-ip: 172.16.1.11
//	'00:08:02:c8:56:1f' => 'gitorious',          //192.168.42.44 gitorious          Ubuntu 8.04   00:08:02:C8:56:1F  man-ip: 172.16.1.44
//	'00:0f:66:c8:ac:db' => 'openwrt'             //192.168.42.13 openwrt            Openwrt       00:0F:66:C8:AC:DB  man-ip: 172.16.1.1
//);
