#
#   DoHeads.sh
#
#   David Janes
#   2020-10-30
#
#   Run this from the home directory of your
#   complete Project Gutenberg archiv
#   Make sure to redirect the output somewhere!
#

find . -name "*txt" | 
grep -v old |
grep -v -- "-" |
while read FILENAME
do
    if ! head --bytes=2048 $FILENAME | grep -i English > /dev/null
    then
        ## echo "IGNORE $FILENAME"
        continue
    fi

    dos2unix < $FILENAME | head --bytes=2048 
done |
sed -e '1,$ s/:.*$/: /' 
grep -v '^$' |
sort |
uniq -c |
sort -nr 
