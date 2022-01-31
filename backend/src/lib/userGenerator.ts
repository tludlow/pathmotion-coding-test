import { prisma } from "./../index";
import axios from "axios";

// Supported colours in the application
const colours = ["RED", "GREEN", "BLUE"];

// Generate [total] random users and between 0 and 50 random connections for each random user generated. Should the total be less than 50 users, the total is the maximum number of connections for any given user.
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
  // (Probably a more elegant way of creating and then getting the users against to create connections but this works well given that prisma many-to-many relations are quite new and dont always work as expected)
  const users = await prisma.user.findMany();

  // Find the min and max current id for the new users so we can randomly generate connections between people in this range
  const idRangeQuery =
    await prisma.$queryRaw`SELECT min(id), max(id) FROM "User"`;
  const highestId = idRangeQuery[0].max;
  const lowestId = idRangeQuery[0].min;
  for (const user of users) {
    // Can only have a maximum of [userCount] connections when generating less than 50 users
    // Take the minimum of these and only find this many connections maximum
    const maxConnections = Math.min(50, total);
    const connectionCount = Math.floor(Math.random() * maxConnections);

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
