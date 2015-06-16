# Merge a number of source datasource files into one large catalog
SOURCE=datasources
OUTFILE=wwwroot/init/nm.json

if [[ -z `which jq` ]]; then
  echo "You need to install jq, in order to use this. Try one of: "
  echo "  sudo apt-get install jq"
  echo "  sudo brew install jq"
  exit 1
fi

if ! ls ${SOURCE}/*.json 1> /dev/null 2>&1; then 
  echo "No source .json files found in $SOURCE/" 
  exit 1
fi

pushd $SOURCE > /dev/null
echo "Merging all these files into $OUTFILE: `ls *.json | xargs`"
popd > /dev/null
# Set the first catalog to be the sum of all the catalogs, in order, while retaining other top level properties.
# Then select only that first catalog
jq=".[0].catalog=(map(.catalog|arrays)|map(add))|.[0]"

cat $SOURCE/*.json | jq --compact-output --slurp $jq > $OUTFILE
