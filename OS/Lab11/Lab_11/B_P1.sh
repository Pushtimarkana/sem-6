# 1. To find number of days in a month using switch case. 
#!/bin/bash

echo "Enter month number (1-12):"
read month

case $month in
  1|3|5|7|8|10|12) echo "31 Days" ;;
  4|6|9|11) echo "30 Days" ;;
  2) echo "28 or 29 Days" ;;
  *) echo "Invalid month" ;;
esac
