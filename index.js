const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const { PrismaClient } = require('./generated/prisma')
const prisma = new PrismaClient()

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

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

app.get("/pets", async (req, res, next) => {
    let queries = req.query

    let petList = await prisma.pet.findMany();

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
    const pet = await prisma.pet.findUnique({where: {id: parseInt(id)}});
    console.log(pet);

    if (!pet) {
        next({message: "The pet with the specified ID does not exist", status: 404})
    } else {
        res.json(pet);
    }
});

app.post("/pets", async (req, res, next) => {
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

    let {name, type, age, description, adopted} = newPet

    const added = await prisma.pet.create({
        data: {
            name,
            type,
            age,
            description,
            adopted
        }
    })
    res.json(added);
});

app.put("/pets/:id", async (req, res) => {
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
    let {name, type, age, description, adopted} = newPet

    const added = await prisma.pet.update({
        where: {id: parseInt(id)},
        data: {
            name,
            type,
            age,
            description,
            adopted
        }
    })
    res.send(added)
});

app.delete("/pets/:id", async (req, res) => {
    const id = req.params.id;

    const deleted = await prisma.pet.delete({
        where: {id: parseInt(id)}
    })

    console.log(deleted)
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
