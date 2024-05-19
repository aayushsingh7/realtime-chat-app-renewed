import { UserType } from "../types/types";

const getSecondUserDetails = (
  users: UserType[],
  loggedInUser: UserType
): UserType => {
  //@ts-ignore
  if (!users) return;
  const secondUser = users.find((user: UserType) => {
    return user._id !== loggedInUser._id;
  });
  //@ts-ignore
  return secondUser;
};

export default getSecondUserDetails;
