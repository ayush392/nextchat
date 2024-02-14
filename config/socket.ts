"use client";
import { io } from "socket.io-client";

const URL =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : "https://nextchat-c2o6.onrender.com";
const socket = io(URL, { autoConnect: false });

export default socket;
