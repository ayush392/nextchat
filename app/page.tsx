"use client";
import Messages from "@/components/Messages";
import Sidebar from "@/components/Sidebar";
import { getUserId, updateIsOnine } from "@/controller/userController";
import { useState, useEffect } from "react";
import { getAllUsers } from "@/controller/userController";
import socket from "@/config/socket";

function Home() {
  const [selectedChat, setSelectedChat] = useState({
    id: "",
    name: "",
    isOnline: false,
  });
  const [user1, setUser1] = useState("");
  const [users, setUsers] = useState([] as any);

  async function getUser() {
    const user = await getUserId();
    if (!user || user === "") {
      alert("please login");
      return;
    }
    setUser1(user);
    socket.auth = { user };
    socket.connect();
    await updateIsOnine(user1, true);
  }
  async function fetchData() {
    try {
      const res = await getAllUsers();
      setUsers(res);
    } catch (error) {
      alert(error);
    }
  }
  useEffect(() => {
    getUser();
    fetchData();
  }, [user1]);

  return (
    <div className=" w-dvw h-dvh flex items-center justify-center">
      <div className="flex w-[95%] h-[95%] max-w-7xl md:max-h-[90%] rounded-md shadow-md shadow-neutral-800">
        <Sidebar
          user1={user1}
          users={users}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
        />
        <Messages user1={user1} selectedChat={selectedChat} />
      </div>
    </div>
  );
}

export default Home;
