<?php 

// Number of seconds a mac address file is valid. If it's older it will be removed.
define("MACFILE_TTL", "3600");

// Where the db is located for the sqlite db. The file does not have to exist.
// The directory does need to exist though, and the directory must be writable.
define("SQLITE_DB", "/home/sandbender/www/pamela/db/pamela.sql");

// sql create statement for mac table
define("CREATE_MAC_TABLE_SQL", "create table macs (mac text unique on conflict replace, committime integer);");
