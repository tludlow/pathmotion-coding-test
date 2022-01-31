import FavouriteColourSelection from "@components/ui/FavouriteColourSelector";
import useMutateColour from "hooks/useMutateColour";
import useUser from "hooks/useUser";
import { GetServerSideProps } from "next";
import Link from "next/link";
import React from "react";

// Load the dynamic route parameter on the server and provide it to the component so we dont have the problem where the id is undefined and after hydrating the client it is then provided
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  return {
    props: { id },
  };
};

type UserPageProps = {
  id: string | string[] | undefined;
};
export default function UserPage({ id }: UserPageProps) {
  const { isLoading, isError, data, error } = useUser(id);

  const changeColour = useMutateColour(id);

  if (isLoading) return <p>loading...</p>;
  if (isError) return <p>{error?.message}</p>;

  return (
    <>
      <div className="flex items-center space-x-2">
        <p className="space-x-2">
          <span className="font-medium">
            {data?.firstName} {data?.lastName}
          </span>
          <span>has favourite colour:</span>
        </p>
        <FavouriteColourSelection
          initialColour={data!.favouriteColour}
          mutateFunction={changeColour}
        />
      </div>

      <h4 className="mt-6 font-bold">
        {data?.firstName} {data?.lastName}'s Connections
      </h4>

      {data?.relations.length === 0 ? (
        <p>They have no connections :(</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-200">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Favourite Colour
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.relations.map((connection) => (
              <tr
                key={connection.id}
                className={connection.id % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  <Link href={`/${connection.id}`}>
                    <a className="hover:underline">
                      {connection.firstName} {connection.lastName}
                    </a>
                  </Link>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  <span style={{ color: connection.favouriteColour }}>
                    {connection.favouriteColour}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
