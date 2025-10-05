'use client';

import { useEffect, useState, useRef } from "react";
import { IoIosClose, IoMdSend } from "react-icons/io";
import { getPrivliged } from "@/app/lib/utlis";
import { UseAuth } from "@/app/state/AuthProvider";

interface Message {
  id: string;
  sender_id: string;
  text: string;
  timestamp: string;
  username: string;
}

interface ChatProps {
  receiverId: string;
  receiverName: string;
  onCloseAction: () => void;
}

export default function ChatBox({ receiverId, receiverName, onCloseAction }: ChatProps) {
  const { user, authToken } = UseAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const ws = useRef<WebSocket | null>(null);

  // Fetch chat history
  useEffect(() => {
    if (!user?.id) return;
    getPrivliged(`/chat/messages/${receiverId}`).then(setMessages).catch(() => setMessages([]));
  }, [receiverId, user?.id]);

  // WebSocket connection
  useEffect(() => {
    if (!user?.id || !authToken) return;

    const socket = new WebSocket(`ws://127.0.0.1:8000/api/ws/chat/${receiverId}?token=${authToken}`);
    ws.current = socket;

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        setMessages((prev) => [...prev, msg]);
      } catch {}
    };

    return () => socket.close();
  }, [receiverId, user?.id, authToken]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !ws.current || ws.current.readyState !== 1) return;
    ws.current.send(input.trim());
    setInput("");
  };

  if (!user?.id) return <div className="p-4 text-center">Login required</div>;

  return (
    <section className="fixed bottom-0 right-1/3 max-w-md w-2/3 bg-white/90 rounded-xl shadow-lg p-5 flex flex-col h-[400px] z-[60]">
      <header className="flex justify-between items-center border-b pb-2 mb-4">
        <h2 className="text-2xl font-semibold">{receiverName}</h2>
        <button onClick={onCloseAction} className="text-sg hover:text-black">
          <IoIosClose size={30} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto space-y-3 px-3 mb-4 scrollbar-thin">
        {messages.map(({ id, text, sender_id, timestamp }) => {
          const isSelf = sender_id === user.id;
          return (
            <article key={id} className={`flex flex-col gap-1 ${isSelf ? "ml-auto" : ""}`} style={{ maxWidth: "33%" }}>
              <div className={`relative flex items-center justify-between p-3 rounded-2xl text-sm ${isSelf ? "bg-sg text-black" : "bg-gray-200 text-gray-700 italic"}`}>
                <span className="flex-grow break-words">{text}</span>
              </div>
              <time className="text-xs text-gray-700">{new Date(timestamp).toLocaleTimeString()}</time>
            </article>
          );
        })}
        <div ref={bottomRef} />
      </main>

      <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write a message..."
          autoComplete="off"
          spellCheck={false}
          className="flex-grow border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sg"
        />
        <button
          type="submit"
          disabled={!input.trim() || !ws.current || ws.current.readyState !== 1}
          className="bg-sg p-3 rounded-xl text-white flex items-center justify-center hover:bg-sg/90 disabled:opacity-50"
        >
          <IoMdSend size={20} />
        </button>
      </form>
    </section>
  );
}
