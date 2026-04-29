# 4. For basic calculator.
#!/bin/bash

echo "Enter first number:"
read a
echo "Enter second number:"
read b
echo "Choose operation (+ - * /):"
read op

case $op in
  +) echo "Result = $((a+b))" ;;
  -) echo "Result = $((a-b))" ;;
  \*) echo "Result = $((a*b))" ;;
  /) echo "Result = $((a/b))" ;;
  *) echo "Invalid operator" ;;
esac
