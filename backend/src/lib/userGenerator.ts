import axios from "axios";

const colours = ["RED", "GREEN", "BLUE"];

export const generateRandomUser = async () => {
  const randomUser = await axios.get("https://randomuser.me/api/");
  const data = randomUser.data.results[0];

  const firstName = data.name.first;
  const lastName = data.name.last;
  const colour = colours[Math.floor(Math.random() * colours.length)];
  const randomConnectionCount = Math.floor(Math.random() * 50);

  console.log({ firstName, lastName, colour, randomConnectionCount });
};
