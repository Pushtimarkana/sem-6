# 3. Convert Number to Words (1–5)
#!/bin/bash

echo "Enter number (1-5):"
read n

case $n in
  1) echo "One" ;;
  2) echo "Two" ;;
  3) echo "Three" ;;
  4) echo "Four" ;;
  5) echo "Five" ;;
  *) echo "Invalid number" ;;
esac
