import Link from "next/link";
import ConnectionList from "./ConnectionList";

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  favouriteColour: "RED" | "GREEN" | "BLUE";
  relations: User[];
};
type UserTableProps = {
  users: User[];
};

export default function UserTableRows({ users }: UserTableProps) {
  return (
    <>
      {users.map((user) => (
        <tr
          key={user.id}
          className={user.id % 2 === 0 ? "bg-white" : "bg-gray-100"}
        >
          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
            <Link href={`/${user.id}`}>
              <a className="hover:underline">
                {user.firstName} {user.lastName}
              </a>
            </Link>
          </td>
          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
            <span style={{ color: user.favouriteColour }}>
              {user.favouriteColour}
            </span>
          </td>
          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
            <ConnectionList connections={user.relations} />
          </td>
        </tr>
      ))}
    </>
  );
}
