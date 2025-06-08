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
