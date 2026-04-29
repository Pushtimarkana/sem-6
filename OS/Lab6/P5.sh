# 2. To check whether given no is divisible by 5 or not. 
#!/bin/bash

echo "Enter a number 1 : "
read num1



if [ $((num1 % 5)) -eq 0 ]
then
    echo "The number $num1  is divisible by 5."
else
    echo "The number $num1 is divisible by 5."
fi