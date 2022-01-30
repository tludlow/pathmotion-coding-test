import { PrismaClient } from "@prisma/client";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { generateRandomUser } from "./lib/userGenerator";

require("dotenv").config();
const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.status(200).send({ hi: "hello" });
});

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany({ orderBy: { id: "asc" } });

  // Go through all the users and get their connections, then reform the resulting array with these included
  let formedUsers = [];
  for (const user of users) {
    const relationships = await prisma.$queryRaw`
    SELECT * FROM "User" WHERE id IN 
      (
          SELECT "A" FROM _follows
              WHERE "B" = ${user.id}
      UNION DISTINCT
          SELECT "B" FROM _follows
              WHERE "A" = ${user.id}
      )
  `;
    const newUser = { ...user, relations: relationships };
    formedUsers.push(newUser);
  }

  res.status(200).send({ users: formedUsers });
});

// Load the user, favourite colour and all connections and return as json
app.get("/users/:userId", async (req, res) => {
  const { userId } = req.params;

  // Ensure a user id is provided
  if (!userId) return res.status(400).send({ error: "No user id provided" });

  let id = parseInt(userId);

  // Make sure we have a positive integer
  if (id < 1)
    return res
      .status(400)
      .send({ error: "Invalid user id, must be positive integer" });

  // Get the basic information for the user, without connections
  const user = await prisma.user.findFirst({
    where: { id: parseInt(userId) },
  });

  // Only find the relationships if that user actually exists...
  if (!user) return res.status(404).send({ error: "User not found" });

  // Get the relationships for the user, using a raw query because bi-directional nature makes the orm query weird
  // might be a nicer way of doing this with just raw prisma but shouldn't be that big of a deal, good learning experience.
  const relationships = await prisma.$queryRaw`
    SELECT * FROM "User" WHERE id IN 
      (
          SELECT "A" FROM _follows
              WHERE "B" = ${id}
      UNION DISTINCT
          SELECT "B" FROM _follows
              WHERE "A" = ${id}
      )
  `;

  const finalUser = { ...user, relations: relationships };

  res.status(200).send(finalUser);
});

app.post("/testdata", async (req, res) => {
  const { userCount } = req.body;

  // Ensure the user count is provided
  if (!userCount)
    res.status(400).send({ error: "You must provide a user count" });

  const count = parseInt(userCount);

  // Check if the usercount provided is within the acceptable range
  if (count < 1 || count > 1000000)
    res
      .status(400)
      .send({ error: "The user count must be between 1 and 1000000" });

  generateRandomUser();
  res.status(200).send({ count });
});

app.patch("/user/:id/colour", async (req, res) => {
  const { id } = req.params;
  const { colour } = req.body;

  const validColours = ["RED", "GREEN", "BLUE"];
  if (!validColours.includes(colour))
    res.status(400).send({ error: "Invalid colour selected" });

  const updatedColour = await prisma.user.update({
    where: { id: parseInt(id) },
    data: { favouriteColour: colour },
  });

  res.status(200).send({ user: updatedColour });
});
// Start the express server on the port given within the .env file
app.listen(port, () => console.log(`server started on port ${port}`));
