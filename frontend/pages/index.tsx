import Link from "next/link";
import { useQuery } from "react-query";

export default function Index() {
  const { isLoading, isError, data, error } = useQuery(["users"], async () => {
    const response = await fetch(`http://localhost:5000/users`);
    if (!response.ok) {
      throw new Error("Error getting the users...");
    }
    return response.json();
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{error.message}</p>;

  return (
    <>
      <h1 className="text-2xl font-bold">Rainbow Connection</h1>

      <h3 className="mt-12 font-bold">Users</h3>
      <ul>
        {data.users.map((user) => (
          <li key={user.id} className="space-x-10">
            <Link href={`/${user.id}`}>
              <a>
                {user.id} - {user.firstName} {user.lastName}
              </a>
            </Link>
            <span>{user.favouriteColour}</span>
            {user.relations.map((connection) => (
              <Link href={`/${connection.id}`}>
                <a>{connection.id}</a>
              </Link>
            ))}
          </li>
        ))}
      </ul>
    </>
  );
}
