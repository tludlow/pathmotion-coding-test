import axios from "axios";
import { queryClient } from "pages/_app";
import { useMutation } from "react-query";

export default function useMutateColour(id: string | string[] | undefined) {
  return useMutation(
    (newColour) =>
      axios.patch(`http://localhost:5000/users/${id}/colour`, {
        colour: newColour,
      }),
    {
      onSuccess: (res) => {
        console.log(res);
        queryClient.invalidateQueries(["user", id]);
      },
    }
  );
}
