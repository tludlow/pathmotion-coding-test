import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "react-query";

// Get the class name which is the same as the colour provided. Fine implementation for a small number of colours such as here but not that scalable.
const getClassForColour = (colour: string) => {
  if (colour === "RED") return "text-red-500";
  if (colour === "GREEN") return "text-green-500";
  return "text-blue-500";
};

export default function Index() {
  // The current page of users we have loaded
  const [page, setPage] = useState(0);

  // Load the users
  const { isLoading, isError, data, error } = useQuery(
    ["users", page],
    async () => {
      const response = await axios.get(
        `http://localhost:5000/users?page=${page}`
      );
      return response.data;
    }
  );

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{error.message}</p>;

  return (
    <>
      <h1 className="text-2xl font-bold">Rainbow Connection</h1>

      <h3 className="mt-12 font-bold">Users</h3>
      <ul className="space-y-10">
        {data.users.length === 0 ? (
          <p>There are no users...</p>
        ) : (
          data.users.map((user) => (
            <li key={user.id} className="space-x-10">
              <Link href={`/${user.id}`}>
                <a>
                  {user.id} - {user.firstName} {user.lastName}
                </a>
              </Link>
              <span className={`${getClassForColour(user.favouriteColour)}`}>
                {user.favouriteColour}
              </span>
              {user.relations.map((connection) => (
                <Link href={`/${connection.id}`}>
                  <a>
                    {connection.firstName} {connection.lastName}
                  </a>
                </Link>
              ))}
            </li>
          ))
        )}
      </ul>
    </>
  );
}
