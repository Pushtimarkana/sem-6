#2. To find a largest number from 2 numbers. 
#!/bin/bash

echo "Enter a number 1 : "
read num1

echo "Enter a number 2 : "
read num2

if [ $num1 -gt $num2 ]
then
    echo "The number $num1  is greater"
else
    echo "The number $num2 is greater"
fi
