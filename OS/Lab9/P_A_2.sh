#2. Print Numbers from 1 to n

#!/bin/bash

echo "Enter value of n:"
read n

i=1
while [ $i -le $n ]
do
    echo $i
    i=$((i + 1))
done
