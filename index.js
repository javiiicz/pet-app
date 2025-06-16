const express = require("express");
const cors = require('cors')

const app = express();
app.use(cors())

const PORT = 3000;

app.get("/", (req, res) => {
    res.send("Welcome to my app!");
});

app.get("/hello-world", (req, res) => {
    res.send("Hello, World!")
})

app.get("/hello-pet", (req, res) => {
    res.send("Hello, Pet!")
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
