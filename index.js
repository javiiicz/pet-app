const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

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
        adopted: true,
    },
    {
        id: 2,
        name: "Fido",
        type: "dog",
        age: 4,
        description: "Do not let him outside",
        adopted: false,
    },
    {
        id: 3,
        name: "Mouse",
        type: "cat",
        age: 6,
        description: "Let her outside",
        adopted: false,
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

app.get("/pets", (req, res, next) => {
    let queries = req.query

    let petList = pets;

    if (queries.type) {
        petList = petList.filter(x => x.type === queries.type)
    }

    if (queries.sort) {
        let sort = queries.sort
        if (sort==="age") {
            petList.sort((a,b) => {return a.age - b.age})
        } else if (sort==="name") {
            petList = petList.toSorted((a,b) => {return a.name.localeCompare(b.name)})
        }
    }

    if (queries.adopted) {
        console.log(petList)
        petList = petList.filter(x => x.adopted === JSON.parse(queries.adopted))
    }


    if (petList.length === 0) {
        next({message: "No pets to show", status: 404})
        return
    }
    
    res.json(petList);
});

app.get("/pets/:id", async (req, res, next) => {
    const id = req.params.id;
    const pet = pets.find((x) => x.id == id);
    console.log(pet);

    if (!pet) {
        next({message: "The pet with the specified ID does not exist", status: 404})
    } else {
        res.json(pet);
    }
});

app.post("/pets", (req, res, next) => {
    let body = req.body;
    let newPet = {
        id: uuidv4(),
        name: body.name,
        type: body.type,
        age: body.age,
        description: body.description,
        adopted: body.adopted,
    };
    if (newPet.name === undefined ||  newPet.type === undefined || newPet.age === undefined || newPet.adopted === undefined) {
        next({message: "The new pet is missing a name, type, age, or adopted state", status: 400})
        return
    }
    pets.push(newPet);
    res.json(newPet);
});

app.put("/pets/:id", (req, res) => {
    const id = req.params.id;
    let body = req.body;
    let newPet = {
        id: uuidv4(),
        name: body.name,
        type: body.type,
        age: body.age,
        description: body.description,
        adopted: body.adopted,
    };
    if (newPet.name === undefined ||  newPet.type === undefined || newPet.age === undefined || newPet.adopted === undefined) {
        next({message: "The new pet is missing a name, type, age, or adopted state", status: 400})
        return
    }
    let oldIndex = pets.findIndex((x) => x.id == id);
    if (oldIndex < 0) {
        next({message: "The pet with the specified ID does not exist", status: 404})
    } else {
        pets[oldIndex] = newPet;
        res.json(newPet);
    }
});

app.delete("/pets/:id", (req, res) => {
    const id = req.params.id;
    let oldIndex = pets.findIndex((x) => x.id == id);
    if (oldIndex < 0) {
        next({message: "The pet with the specified ID does not exist", status: 404})
    } else {
        pets.splice(oldIndex, 1)
        res.json({deleted: true});
    }
    console.log(pets)
});

app.get("/hello-world", (req, res) => {
    res.send("Hello, World!");
});

app.get("/hello-pet", (req, res) => {
    res.send("Hello, Pet!");
});

//error handling
app.use((err, req, res, next) => {
    const {message, status = 500} = err
    console.log(message)
    res.status(status).json({message}) // only for dev
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
