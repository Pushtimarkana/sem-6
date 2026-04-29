# 3.Find Sum & Average of n Numbers
#!/bin/bash

echo "Enter how many numbers:"
read n

i=1
sum=0

while [ $i -le $n ]
do
    echo "Enter number $i:"
    read num
    sum=$((sum + num))
    i=$((i + 1))
done

avg=$(echo "$sum / $n" | bc -l)

echo "Sum = $sum"
echo "Average = $avg"
