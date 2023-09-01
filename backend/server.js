const app = require('./app')
const dotenv = require('dotenv')
const connectDB = require('./db/connect')

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
})

dotenv.config({ path: "./config/config.env" });

const db = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

const PORT = process.env.PORT || 5000

const server = async () => {
    await connectDB(db);
    app.listen(PORT, ()=>{
        console.log(`Listening on ${PORT}...`);
    })
}

server();

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION! Shutting down...');
    server.close(() => {
        process.exit(1);
    });
});