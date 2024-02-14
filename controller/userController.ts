"use server";
import connect from "@/config/db";
import userModel from "@/models/user.model";
import { cookies } from "next/headers";

export async function logout() {
  cookies().delete("nextChat");
}

export async function getUserId() {
  try {
    let cookie = cookies().get("nextChat");
    return cookie ? cookie.value : "";
  } catch (error) {
    console.log(error);
  }
}

export async function getAllUsers() {
  try {
    await connect();
    const res = await userModel.find({}).select("-password");
    return await JSON.parse(JSON.stringify(res));
  } catch (error: any) {
    return error.message;
  }
}

export async function updateIsOnine(user: string, value: boolean) {
  try {
    await connect();
    if (!user || user === "") user = (await getUserId()) || "";
    const res = await userModel.findOne({ _id: user });
    if (res) {
      res.isOnline = value;
      await res.save();
    }
    // console.log(res, "updateisOnline");
    return "status updated";
  } catch (error: any) {
    return error.message;
  }
}
