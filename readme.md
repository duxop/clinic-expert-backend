# Install node and npm.

## Initial setup 
    npm i

<!-- DATABASE -->
### Host the postgres prisma schema on localhost.
    npx prisma dev

### Make the migrations using -
    npx prisma migrate dev --name init

### to start the server 
    npm run dev

# Extra commands

### reseting database
    npx prisma migrate reset

### if you delete migrations files or any other error in db server then run
    npx prisma db push   