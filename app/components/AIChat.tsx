"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      const aiMessage: Message = {
        role: "assistant",
        content: data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white shadow-2xl rounded-2xl border border-gray-200 flex flex-col overflow-hidden">

      {/* Header */}
      <div className="bg-orange-500 text-white px-4 py-3 font-semibold">
        Asistente TechStore
      </div>

      {/* Messages */}
      <div className="flex-1 h-72 overflow-y-auto p-3 space-y-2 bg-gray-50">

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-lg text-sm max-w-[75%] ${
                msg.role === "user"
                  ? "bg-orange-500 text-white"
                  : "bg-white border text-gray-700"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <p className="text-xs text-gray-400">La IA está escribiendo...</p>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-3 flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400 text-black"
          placeholder="Pregúntame sobre celulares..."
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 rounded-lg text-sm"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}