# 3. Check whether a character is VOWEL or CONSONANT using switch. 

echo "Enter char: "
read char

case $char in:
    a|e|i|o|u|A|E|I|O|U)
        echo "Vowel";;
    *)
        echo "Consonant";;

esac