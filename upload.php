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
require_once("lib/util.php");
require_once("lib/macs.php");

class Upload {

	private $macs;

	function __construct() {
		$this->macs = getPost("macs");
	}

	private function parseAndValidate() {
		if ($this->macs == NULL) {
			echoln("Missing macs param");
			return false;
		}
		
		$mcs = explode(',', $this->macs);
		foreach($mcs as $mac) {
			if (preg_match("/^(([\dABCDEF]){2}:){5}([\dABCDEF]){2}$/i", $mac) == 1)
				continue;
			echoln("mac $mac is not in the right format");
			return false;
		}
		return true;
	}

	private function writeMacs() {
		$mcs = explode(',', $this->macs);
		foreach($mcs as $mac) {
			macs_add($mac);
		}
	}
	
	public function run() {
		$this->parseAndValidate();
		$this->writeMacs();
	}

}

$upload = new Upload();
$upload->run();
