const app=require("./app")
const cloudinary =require("cloudinary")

//Handling uncaught exception
process.on("uncaughtException",(err)=>{
    console.log(`Caught Exception: ${err.message}`);
    console.log(`Shutting down server due to uncaught exception`);
    process.exit(1);
})

// dotenv file importing process
const dotenv=require("dotenv");

dotenv.config({ path: "config/config.env" });

//Connecting to database in the server
const connectDatabase = require("./config/database")
connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is running on http://localhost:${process.env.PORT}`)
});

// Unhandled promise rejection
process.on('unhandledRejection', (err) => {
console.log(`Error : ${err.message}`);
console.log(`Shutting down the server due unhandled promise rejection`)
server.close(()=>{
    process.exit(1);
})
})