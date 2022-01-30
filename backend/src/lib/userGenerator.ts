import { prisma } from "./../index";
import axios from "axios";
import { Colour } from "@prisma/client";

const colours = [Colour.RED, Colour.BLUE, Colour.GREEN];

export const generateRandomUsers = async (total: number) => {
  // Get the random names from randomuser.me, a nice way of getting real person names. Could easily just have arrays of random first and lastnames and select from those to create names
  const randomUsers = await axios.get(
    `https://randomuser.me/api/?results=${total}`
  );
  const responseData = randomUsers.data.results;

  // Load all of the new user data into an array so we can use prisma.createMany (more efficient for bulk inserts)
  let data = [];
  for (let i = 0; i < total; i++) {
    const colour = colours[Math.floor(Math.random() * colours.length)];
    data.push({
      firstName: responseData[i].name.first,
      lastName: responseData[i].name.last,
      favouriteColour: colour,
    });
  }
  await prisma.user.createMany({ data });

  // Generate the connections for each user, between 0 and 50 random connections.
  const users = await prisma.user.findMany();

  const highestId = users[users.length - 1].id;
  const lowestId = highestId - 49;
  for (const user of users) {
    // Can only have a maximum of [userCount] connections when generating less than 50 users
    const connectionCount = Math.floor(Math.random() * Math.max(50, total));
    console.log(
      "generating " + connectionCount + " connections for " + user.id
    );

    // Generate connectionCount random integers between highestId and lowestId not including the users own id
    let connections = [];
    for (let i = 0; i < connectionCount; i++) {
      const randomId = Math.floor(
        Math.random() * (highestId - lowestId) + lowestId
      );
      if (randomId !== user.id && !connections.includes(randomId)) {
        connections.push(randomId);
      }
    }

    // Send the raw query to prisma to create these connections, no good way yet in prisma to do this using the provided ORM considering the many-to-many self relations are quite niche.
    for (const connection of connections) {
      await prisma.$queryRaw`INSERT INTO _follows ("A", "B") VALUES (${user.id}, ${connection})`;
    }
  }
};
