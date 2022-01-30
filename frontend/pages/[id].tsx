import { GetServerSideProps } from "next";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { useMutation, useQuery } from "react-query";
import { queryClient } from "./_app";

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
      const response = await axios.get(`http://localhost:5000/users/${id}`);
      return response.data;
    }
  );

  const changeColour = useMutation(
    (newColour) =>
      axios.patch(`http://localhost:5000/users/${id}/colour`, {
        colour: newColour,
      }),
    {
      onSuccess: (res) => {
        // ✅ refetch the comments list for our blog post
        console.log(res);
        queryClient.invalidateQueries(["user", id]);
      },
    }
  );

  if (isLoading) return <p>loading...</p>;
  if (isError) return <p>{error.message}</p>;

  return (
    <>
      <div className="flex items-center space-x-2">
        <p className="space-x-2">
          <span className="font-medium">
            {data.firstName} {data.lastName}
          </span>
          <span>has favourite colour:</span>
        </p>
        <FavouriteColourSelection initialColour={data.favouriteColour} />
      </div>

      <h4 className="mt-6 font-bold">Connections</h4>

      <ul>
        {data.relations.map((connection) => (
          <li key={connection.id} onClick={() => changeColour.mutate("BLUE")}>
            {/* <Link href={`${connection.id}`}> */}
            <a>
              {connection.firstName} {connection.lastName} -{" "}
              {connection.favouriteColour}
            </a>
            {/* </Link> */}
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

    // TODO: send the new colour to the server
  };

  return (
    <form>
      <select
        value={selectedColour}
        onChange={(e) => onChange(e)}
        className="rounded border-2 border-gray-300"
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
