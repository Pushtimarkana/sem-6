#1. To check whether given no is NEGATIVE or POSITIVE. 
#!/bin/bash

echo "Enter a number 1 : "
read num1


if [ $num1 -gt 0 ]
then
    echo "The number $num1  is POSITIVE."
else
    echo "The number $num2 is NEGATIVE."
fi