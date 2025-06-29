#/bin/bash

docker run -d \
  --name travel-journal-db \
  -p 5432:5432 \
  -e POSTGRES_DB=traveljournal \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=secret \
  postgis/postgis:15-3.4


  psql -h localhost -p 5432 -U admin -d traveljournal
