# 1. To find a largest number from 4 numbers. 
#!/bin/bash

echo "Enter four numbers:"
read a
read b
read c
read d

largest=$a

if [ $b -gt $largest ]
then
    largest=$b
fi

if [ $c -gt $largest ]
then
    largest=$c
fi

if [ $d -gt $largest ]
then
    largest=$d
fi

echo "Largest number is: $largest"
