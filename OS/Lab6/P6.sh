# 3. To check whether person is eligible to vote. (age>18). 
#!/bin/bash

echo "Enter a age : "
read age


if [ $age -gt 18 ]
then
    echo "Person is eligible for vote."
else
    echo "Person is not eligible for vote."
fi