composer identity issue -u $3 -a "org.coffeescm.$1#$2" -c networkadmin -f $1_$4.card

composer card import -f $1_$4.card -c $1_$4

ttab composer-rest-server -c $1_$4 -n never -u true -w true -p $5

