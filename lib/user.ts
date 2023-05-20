import { clerkClient } from "@clerk/nextjs/server";

export const getUserName = async (userId: string, onlyInitials: boolean = false) => {
  const user = await clerkClient.users.getUser(userId);

  if (onlyInitials && user.firstName)
    return user.firstName?.[0] + user.lastName?.[0];

  return user.firstName + " " + user.lastName;
};