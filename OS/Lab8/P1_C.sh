# 1. To input electricity unit charges and calculate total electricity bill according to the given condition: 
# For first 50 units Rs. 0.50/unit for next 100 units Rs. 0.75/unit for next 100 units Rs. 1.20/unit for 
# unit above 250 Rs. 1.50/unit an additional surcharge of 20% is added to the bill.

read -p "Enter total electricity units: " u

bill=0

case 1 in
1)
    if [ $u -le 50 ]
    then
        bill=$((u * 50))

    elif [ $u -le 150 ]
    then
        bill=$((50*50 + (u-50)*75))

    elif [ $u -le 250 ]
    then
        bill=$((50*50 + 100*75 + (u-150)*120))

    else
        bill=$((50*50 + 100*75 + 100*120 + (u-250)*150))
    fi
    ;;
esac


surcharge=$((bill * 20 / 100))
total=$((bill + surcharge))

echo "Bill = Rs.$((bill/100))"
echo "Surcharge = Rs.$((surcharge/100))"
echo "Total = Rs.$((total/100))"
