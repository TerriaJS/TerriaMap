# Merge a number of source datasource files into one large catalog
SOURCE=datasources
OUTDIR=datasources

if [[ -z `which jq` ]]; then
  echo "You need to install jq, in order to use this. Try one of: "
  echo "  sudo apt-get install jq"
  echo "  sudo brew install jq"
  exit 1
fi

for DIR in $SOURCE/*/; do
  # Remove trailing slash
  DIR=${DIR%%/}

  if ! ls ${DIR}/*.json 1> /dev/null 2>&1; then 
    echo "No source .json files found in $DIR/" 
    exit 1
  fi

  OUTFILE=${DIR}.json

  pushd $DIR > /dev/null
  echo "Merging all these files into $OUTFILE: `ls *.json | xargs`"
  popd > /dev/null
  
  jq=".[0].catalog[0].items=(map(.catalog[0].items)|map(add))|.[0]"

  cat $DIR/*.json | jq --compact-output --slurp $jq > $OUTFILE

done