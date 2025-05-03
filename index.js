const express = require('express');
const http= require('http');
const cors=require('cors');
const mongoose=require('mongoose');
const worker =require('worker_threads')
require('dotenv').config();

const socket= require("./helpers/socket.js");

const PORT=process.env.PORT;
const app=express();
const server = http.createServer(app);
const io=socket.init(server);


const userRouter=require('./routes/users.js')
const chatGroupRouter= require('./routes/chatGroup.js')


app.use(cors());
app.use(express.json());


app.use("/users", userRouter);
app.use("/chat", chatGroupRouter);

app.get(process.env.SECRET_PATH, (req, res)=>{
    console.log('secret path hit')
    res.send(process.env.SECRET_MESSAGE);
})

io.on('connection', (socket)=>{
    console.log('New User is connected', socket.id);

    socket.on("disconnect", ()=>{
        console.log("User Disconnected", socket.id);
        
    })
});

mongoose.set('strictQuery', true);
console.log('DB_URL', process.env.MONGO_CONNECTION_URL.trim())
console.log('JWT pass key', process.env.JWT_PASS_KEY)
console.log('PORT', process.env.PORT)
console.log('SECRET_MESSAGE', process.env.SECRET_MESSAGE)
console.log('SECRET_PATH', process.env.SECRET_PATH)
console.log('HOST_POST', process.env.HOST_PORT)
console.log('Rebuild 3');

mongoose.connect(process.env.MONGO_CONNECTION_URL.trim()).then(()=>  server.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})).catch((err)=>{
    console.error(`Error while starting and connecting DB ${err}`);
});

