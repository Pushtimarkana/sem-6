# 2. To check whether number is EVEN or ODD using switch.
#!/bin/bash

echo "Enter a number:"
read num

case $((num % 2)) in
  0) echo "Even Number" ;;
  1) echo "Odd Number" ;;
esac
