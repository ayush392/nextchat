"use server";
import connect from "@/config/db";
import messageModel from "@/models/message.model";
import { getUserId } from "./userController";

const getRoomId = (user1: any, user2: any) => {
  const id = [user1, user2].sort();
  return id[0] + id[1];
};

export async function getAllMessages(user2: string) {
  try {
    await connect();
    const user1 = await getUserId();
    if (!user1 || !user2) return [];
    const roomId = getRoomId(user1, user2);

    const res = await messageModel.find({ roomId }).populate("sender");
    return await JSON.parse(JSON.stringify(res));
  } catch (error) {
    console.log(error);
  }
}

export async function createNewMessage(content: any, user1: any, user2: any) {
  try {
    await connect();
    const roomId = getRoomId(user1, user2);
    const newMsg = await messageModel.create({
      content,
      sender: user1,
      roomId,
    });

    const res = await messageModel
      .findOne({ _id: newMsg._id })
      .populate("sender");
    return await JSON.parse(JSON.stringify(res));
  } catch (error) {
    console.log(error);
  }
}

export async function markAsRead(user1: any, user2: any) {
  try {
    await connect();
    const roomId = getRoomId(user1, user2);
    const res = await messageModel.updateMany(
      { roomId },
      { $set: { "status.isRead": true, "status.readTime": Date.now() } }
    );
    // const res2 = await messageModel.find({ roomId }).populate("sender");
    // return await JSON.parse(JSON.stringify(res2));
    console.log(res);
  } catch (error) {
    console.log(error);
  }
}
