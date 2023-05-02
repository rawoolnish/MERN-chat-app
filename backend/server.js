const express = require('express');
const chats = require('./data/data');
const chatRoutes = require('./routes/chaRoutes')
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
require('../config/db');
const path = require("path")
const messageaRoutes = require('./routes/messageRoutes')



const app = express();
app.use(cors())

const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/errorMidleware');

const PORT = process.env.PORT;


app.use(express.json())
app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageaRoutes)

///---------------------deployment-------------------//

const _dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(_dirname1, '/frontend/build')));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(_dirname1, "frontend", "build", "index.html"))
    })
} else {
    app.get('/', (req, res) => {
        res.send("API is running")
    })
}



///---------------------deployment-------------------//

app.use(notFound)
app.use(errorHandler)


const server = app.listen(5000, () => {
    console.log(`Server is running on ${process.env.NODE_ENV} mode port ${PORT}`)
})

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
    }
})

io.on("connection", (socket) => {
    console.log("Connected to Socket.io")


    socket.on("setup", (userData) => {
        socket.join(userData._id)

        socket.emit("connected");
    })

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("user joined Room" + room)
    })

    socket.on("typing", (room) => socket.in(room).emit("typing"))
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
        if (!chat.users) return console.log("chat users not defined")

        chat.users.forEach(user => {
            if (user._id == newMessageRecieved.sender._id) return;
            socket.in(user._id).emit("message recieved", newMessageRecieved)
        })
    })
    socket.off("setup", () => {
        console.log("USER_DISCONNECTED");
        socket.leave(userData._id)
    })
}) 