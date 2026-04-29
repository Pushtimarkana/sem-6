# 1. To check whether a given year is leap year or not. 
#!/bin/bash

echo "Enter a year : "
read year


if [ $((year % 4)) -eq 0 ]
then
    echo "$year is leap year"
else
    echo "$year is not leap year"
fi