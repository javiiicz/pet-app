const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

let pets = [
    {
        id: 1,
        name: "Rex",
        type: "dino",
        age: 65,
        description: "Age in billions of years",
    },
    {
        id: 2,
        name: "Fido",
        type: "dog",
        age: 4,
        description: "Do not let him outside",
    },
    {
        id: 3,
        name: "Mouse",
        type: "cat",
        age: 6,
        description: "Let her outside",
    },
];

app.get("/", (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Adopt-a-Pet</title>
            </head>
            <body>
                <h1>Adopt-A-Pet App</h1>
                <p>Welcome to my server.</p>
            </body>
        </html>`);
});

app.get("/pets", (req, res) => {
    res.json(pets)
})

app.get("/hello-world", (req, res) => {
    res.send("Hello, World!");
});

app.get("/hello-pet", (req, res) => {
    res.send("Hello, Pet!");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
