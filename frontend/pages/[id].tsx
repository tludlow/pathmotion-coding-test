import { GetServerSideProps } from "next";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "react-query";

// Load the dynamic route parameter on the server and provide it to the component so we dont have the problem where the id is undefined and after hydrating the client it is then provided
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  return {
    props: { id },
  };
};

export default function UserPage({ id }) {
  const { isLoading, isError, data, error } = useQuery(
    ["user", id],
    async () => {
      const response = await fetch(`http://localhost:5000/users/${id}`);
      if (!response.ok) {
        throw new Error("User not found");
      }
      return response.json();
    }
  );

  if (isLoading) return <p>loading...</p>;
  if (isError) return <p>{error.message}</p>;

  return (
    <>
      <h2>
        {id} - {data.firstName} {data.lastName}
      </h2>
      <p>Has favourite colour:</p>
      <FavouriteColourSelection initialColour={data.favouriteColour} />

      <h4 className="mt-6 font-bold">Connections</h4>

      <ul>
        {data.relations.map((connection) => (
          <li key={connection.id}>
            <Link href={`${connection.id}`}>
              <a>
                {connection.firstName} {connection.lastName} -{" "}
                {connection.favouriteColour}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

function FavouriteColourSelection({ initialColour }) {
  const [selectedColour, setSelectedColour] = useState(initialColour);
  const onChange = (e) => {
    setSelectedColour(e.target.value);
    console.log("changed to: " + e.target.value);
  };

  return (
    <form>
      <select
        defaultValue={selectedColour}
        value={selectedColour}
        onChange={(e) => onChange(e)}
        name="colour"
        id="colour"
      >
        <option value="GREEN">Green</option>
        <option value="RED">Red</option>
        <option value="BLUE">Blue</option>
      </select>
    </form>
  );
}
