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

header("Content-type: text/plain");  
require_once("../config.php");
require_once("util.php");

function echoln($str) {
	echo("$str\n");
}

class Upload {

	private $subnet;
	private $macs;

	function __construct() {
		$this->subnet = intvaldef(getQuery("sn"), NULL);
		$this->macs = getQuery("macs");
	}

	private function parseAndValidate() {
		if ($this->subnet == NULL) {
			echoln("Missing or bad sn param");
			return false;
		}
		if ($this->macs == NULL) {
			echoln("Missing macs param");
			return false;
		}
		if (($this->subnet < 0) || ($this->subnet > 4294967295)) {
			echoln("subnet ($this->subnet) is not valid");
			return false;
		}
		$mcs = explode('|', $this->macs);
		foreach($mcs as $mac) {
			if (preg_match("/^(([\dABCDEF]){2}:){5}([\dABCDEF]){2}$/i", $mac) == 1)
				continue;
			echoln("mac $mac is not in the right format");
			return false;
		}
		return true;
	}

	private function writeMacs() {
		file_put_contents(OUTPUT_SERVER_DIRECTORY."/$this->subnet.macs", $this->macs);
	}
	
	public function run() {
		$this->parseAndValidate();
		$this->writeMacs();
	}

}

$upload = new Upload();
$upload->run();
