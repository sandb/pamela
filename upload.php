<?php
/*
    Copyright 2010 Pieter Iserbyt

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

/* Checks if a $_POST param is set and returns it or NULL if it's not set */
function getPost($name, $default = NULL) {
	if (!isset($_POST[$name])) return $default;
	return $_POST[$name];
}


header("Content-type: text/plain");  
require_once("lib/data.php");

class Upload {

	private $data;

	function __construct() {
		$this->data = getPost("data");
	}

	private function validate() {
		if ($this->data == NULL) {
			printf("Missing data param\n");
			return false;
		}
		
		return true;
	}

	private function writeData() {
		$datas = explode(',', $this->data);
		foreach($datas as $data) {
			data_add($data);
		}
	}
	
	public function run() {
		if ($this->validate())
		  $this->writeData();
	}

}

$upload = new Upload();
$upload->run();
