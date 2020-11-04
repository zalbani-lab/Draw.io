const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () =>{
    console.log("server running on port " + PORT)
});
app.use(express.static("public"));
