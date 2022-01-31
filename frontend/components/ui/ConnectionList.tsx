import Link from "next/link";
import { User } from "./UserTableRows";

type ConnectionListProps = {
  connections: User[];
};
export default function ConnectionList({ connections }: ConnectionListProps) {
  return (
    <ul className="flex flex-wrap">
      {connections.map((connection, idx) => (
        <li className="block" key={connection.id}>
          <Link href={`/${connection.id}`}>
            <a className="flex-wrap-0 hover:underline">
              {connection.firstName} {connection.lastName}
            </a>
          </Link>
          {idx !== connections.length - 1 && <span className="mr-2">,</span>}
        </li>
      ))}
    </ul>
  );
}
