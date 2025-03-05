const express = require('express');
const http= require('http');
const cors=require('cors');
const mongoose=require('mongoose');
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
mongoose.connect(process.env.MONGO_CONNECTION_URL.trim()).then(()=>  server.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})).catch((err)=>{
    console.error(`Error while starting and connecting DB ${err}`);
});

