import UserTableRows from "@components/ui/UserTableRows";
import useIntersectionObserver from "hooks/useIntersectionObserver";
import useUsers from "hooks/useUsers";
import { useEffect, useRef } from "react";

export default function Index() {
  // Load the user data using an infinite query for pagination
  const {
    isLoading,
    data,
    isError,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useUsers();

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(loadMoreRef, {});
  const isVisible = !!entry?.isIntersecting;

  // Loads more data in the infinite scroll when the div at the bottom of the scroll container becomes visibile
  useEffect(() => {
    if (isVisible && data) {
      console.log("loading more");
      fetchNextPage();
    }
  }, [entry]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Rainbow Connection</h1>
      <h3 className="mt-12 font-bold">Users</h3>

      {isLoading ? (
        <p>Loading users...</p>
      ) : isError ? (
        <p className="text-red-500">{error?.message}</p>
      ) : data?.pages.length === 0 ? (
        <p>There are no users...</p>
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
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Connections
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.pages.map((page, idx) => (
              <UserTableRows key={idx} users={page.users} />
            ))}
          </tbody>
        </table>
      )}

      <div ref={loadMoreRef}>{isFetchingNextPage ? "Loading more..." : ""}</div>
      {!hasNextPage && <p>No more users to show.</p>}
    </div>
  );
}
