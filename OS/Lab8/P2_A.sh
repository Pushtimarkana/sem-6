# 2. To accept two integers and check whether they are equal or not if both numbers are not equal 
# then find the largest number from the two numbers and check whether the largest number is 
# divisible by 5 or 7 or both. 

#!/bin/bash

echo "Enter first number:"
read a
echo "Enter second number:"
read b

if [ $a -eq $b ]
then
    echo "Both numbers are equal"
else
    if [ $a -gt $b ]
    then
        largest=$a
    else
        largest=$b
    fi

    echo "Largest number is: $largest"

    if [ $((largest % 5)) -eq 0 ] && [ $((largest % 7)) -eq 0 ]
    then
        echo "Divisible by both 5 and 7"
    elif [ $((largest % 5)) -eq 0 ]
    then
        echo "Divisible by 5"
    elif [ $((largest % 7)) -eq 0 ]
    then
        echo "Divisible by 7"
    else
        echo "Not divisible by 5 or 7"
    fi
fi
