# 1. To print numbers between two given numbers which is divisible by 2 but not divisible by 3 
#!/bin/bash

echo "Enter starting number:"
read start
echo "Enter ending number:"
read end

i=$start
while [ $i -le $end ]
do
    if [ $((i % 2)) -eq 0 ] && [ $((i % 3)) -ne 0 ]
    then
        echo $i
    fi
    i=$((i + 1))
done
