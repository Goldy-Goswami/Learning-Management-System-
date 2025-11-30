const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

const port = 3019
const app = express();


app.use(express.static(__dirname))
app.use(express.urlencoded({extended:true}))
app.use(express.json());
 

mongoose.connect('mongodb://127.0.0.1:27017/LMS')
const db = mongoose.connection
db.once('open',()=>{
    console.log("Connection is successfully Done ")
})


const UserSchema = new mongoose.Schema({
    email:String,
    password:String,
    role:String
})

const User = mongoose.model("Data",UserSchema)



app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'login.html'))
})


app.post("/post", async (req, res) => {
    const { email, password,  role
     } = req.body;

    const user = new User({
        email,
        password,
        role
    });

    await user.save();
    console.log("User saved:", user);

    if ( role === "student") {
        return res.sendFile(path.join(__dirname, "student-dashboard.html"));
    } 
    else if ( role === "teacher") {
        return res.sendFile(path.join(__dirname, "teacher-dashboard.html"));
    } 
    else {
        return res.status(400).send("Invalid role selected");
    }
});

app.listen(port,()=>{
   console.log("YOOHOOO!!!!")

}) 


// simple nanoid
function nanoid(length = 8) {
  return Math.random().toString(36).substr(2, length);
}
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "teacher-dashboard.html"));
});

// create live class link
app.get("/api/create-class", (req, res) => {
  const classId = nanoid(8);
  res.json({ link: `/live/${classId}` });
});

// serve live class page
app.get("/live/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "live.html"));
});

// HTTP server + socket.io
const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", socket.id);

    socket.on("offer", (data) =>
      socket.to(data.to).emit("offer", { from: socket.id, sdp: data.sdp })
    );

    socket.on("answer", (data) =>
      socket.to(data.to).emit("answer", { from: socket.id, sdp: data.sdp })
    );

    socket.on("ice", (data) =>
      socket.to(data.to).emit("ice", { from: socket.id, candidate: data.candidate })
    );
  });
});
 

let currentLiveClass = null; 

// Teacher creates a live class
app.get("/api/create-class", (req, res) => {
  const classId = nanoid(8);
  currentLiveClass = `/live/${classId}`;
  res.json({ link: currentLiveClass });
});

// Student checks if live class is active
app.get("/api/live-status", (req, res) => {
  res.json({ live: currentLiveClass !== null, link: currentLiveClass });
});

// When class ends, teacher can call this (later if needed)
app.get("/api/end-class", (req, res) => {
  currentLiveClass = null;
  res.json({ message: "Class ended" });
});

