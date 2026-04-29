:'
    To Count the Number of Lines in a File
'

#!/bin/bash

echo "Enter file name:"
read filename

wc -l "$filename"
