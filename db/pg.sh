sudo docker rm -f postgres-db && sudo docker container prune -f && sudo docker run \
  --name postgres-db \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=postgresdb \
  -p 5432:5432 \
  -v ./init.sql:/docker-entrypoint-initdb.d/init.sql \
  postgres:latest