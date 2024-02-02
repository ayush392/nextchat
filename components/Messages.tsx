"use client";
import {
  createNewMessage,
  getAllMessages,
} from "@/controller/messageController";
import { useState, useEffect, useRef } from "react";
import socket from "@/config/socket";
import { updateIsOnine } from "@/controller/userController";

function Messages({ user1, selectedChat }: any) {
  const [currMessage, setCurrMessage] = useState("");
  const [chats, setChats] = useState([] as any);
  const [onlineUsersList, setOnlineUsersList] = useState([
    { socketId: "", username: "" },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const isOnline = () => {
    let exists = false;
    onlineUsersList.length > 0 &&
      onlineUsersList.forEach((user) => {
        if (user.username === selectedChat.id) exists = true;
      });
    return exists;
  };

  const handleSend = async (e: any) => {
    e.preventDefault();
    const newMsg = await createNewMessage(currMessage, user1, selectedChat.id);
    setChats((prev: any) => [...prev, newMsg]);
    socket.emit("send_message", newMsg, user1, selectedChat.id);
    setCurrMessage("");
    messagesEndRef?.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  async function fetchAllMsg() {
    const res = await getAllMessages(selectedChat.id);
    // console.log(chats);
    setChats(res);
  }

  useEffect(() => {
    if (selectedChat?.id !== "") fetchAllMsg();
    messagesEndRef?.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView({
      behavior: "smooth",
    });

    const customTimeout = setTimeout(() => {
      const handleTyping = (user: any) => {
        setIsTyping(true);
        setTypingUser(user);
        setTimeout(() => {
          setIsTyping(false);
          setTypingUser("");
        }, 1500);
      };

      socket.on("receive_msg", (msg: any, user1: any, user2: any) => {
        console.log(user1, user2, selectedChat, "receive_msg");
        setChats((prev: any) => [...prev, msg]);
        messagesEndRef?.current?.scrollIntoView({
          behavior: "smooth",
        });
      });

      socket.on("onlineusers", (msg: any, value: string) => {
        console.log("usersList", msg);
        if (value === "offline") updateIsOnine(user1, false);
        setOnlineUsersList(msg);
      });

      socket.on("typing", handleTyping);
    }, 350);

    return () => {
      clearTimeout(customTimeout);
      // update isOnline from database
      socket.disconnect();
    };
  }, []);

  return !selectedChat.id ? (
    <div className="w-full border border-neutral-700 flex justify-center items-center">
      <h1 className="text-gray-400 text-xl font-medium">
        Select User from left side to start chatting...
      </h1>
    </div>
  ) : (
    <div className=" w-full relative ">
      <div className="flex  items-baseline p-3.5 mb-1.5 bg-neutral-900 rounded-tr-md">
        <h1 className=" font-bold text-lg">{selectedChat.name}</h1>
        <p className="text-xs ml-2 text-gray-300">{`${
          selectedChat.isOnline || isOnline() ? "(Online)" : "(Offline)"
        }`}</p>
        <p className="text-xs ml-2 text-gray-300">{`${selectedChat.id}`}</p>
      </div>
      <div className="mb-2  min-h-[92%]">
        <div className="overflow-x-hidden overflow-y-auto max-h-[35rem] md:max-h-[32rem]">
          {chats.map((chat: any, i: number) => {
            return (
              <p key={i} className=" my-1 mx-3 clear-both">
                <span
                  className={`  ${
                    chat.sender._id === user1
                      ? "bg-green-800 float-right"
                      : "bg-gray-700 float-left"
                  } px-2 py-1 rounded max-w-[60%] inline-block my-0.5`}
                >
                  {chat.content}
                  <span className="text-xs ml-2 inline-block">
                    {chat.status.isRead ? "read" : "..."}
                  </span>
                </span>
              </p>
            );
          })}
          {selectedChat.id === typingUser && isTyping && (
            <p className=" my-1 clear-both">
              <span className="px-2 py-1 block float-left italic text-sm">
                Typing...
              </span>
            </p>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>
      <div className="w-full py-3 bg-neutral-900 border-t-gray-900 absolute bottom-0 rounded-br-md">
        <form className="flex gap-3 max-w-full mx-3 md:mx-5">
          <input
            className=" w-full rounded px-2 bg-neutral-950 "
            type="text"
            value={currMessage}
            placeholder="Type your message.."
            onChange={(e: any) => setCurrMessage(e.target.value)}
            onKeyDown={() => socket.emit("typing", user1, selectedChat.id)}
          />
          <button
            className=" bg-green-700 px-3 py-2 rounded w-24 font-semibold hover:bg-green-800"
            onClick={handleSend}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Messages;
