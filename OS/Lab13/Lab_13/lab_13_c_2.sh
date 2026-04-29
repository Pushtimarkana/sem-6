:'
        To Check if a Directory Exists
'



#!/bin/bash

echo "Enter directory name:"
read dirname

if [ -d "$dirname" ]
then
    echo "Directory exists."
else
    echo "Directory does not exist."
fi
