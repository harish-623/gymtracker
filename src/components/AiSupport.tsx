import { type FormEvent, useState } from "react";
import type { ChatMessage } from "../types";
import { ChatMessageBody } from "./HomePage";

interface AiSupportProps {
  chatMessages: ChatMessage[];
  isChatSending: boolean;
  onSendChatMessage: (message: string) => Promise<void>;
}

export default function AiSupport({
  chatMessages,
  isChatSending,
  onSendChatMessage,
}: AiSupportProps) {
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await onSendChatMessage(message);
    setMessage("");
  }

  return (
    <section className="ai-support-page">
      <div className="ai-support-header">
        <div>
          <span className="section-label">Assistant</span>
          <h1>AI Support</h1>
          <p>
            Ask workout questions, get exercise plans, and review your saved gym
            progress from one dedicated chat view.
          </p>
        </div>
      </div>

      <section className="ai-support-panel" aria-label="AI support chat">
        <div className="ai-support-messages">
          {chatMessages.map((chatMessage) => (
            <article
              className={`chat-message ${chatMessage.role}`}
              key={chatMessage.id}
            >
              <span>{chatMessage.role === "bot" ? "Gym Bot" : "You"}</span>
              <ChatMessageBody text={chatMessage.text} />
            </article>
          ))}
        </div>

        <form className="ai-support-form" onSubmit={handleSubmit}>
          <label>
            <span>Ask AI Support</span>
            <input
              disabled={isChatSending}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Example: Give me a Monday chest and triceps workout"
              type="text"
              value={message}
            />
          </label>
          <button className="primary-btn" disabled={isChatSending} type="submit">
            {isChatSending ? "Sending" : "Send"}
          </button>
        </form>
      </section>
    </section>
  );
}
