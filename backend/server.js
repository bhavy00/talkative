const app = require('./app')
const dotenv = require('dotenv')
const connectDB = require('./db/connect')

dotenv.config({ path: "./config/config.env" });

const db = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

const PORT = process.env.PORT || 5000

const start = async () => {
    try {
        await connectDB(db);
        app.listen(PORT, ()=>{
            console.log(`Listening on ${PORT}...`);
        })
    } catch (error) {
        console.log(error);
    }
}

start();