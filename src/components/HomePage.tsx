import { type FormEvent, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChatMessage, DailyWorkoutSummary, WorkoutDay } from "../types";

type ChatBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; rows: string[][] };

interface HomePageProps {
  days: WorkoutDay[];
  selectedDay: WorkoutDay;
  summaries: DailyWorkoutSummary[];
  chatMessages: ChatMessage[];
  isChatSending: boolean;
  onSaveSteps: (day: WorkoutDay, steps: number) => void;
  onSendChatMessage: (message: string) => Promise<void>;
}

export default function HomePage({
  days,
  selectedDay,
  summaries,
  chatMessages,
  isChatSending,
  onSaveSteps,
  onSendChatMessage,
}: HomePageProps) {
  const [stepsDay, setStepsDay] = useState<WorkoutDay>(selectedDay);
  const [steps, setSteps] = useState("");
  const [chatText, setChatText] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(true);
  const selectedSummary =
    summaries.find((summary) => summary.day === stepsDay) ?? summaries[0];
  const totals = useMemo(
    () =>
      summaries.reduce(
        (total, summary) => ({
          reps: total.reps + summary.totalReps,
          weight: total.weight + summary.totalWeight,
          calories: total.calories + summary.caloriesBurned,
          steps: total.steps + summary.steps,
        }),
        { reps: 0, weight: 0, calories: 0, steps: 0 }
      ),
    [summaries]
  );
  const chartData = summaries.map((summary) => ({
    day: summary.day,
    reps: summary.totalReps,
    weight: Math.round(summary.totalWeight / 100),
    calories: summary.caloriesBurned,
    steps: Math.round(summary.steps / 1000),
  }));
  const dayOne = summaries[0];
  const dayTwo = summaries[1];

  function handleStepSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedSteps = Number.parseInt(steps, 10);

    if (!Number.isFinite(parsedSteps) || parsedSteps < 0) {
      return;
    }

    onSaveSteps(stepsDay, parsedSteps);
    setSteps("");
  }

  async function handleChatSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await onSendChatMessage(chatText);
    setChatText("");
  }

  return (
    <div className="home-page">
      <section className="home-hero">
        <div>
          <span className="section-label">Home</span>
          <h1>GYM Progress</h1>
          <p>
            Calories, reps, weight volume, and steps are calculated from your
            saved workout JSON.
          </p>
        </div>
      </section>

      <section className="goal-grid" aria-label="Calculated workout totals">
        <article className="goal-card">
          <span>Total Weight Volume</span>
          <h2>{totals.weight.toLocaleString()} kg</h2>
          <p>Reps x weight from all saved sets</p>
        </article>
        <article className="goal-card">
          <span>Total Reps</span>
          <h2>{totals.reps.toLocaleString()}</h2>
          <p>All saved workout reps</p>
        </article>
        <article className="goal-card">
          <span>Calories Burned</span>
          <h2>{totals.calories.toLocaleString()} kcal</h2>
          <p>Estimated from weight volume and reps</p>
        </article>
        <article className="goal-card">
          <span>Total Steps</span>
          <h2>{totals.steps.toLocaleString()}</h2>
          <p>Manual steps saved in browser JSON</p>
        </article>
      </section>

      <form className="steps-form" onSubmit={handleStepSubmit}>
        <label>
          <span>Day</span>
          <select
            onChange={(event) => setStepsDay(event.target.value as WorkoutDay)}
            value={stepsDay}
          >
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Steps</span>
          <input
            inputMode="numeric"
            onChange={(event) => setSteps(event.target.value)}
            placeholder={String(selectedSummary.steps || 10000)}
            type="text"
            value={steps}
          />
        </label>

        <button className="primary-btn" type="submit">
          Save Steps
        </button>
      </form>

      <section className="chart-panel">
        <div className="section-heading">
          <div>
            <span className="section-label">Daily JSON Chart</span>
            <h2>Exercise weight, reps, calories, and steps</h2>
          </div>
        </div>

        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={chartData}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="day" stroke="#a8b3c2" />
              <YAxis stroke="#a8b3c2" />
              <Tooltip
                contentStyle={{
                  background: "#181b20",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 8,
                  color: "#f8fafc",
                }}
              />
              <Legend />
              <Bar dataKey="reps" fill="#34d399" name="Reps" />
              <Bar dataKey="weight" fill="#f59e0b" name="Weight / 100" />
              <Bar dataKey="calories" fill="#ef4444" name="Calories" />
              <Bar dataKey="steps" fill="#60a5fa" name="Steps / 1000" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <aside
        className={`chat-widget ${isChatOpen ? "open" : ""}`}
        aria-label="Gym bot chat"
      >
        <button
          className="chat-widget-toggle"
          onClick={() => setIsChatOpen((isOpen) => !isOpen)}
          type="button"
        >
          {isChatOpen ? "Hide Chat" : "AC Gym Bot"}
        </button>

        {isChatOpen && (
          <div className="chat-panel">
            <div className="chat-widget-header">
              <div>
                <span className="section-label">AC Chat Gym Bot</span>
                <h2>Ask about your saved progress</h2>
              </div>
            </div>

            <div className="chat-messages">
              {chatMessages.map((message) => (
                <article
                  className={`chat-message ${message.role}`}
                  key={message.id}
                >
                  <span>{message.role === "bot" ? "Gym Bot" : "You"}</span>
                  <ChatMessageBody text={message.text} />
                </article>
              ))}
            </div>

            <form className="chat-form" onSubmit={handleChatSubmit}>
              <label>
                <span>Message</span>
                <input
                  disabled={isChatSending}
                  onChange={(event) => setChatText(event.target.value)}
                  placeholder="Ask about steps, calories, reps, or next workout"
                  type="text"
                  value={chatText}
                />
              </label>
              <button className="primary-btn" disabled={isChatSending} type="submit">
                {isChatSending ? "Sending" : "Send"}
              </button>
            </form>
          </div>
        )}
      </aside>

      <section className="comparison-grid" aria-label="Day comparison">
        <article>
          <span>Day 1</span>
          <h3>
            {dayOne.totalWeight.toLocaleString()} kg,{" "}
            {dayOne.caloriesBurned.toLocaleString()} kcal,{" "}
            {dayOne.steps.toLocaleString()} steps
          </h3>
        </article>
        <article>
          <span>Day 2</span>
          <h3>
            {dayTwo.totalWeight.toLocaleString()} kg,{" "}
            {dayTwo.caloriesBurned.toLocaleString()} kcal,{" "}
            {dayTwo.steps.toLocaleString()} steps
          </h3>
        </article>
        <article>
          <span>Day 2 compared with Day 1</span>
          <h3>
            {(dayTwo.totalWeight - dayOne.totalWeight).toLocaleString()} kg,{" "}
            {(dayTwo.caloriesBurned - dayOne.caloriesBurned).toLocaleString()}{" "}
            kcal, {(dayTwo.steps - dayOne.steps).toLocaleString()} steps
          </h3>
        </article>
      </section>
    </div>
  );
}

export function ChatMessageBody({ text }: { text: string }) {
  const blocks = parseChatText(text);

  return (
    <div className="chat-message-body">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          return (
            <h3 key={`${block.type}-${index}`}>
              {renderInlineMarkdown(block.text)}
            </h3>
          );
        }

        if (block.type === "list") {
          return (
            <ul key={`${block.type}-${index}`}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderInlineMarkdown(item)}</li>
              ))}
            </ul>
          );
        }

        if (block.type === "table") {
          const [headerRow, ...bodyRows] = block.rows;

          return (
            <div className="chat-table-wrap" key={`${block.type}-${index}`}>
              <table>
                <thead>
                  <tr>
                    {headerRow.map((cell, cellIndex) => (
                      <th key={cellIndex}>{renderInlineMarkdown(cell)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bodyRows
                    .filter((row) => !isDividerRow(row))
                    .map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex}>{renderInlineMarkdown(cell)}</td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          );
        }

        return (
          <p className="chat-point" key={`${block.type}-${index}`}>
            {cleanInlineMarkdown(block.text)}
          </p>
        );
      })}
    </div>
  );
}

function parseChatText(text: string): ChatBlock[] {
  const preparedText = cleanInlineMarkdown(text)
    .replace(/\s+(#{1,3}\s)/g, "\n$1")
    .replace(/\s+(\|\s*[^|]+\s*\|)/g, "\n$1")
    .replace(/\s+(\*\s+)/g, "\n$1");
  const lines = preparedText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const blocks: ChatBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (line.startsWith("|")) {
      const tableRows: string[][] = [];

      while (index < lines.length && lines[index].startsWith("|")) {
        tableRows.push(parseTableRow(lines[index]));
        index += 1;
      }

      blocks.push({ type: "table", rows: tableRows });
      continue;
    }

    if (line.startsWith("* ")) {
      const items: string[] = [];

      while (index < lines.length && lines[index].startsWith("* ")) {
        items.push(lines[index].replace(/^\*\s+/, ""));
        index += 1;
      }

      blocks.push({ type: "list", items });
      continue;
    }

    if (line.startsWith("#")) {
      blocks.push({
        type: "heading",
        text: line.replace(/^#{1,3}\s*/, ""),
      });
      index += 1;
      continue;
    }

    blocks.push({
      type: "paragraph",
      text: line,
    });
    index += 1;
  }

  return blocks;
}

function parseTableRow(line: string) {
  return line
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isDividerRow(row: string[]) {
  return row.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function renderInlineMarkdown(text: string) {
  return cleanInlineMarkdown(text);
}

function cleanInlineMarkdown(text: string) {
  return text.replace(/\*\*/g, "").trim();
}
