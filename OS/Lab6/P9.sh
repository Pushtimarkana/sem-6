# 3. To check if a triangle is valid based on side lengths. 
# (Sum of two sides are greater than third side) 

#!/bin/bash

echo "Enter a edge 1 : "
read a

echo "Enter a edge 2 : "
read b

echo "Enter a edge 3 : "
read c


if [$(( a + b)) -gt $c )] && [( $((b + c)) -gt $a )] && [( $((a + c)) -gt $b )]
then
    echo "Triangle is valid"
else
    echo "Triangle is not valid"
fi