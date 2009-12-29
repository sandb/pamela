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

function usage {

echo 'Usage: pamela-scanner [OPTIONS] 

  -i INTERFACE  Interface to arp-scan 
  -o URL        The url of the pamela upload script (including /upload.php) 
  -s TIME       The time to sleep between scans in seconds. 
  -h            Shows help
  
Pamela is an arp-scanner, it uploads the mac addresses in your local lan on a webserver
where you get a visual representation of the mac addresses present. Multiple people
on multiple lans can run pamela together against the same server, where all results
are agregated. In short, pamela gives you an overview of how big the shared network is.' 
exit 1

}

IF='wlan0'
OUT='http://localhost/sb/pamela/upload.php'
SLEEP='60'

TEMP=$(getopt -o 'hi:o:s:-n' "pamela arp scanner" -- "$@")
if [ $? != 0 ] ; then echo "Could not parse parameters..." >&2 ; exit 1 ; fi
eval set "$TEMP"
while true
do
	shift;
	[ -z "$1" ] && break;
	case "$1" in
		-i) IF="$2"; shift;;
		-o) OUT="$2"; shift;;
		-s) SLEEP="$2"; shift;;
		-h|'-?') usage; break;;
		*) echo "Unknown param: [$1]"; usage; exit 1;
	esac
done

sudo -n true || { echo "Must be root to run pamela-scanner"; exit 1; }

if [ -z "$(sudo which arp-scan)" ]
then
	echo "Could not find arp-scan, which is required for pamela to scan the mac addresses"
fi

while true
do
	echo $(date)" scanning..."
	NETMASK="$(ip -4 addr show "$IF" | egrep -o "brd [0-9\.]*" | egrep -o "[0-9\.]*")"
	MACS=""
	for M in $(sudo arp-scan -R -i 10 --interface "$IF" --localnet | awk '{ print $2 }' | grep :.*: | sort | uniq)
	do 
		[ -n "$MACS" ] && MACS="$MACS,$M" || MACS="$M";
	done
	POST="sn=$NETMASK&macs=$MACS"
	RESULT=$(wget "$OUT" -O - --quiet --post-data "$POST" || echo "wget error: $?")
	if [ -n "$RESULT" ]
	then
		echo Error uploading results:
		echo "$RESULT"
	fi
	echo $(date)" sleeping..."
	sleep "$SLEEP"
done
