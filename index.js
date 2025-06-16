const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require('uuid');

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
        adopted: true
    },
    {
        id: 2,
        name: "Fido",
        type: "dog",
        age: 4,
        description: "Do not let him outside",
        adopted: false
    },
    {
        id: 3,
        name: "Mouse",
        type: "cat",
        age: 6,
        description: "Let her outside",
        adopted: false
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
    let petList = pets
    res.json(petList)
})

app.get("/pets/:id", async (req, res) => {
    const id = req.params.id
    const pet = pets.find(x => x.id == id)
    console.log(pet)
    
    if (!pet) {
        res.status(404).send("Pet not found")
    } else {
        res.json(pet)
    }
})

app.post("/pets", (req, res) => {
    let body = req.body;
    let newPet = {
        id: uuidv4(),
        name: body.name,
        type: body.type,
        age: body.age,
        description: body.description,
        adopted: body.adopted
    }
    pets.push(newPet)
    res.json(newPet)
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
