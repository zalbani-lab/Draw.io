const socket = io();
socket.emit("text", "Hi there, I am a client");


createPalette();

function createPalette(){
    const COLORS = [
        "black",
        "gray",
        "silver",
        "white",
        "lightblue",
        "cyan",
        "blue",
        "darkblue",
        "purple",
        "magenta",
        "red",
        "orange",
        "yellow",
        "lime",
        "green",
        "olive",
        "brown",
        "maroon",
    ];

    const palette = document.getElementById("palette");
    COLORS.forEach((color) => {
        const colorElement = document.createElement("div")
        colorElement.classList.add("colorSquare");
        colorElement.style.backgroundColor = color;
        palette.appendChild(colorElement);
    })
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d")

let mousePressed = false;
let lastPos = null;
let drawColor = "black";
let lineWidth = "15";

function mousePos(e){
    const rect = canvas.getBoundingClientRect();
    return[(e.clientX - rect.left) * (canvas.width / rect.width),
        (e.clientY - rect.top) * (canvas.height / rect.height)];
}

canvas.addEventListener("mousedown",(e) => {
    mousePressed = true;
    draw(e);
});

document.addEventListener("mouseup", (e) => {
    mousePressed = false;
    lastPos = null;
});

canvas.addEventListener("mouseleave", (e) =>{
    lastPos = null;
});

canvas.addEventListener("mousemove", (e) => {
    // const [x,y] = mousePos(e);
    // console.log(x,y);
    if (mousePressed){
        draw(e);
    }
})
function draw(e) {
    const [x, y] = mousePos(e)
    if(lastPos){
        socket.emit("drawing", drawColor, lineWidth, lastPos, [x,y]);
        lastPos = [x, y];
    }
    else{
        lastPos = [x, y];
    }
}

socket.on("drawing", (color, width, startPos, endPos) =>{
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineJoin = "round";
    ctx.moveTo(...startPos);
    ctx.lineTo(...endPos);
    ctx.closePath();
    ctx.stroke();
});

document.getElementById("clearBtn").addEventListener("click", () =>{
    socket.emit("clearCanvas");
});

socket.on("clearCanvas", () => {
    ctx.clearRect(0,0, canvas.width, canvas.height);
});

document.querySelectorAll(".colorSquare").forEach((square) =>{
    square.addEventListener("click", () =>{
        drawColor = square.style.backgroundColor;
        document.querySelectorAll(".widthExample").forEach((ex) => {
            ex.style.backgroundColor = drawColor;
        })
    })
})

document.querySelectorAll(".widthExample").forEach((ex) => {
    ex.addEventListener("click", () => {
        lineWidth = ex.clientWidth;
        document.querySelectorAll(".widthExample").forEach((other) =>{
            other.style.opacity = 0.4;
        })
        ex.style.opacity = 1;
    })
})

socket.on("socketNumber", (number) =>{
    document.getElementById("conter").innerText = number;
});
