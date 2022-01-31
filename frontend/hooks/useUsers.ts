import axios from "axios";
import { useInfiniteQuery } from "react-query";

const fetchUsers = async ({ pageParam = 0 }) => {
  const response = await axios.get(
    `http://localhost:5000/users?page=${pageParam}`
  );
  return response.data;
};

export default function useUsers() {
  return useInfiniteQuery<any, Error>(["users"], fetchUsers, {
    getNextPageParam: (lastPage) => {
      if (lastPage.hasNextPage) return undefined;
      return lastPage.nextPage;
    },
  });
}
