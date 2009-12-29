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
require_once("lib/util.php");

// [ "00:01:e8:04:99:be",  "00:05:4e:40:1e:97",  "00:0c:f1:16:10:ba", "00:0c:f1:1d:dc:70",  "00:0e:35:96:c7:ff",  "00:11:85:6a:1f:ec",  ] 

class Macs {

	private $macs;

	function __construct() {
		$this->macs = array();
	}
	
	private function readFile($filename) {
		$mcs = file_get_contents($filename);
		$this->macs = array_merge($this->macs, explode('|', $mcs));
	}
	
	private function readFiles($directory) {
		$macFiles = scandir($directory);
		foreach ($macFiles as $macFile) {
			if (preg_match("/\.macs$/", $macFile) != 1)
				continue;
			
			$filename = "$directory/$macFile";

			// data is too old, remove			
			if (filemtime($filename) + MACFILE_TTL < time()) {
				unlink($filename);
				continue;
			}
				
			$this->readFile($filename);
		}
	}
	
	private function cleanUp() {
		$this->macs = array_unique($this->macs);
	}
	
	private function createJson() {
		echo '["';
		echo implode('", "', $this->macs);
		echo '"]';
	}

	public function run() {
		$this->readFiles(OUTPUT_SERVER_DIRECTORY);
		$this->cleanUp();
		$this->createJson();
	}
	 
}

$macs = new Macs();
$macs->run();
