#3. To check whether given no is ODD or EVEN. 
#!/bin/bash

echo "Enter a number 1 : "
read num1


if [ $((num1 % 2)) -eq 0 ]
then
    echo "The number $num1  is even."
else
    echo "The number $num2 is odd."
fi