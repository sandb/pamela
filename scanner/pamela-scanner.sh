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
PAM_SCRIPT="${PAM_DIR}/$(basename $0)"
REGISTER=''
SIMULATE=''
IF='eth0'
OUT='http://yourserver.com/pamela/upload.php'
USER=''
PASSWORD=''
TRANSLATE=''
POST=''
TIMEOUT=200

function usage {
  echo "Usage: pamela-scanner [OPTIONS] 

  -i INTERFACE  Interface to arp-scan. Defaults to [${IF}]. 
  -o URL        The url of the pamela upload script (including /upload.php).
                Defaults to [${OUT}].
  -r            Register the script in cron every 2 minutes
  -q            Unregister the script from cron
  -u            Http-auth user. Defaults to [${USER}].
  -p            Http-auth password. Defaults to [${PASSWORD}].
  -s            Simulate, don't commit the post.
  -t URL        Translate mac addresses using the data provided from the 
                specified URL. CSV format expected (mac,name\\n).
  -h            Shows help
  
This pamela scanner is an arp-scanner that uploads mac addresses in your local 
lan on a webserver where you get a visual representation of those mac addresses 
present. Multiple people on multiple lans can run this or any other scanner 
together against the same web server, where all results will be agregated."
}

function check_if_root {
  if [ "$(id -ru)" != "0" ]
  then
    echo "Must be root to run pamela-scanner" 
    exit 1
  fi
}

function check_if_arpscan_installed {
  if [ -z "$(which arp-scan)" ]
  then
    echo "ENOARPSCAN: Could not find arp-scan, please install it"
  fi
}

function register {
  check_if_root
  check_if_arpscan_installed
  echo "Registering pamela in cron: ${PAM_CRON}"
  echo "*/2 *     * * *  root   [ -x \"${PAM_SCRIPT}\" ] && \"${PAM_SCRIPT}\" -i \"${IF}\" -o \"${OUT}\" -u \"${USER}\" -p \"${PASSWORD}\" -t \"${TRANSLATE}\" | logger -t pamela" > "${PAM_CRON}"
  echo "Depending on your version of crond, you might have to restart the cron daemon for the changes to take effect"
}

function unregister {
  check_if_root
  echo "Unregistering pamela in cron: ${PAM_CRON}"
  rm "${PAM_CRON}"
  echo "Depending on your version of crond, you might have to restart the cron daemon for the changes to take effect"
}

function parse_params {
  TEMP=$(getopt -o 'hrqsi:o:u:p:t:-n' "pamela arp scanner" -- "$@")
  if [ $? != 0 ]  
  then 
    echo "Could not parse parameters..." >&2 
    exit 1 
  fi

  eval set "${TEMP}"
  while true
  do
    shift;
    [ -z "$1" ] && break;
    case "$1" in
      -i) IF="$2"; shift;;
      -o) OUT="$2"; shift;;
      -u) USER="$2"; shift;; 
      -p) PASSWORD="$2"; shift;;
      -r) REGISTER='r';;
      -s) SIMULATE='s';;
      -q) unregister; exit 0;;
      -t) TRANSLATE="$2"; shift;;
      -h|'-?') usage; exit 1;;
      *) echo "Unknown param: [$1]"; usage; exit 1;;
    esac
  done
  # Register only after parsing all args 
  if [ -n "${REGISTER}" ]
  then 
    register
    exit 0
  fi
}

function scan {
  echo $(date)" scanning..."
  DATA=""
  NUM_DATA=0
  for M in $(arp-scan -R -i 10 --interface "${IF}" --localnet | awk '{ print $2 }' | grep :.*: | sort | uniq)
  do 
    [ -n "${DATA}" ] && DATA="${DATA},${M}" || DATA="${M}";
    let "NUM_DATA=NUM_DATA+1"
  done
  POST="${DATA}"
}

function translate {
  if [ -z "${TRANSLATE}" ]
  then
    return 0
  fi
 
  # translate denotes a url
  # save the output of the url to a file and use it as a file
  TRANSLATE_URL=${TRANSLATE}
  TRANSLATE=$(mktemp)

  wget --timeout="${TIMEOUT}" --no-check-certificate --quiet -O "${TRANSLATE}" "${TRANSLATE_URL}"

  POST=$(echo ${POST} | awk -v names="${TRANSLATE}" 'BEGIN { 
    RS="\n"
    FS=","
    count = 1
    while ((getline nl < names) > 0) { 
      split(nl, n); 
      nms[n[1]] = (count == 1 ? "gateway" : "hacker" count)
      count++
    }
    close(names)
    RS=","
    first=1
    count = 1
    while ((getline i)> 0) {
      sub(/\n$/,"",i)
      if (!first) 
        printf(",")
      printf (i in nms ? nms[i] : (count == 1 ? "gateway" : "hacker" count))
      first=0
      count++
    }
  }')


  rm ${TRANSLATE}
}

function upload {
  if [ -z "${SIMULATE}" ]
  then
    RESULT=$(wget "${OUT}" --timeout="${TIMEOUT}" --no-check-certificate -O - --quiet --post-data "data=${POST}" --user "${USER}" --password "${PASSWORD}")
  else
    echo Not executing: [wget "${OUT}" --timeout="${TIMEOUT}" --no-check-certificate -O - --quiet --post-data "data=${POST}" --user "${USER}" --password "${PASSWORD}"]
    RESULT=
  fi

  if [ -n "${RESULT}" ]
  then
    echo Error uploading results:
    echo "${RESULT}"
  fi
  echo $(date)" Uploaded ${NUM_DATA} mac addresses..."
}

parse_params $@
check_if_root
check_if_arpscan_installed 
scan
translate
upload

