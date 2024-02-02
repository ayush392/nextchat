"use client";
import socket from "@/config/socket";
import { markAsRead } from "@/controller/messageController";

function Sidebar({ user1, selectedChat, setSelectedChat, users }: any) {
  function handleClick(user: any) {
    setSelectedChat({
      id: user._id,
      name: user.fullName,
      isOnline: user.isOnline,
    });
    // console.log("select", selectedChat);
    markAsRead(user1, user._id);
    socket.emit("join", user1, user._id);
  }

  return (
    <div className=" w-2/5 border-r border-r-neutral-700">
      <div className=" p-3.5 bg-green-800 rounded-ss-md">
        <h1 className=" font-bold text-lg">NextChat</h1>
      </div>
      <div className=" overflow-y-auto">
        <div>
          {users
            .filter((user: any) => user._id !== user1)
            .map((user: any) => {
              return (
                <div
                  key={user._id}
                  onClick={() => handleClick(user)}
                  className={`${
                    selectedChat.id === user._id &&
                    "border-l-4 border-l-green-500 font-semibold bg-black"
                  } font-medium border-b border-b-neutral-700 cursor-pointer`}
                >
                  <h1 className="p-3">{user.fullName}</h1>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
