const searchUsers = async (
  setSearchResults: any,
  setLoading: any,
  query: string,
  showStarredMessages?: boolean
) => {
  try {
    setLoading(true);
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/${
        showStarredMessages ? "search-starred-messages" : "searchUsers"
      }?query=${query}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );
    const data = await response.json();
    setSearchResults(showStarredMessages ? data.messages : data.users);
    setLoading(false);
  } catch (err) {
    setLoading(false);
  }
};

export default searchUsers;
