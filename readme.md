To setup the project.

1. npm i

Database prisma migration - 

    1. npx prisma migrate dev --name init    (to migrate schema)
    2. npx prisma db push                    (push the schema to db)


Postgres on docker - 

    1. docker pull postgresq                (download the docker image)
    2. docker run --name some-postgres -p 5432:5432 -e POSTGRES_PASSWORD=password -d postgres   (initiate the docker image and container)
    3. docker start [image-name]     (from next time)  

To stop docker container - 

    1. docker container ls           (list the containers to get the id)
    2. docker stop [container_id]    (use the id to stop the container)
