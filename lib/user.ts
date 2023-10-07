import { clerkClient, type User } from "@clerk/nextjs/server";

export const getUserName = (user?: User, onlyInitials: boolean = false) => {
  if (!user) return "";
  if (onlyInitials && user.firstName)
    return user.firstName?.[0] + user.lastName?.[0];

  return user.firstName + " " + user.lastName;
};

export const getUser = async (userId: string) => {
  const user = await clerkClient.users.getUser(userId);
  
  return user;
};

export const getAllUsers = async () => {
  const users = await clerkClient.users.getUserList();

  return users;
}