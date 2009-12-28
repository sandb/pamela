#!/bin/bash

<<LICENSE

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

LICENSE

IF='eth0'
OUT='js/input.php'
SLEEP='60'

TEMP=$(getopt -o i:o:s:-n "pamela arp scanner" -- "$@")
if [ $? != 0 ] ; then echo "Could not parse parameters..." >&2 ; exit 1 ; fi
eval set "$TEMP" --
while true
do
	case "$1" in
		-i) IF="$2"; shift;;
		-o) OUT="$2"; shift;;
		-s) SLEEP="$2"; shift;;
		--) break;;
	esac
	shift
done

while true
do
	echo $(date)" scanning..."
	O="";
	O="$O"'<?php ' 
	O="$O"' header("Content-type: application/pdf"); ' 
	O="$O"' header("Expires: Mon, 26 Jul 1997 05:00:00 GMT"); ' 
	O="$O"' header("Cache-Control: no-cache"); ' 
	O="$O"' header("Pragma: no-cache"); ' 
	O="$O"' ?> ' 
	O="$O"' [ ' 
	O="$O"$(arp-scan -R -i 10 --interface "$IF" --localnet | awk '{ print "\""$2"\", " }' | grep :.*: | sort | uniq)
	O="$O"' ] '
	echo "$O"
	echo "$O" > "$OUT"
	echo $(date)" sleeping..."
	sleep "$SLEEP"
done
