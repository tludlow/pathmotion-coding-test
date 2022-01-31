import { PrismaClient } from "@prisma/client";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { generateRandomUsers } from "./lib/userGenerator";

require("dotenv").config();
export const prisma = new PrismaClient();
const app = express();

// Basic express middlewares, one for setting CORS up correctly and one for parsing the body of requests
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const port = process.env.PORT || 5000;

// Hello world route to test the server is running
app.get("/", (req, res) => {
  res.status(200).send({ hello: "world" });
});

// GET route for all the users, is paged for efficiency, with a query string of page being provided to access further user data
app.get("/users", async (req, res) => {
  const page = req.query.page as string;
  let pageNum = 1;

  if (page) pageNum = parseInt(page);
  if (pageNum < 0)
    return res
      .status(400)
      .send({ error: "page number must be greater than 0" });

  const users = await prisma.user.findMany({
    take: 20,
    skip: 20 * pageNum,
    orderBy: { id: "asc" },
  });

  // Go through all the users and get their connections, then reform the resulting array with the new user objects that also include the connections they have.
  // Not ideal, could all be done in one single SQL query if not using prisma.
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
    const newUser = {
      ...user,
      relations: relationships,
    };
    formedUsers.push(newUser);
  }

  // Send the user data and some extra data for the frontend to use with the infinite scrolling
  res.status(200).send({
    page: pageNum,
    nextPage: pageNum + 1,
    users: formedUsers,
    hasNextPage: users.length === 0,
  });
});

// Get the user data for a given user by id
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

// Endpoint to clear the database and then seed it with some random data
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

  // Clear the current data for the project
  await prisma.$queryRaw`DELETE FROM _follows`;
  await prisma.user.deleteMany({});

  // Create [userCount] number of random users
  await generateRandomUsers(count);

  res.status(200).send({ count });
});

// Endpoint to update the favourite colour of a given user by id.
app.patch("/users/:id/colour", async (req, res) => {
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
