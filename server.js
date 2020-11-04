const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () =>{
    console.log("server running on port " + PORT)
});
app.use(express.static("public"));

const socket = require("socket.io");
const io = socket(server);

let socketNumber = 0;
let drawingQueue = [];

io.on("connect", (socket) => {
    socketNumber++;
    drawingQueue.forEach(([drawColor, lineWidth, lastPos, [x,y]]) => {
        socket.emit("drawing", drawColor, lineWidth, lastPos, [x,y])
    });
    io.emit("socketNumber", socketNumber);
    socket.on("drawing", (drawColor, lineWidth, lastPos, [x,y]) => {
        drawingQueue.push([drawColor, lineWidth, lastPos, [x,y]])
        io.emit("drawing", drawColor, lineWidth, lastPos, [x,y])
    });
    socket.on("clearCanvas", () => {
        drawingQueue.length = 0;
        io.emit("clearCanvas");
    });
    socket.on("disconect", () =>{
        socketNumber--;
        io.emit("socketNumber", socketNumber);
    })

})
