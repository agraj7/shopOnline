const app=require("./app")

//Handling uncaught exception
process.on("uncaughtException",(err)=>{
    console.log(`Caught Exception: ${err.message}`);
    console.log(`Shutting down server due to uncaught exception`);
    process.exit(1);
})

// dotenv file importing process
const dotenv=require("dotenv");

dotenv.config({ path: "backend/config/config.env" });

//Connecting to database in the server
const connectDatabase = require("./config/database")
connectDatabase();

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