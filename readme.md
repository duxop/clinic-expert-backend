# Install node and npm.

## Initial setup 
    npm i

<!-- DATABASE -->
### Host the postgres prisma schema on localhost.
    npx prisma dev clinicxpert-db

### Make the migrations using -
    npx prisma migrate dev --name init
    node prisma/seed.js 

### to start the server 
    npm run dev

# Extra commands

### reseting database
    npx prisma migrate reset

### if you delete migrations files or any other error in db server then run
    npx prisma db push   


reset db -

npx prisma migrate reset

npx prisma db push --force-reset


npx prisma db push --force-reset


ec2 

source ~/.bashrc