import { useState } from "react";
import { X, Send, Bot } from "lucide-react";
import { clsx } from "clsx";

interface Message {
  role: "assistant" | "user";
  text: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    role: "assistant",
    text: "Hi! I'm the Omnis Solutio assistant. How can I help you today?",
  },
];

export default function AIChatButton() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");

    // Placeholder reply — replace with real AI call
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Thanks for reaching out! Our team will be in touch shortly. For immediate assistance, please email hello@omnissolutio.com.",
        },
      ]);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <>
      {/* Chat window */}
      {open && (
        <div
          className={clsx(
            "fixed z-50 flex flex-col",
            "bottom-18 right-6",
            "h-105 w-85 max-w-[calc(100vw-2rem)]",
            "rounded-2xl border border-(--color-stroke-soft-200)",
            "bg-(--color-bg-white-0) shadow-[0_8px_32px_rgba(0,0,0,0.16)]",
            "animate-in slide-in-from-bottom-4 duration-300 overflow-hidden",
          )}
        >
          {/* Header */}
          <div
            className={clsx(
              "flex items-center justify-between gap-2 px-4 py-3",
              "border-b border-(--color-stroke-soft-200) bg-(--color-primary-base)",
            )}
          >
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <Bot size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Omnis Assistant
                </p>
                <p className="text-[11px] text-white/70 leading-none">Online</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 text-white/70 transition-colors hover:text-white"
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={clsx(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={clsx(
                    "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-(--color-primary-base) text-white rounded-br-sm"
                      : "bg-(--color-bg-weak-50) text-(--color-text-strong-950) rounded-bl-sm border border-(--color-stroke-soft-200)",
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-(--color-stroke-soft-200) px-3 py-3 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message…"
              className={clsx(
                "flex-1 rounded-xl border border-(--color-stroke-soft-200) bg-(--color-bg-weak-50)",
                "px-3 py-2 text-sm text-(--color-text-strong-950) outline-none",
                "placeholder:text-(--color-text-soft-400)",
                "focus:border-(--color-primary-base) focus:bg-(--color-bg-white-0)",
                "transition-colors",
              )}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className={clsx(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                "bg-(--color-primary-base) text-white transition-opacity",
                "hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed",
              )}
              aria-label="Send message"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open AI chat"
        className={clsx(
          "fixed bottom-6 right-6 z-50",
          "flex h-12 w-12 items-center justify-center rounded-xl",
          "bg-(--color-primary-base) text-white",
          "shadow-[0_4px_20px_rgba(0,0,0,0.20)] transition-all duration-200",
          "hover:opacity-90 hover:shadow-[0_6px_24px_rgba(0,0,0,0.24)] hover:scale-105",
        )}
      >
        {open ? <X size={20} /> : <Bot size={20} />}
      </button>
    </>
  );
}
