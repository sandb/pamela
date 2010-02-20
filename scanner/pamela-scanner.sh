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

PAM_DIR="$(cd $(dirname $0) && pwd)"
PAM_CRON="/etc/cron.d/pamela"
PAM_SCRIPT="$PAM_DIR/$(basename $0)"
PAM_LOG="$PAM_DIR/pamela.log"

REGISTER=

IF='eth0'
OUT='http://yourserver.com/pamela/upload.php'
USER=''
PASSWORD=''

function usage {

echo "Usage: pamela-scanner [OPTIONS] 

  -i INTERFACE  Interface to arp-scan. Defaults to [$IF]. 
  -o URL        The url of the pamela upload script (including /upload.php). 
		Defaults to [$OUT].
  -r		Register the script in cron every 2 minutes
  -q		Unregister the script from cron
  -u		Http-auth user. Defaults to [$USER].
  -p		Http-auth password. Defaults to [$PASSWORD].
  -h            Shows help
  
Pamela is an arp-scanner, it uploads the mac addresses in your local lan on a
webserver where you get a visual representation of the mac addresses present.
Multiple people on multiple lans can run pamela together against the same
server, where all results are agregated. In short, pamela gives you an overview
of how big the shared network is." 

exit 1

}

function register {
	echo "Registering pamela in cron: $PAM_CRON"
	echo "*/2 *     * * *     root   [ -x \"$PAM_SCRIPT\" ] && \"$PAM_SCRIPT\" -i \"$IF\" -o \"$OUT\" -u \"$USER\" -p \"$PASSWORD\" >> \"$PAM_LOG\"" > "$PAM_CRON"
	exit 0
}

function unregister {
	echo "Unregistering pamela in cron: $PAM_CRON"
	rm "$PAM_CRON"
	exit 0
}

TEMP=$(getopt -o 'hrqi:o:s:u:p:-n' "pamela arp scanner" -- "$@")
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
		-u) USER="$2"; shift;; 
		-p) PASSWORD="$2"; shift;;
		-r) REGISTER='r';;
		-q) unregister; break;;
		-h|'-?') usage; break;;
		*) echo "Unknown param: [$1]"; usage; exit 1;
	esac
done

#register only after parsing all args 
[ -n "$REGISTER" ] && register

if [ "$(id -ru)" != "0" ]
then
	echo "Must be root to run pamela-scanner" 
	exit 1
fi

if [ -z "$(which arp-scan)" ]
then
	echo "ENOARPSCAN: Could not find arp-scan, please install it"
fi

echo $(date)" scanning..."
NETMASK="$(ip -4 addr show "$IF" | egrep -o "brd [0-9\.]+" | egrep -o "[0-9\.]+")"
MACS=""
NUM_MACS=0
for M in $(arp-scan -R -i 10 --interface "$IF" --localnet | awk '{ print $2 }' | grep :.*: | sort | uniq)
do 
	[ -n "$MACS" ] && MACS="$MACS,$M" || MACS="$M";
	let "NUM_MACS=NUM_MACS+1"
done
POST="sn=$NETMASK&macs=$MACS"
RESULT=$(wget "$OUT" -O - --quiet --post-data "$POST" --user "$USER" --password "$PASSWORD" || echo "wget error: $?")
if [ -n "$RESULT" ]
then
	echo Error uploading results:
	echo "$RESULT"
fi
echo $(date)" Uploaded $NUM_MACS mac addresses..."
