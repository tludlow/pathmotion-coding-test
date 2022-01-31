import { User } from "./../components/ui/UserTableRows";
import axios from "axios";
import { useQuery } from "react-query";

export default function useUser(id: string | string[] | undefined) {
  return useQuery<User, Error>(["user", id], async () => {
    const response = await axios.get(`http://localhost:5000/users/${id}`);
    return response.data;
  });
}
