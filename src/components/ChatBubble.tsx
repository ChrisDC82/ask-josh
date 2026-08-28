interface ChatBubbleProps {
  message: string;
  sender: "user" | "josh";
}

export default function ChatBubble({ message, sender }: ChatBubbleProps) {
  return (
    <div
      className={`flex ${
        sender === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 sm:max-w-[70%] ${
          sender === "user"
            ? "bg-blue-700 text-white"
            : "bg-slate-100 text-slate-900"
        }`}
      >
        <p className="text-sm sm:text-base">{message}</p>
      </div>
    </div>
  );
}







