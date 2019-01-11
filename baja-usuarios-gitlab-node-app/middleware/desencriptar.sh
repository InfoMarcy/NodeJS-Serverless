#!/bin/bash
openssl enc -aes-256-cbc -in $1 -d -a -k banco2018
