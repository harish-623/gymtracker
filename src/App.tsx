import { useEffect, useMemo, useState } from "react";
import "./App.css";
import AiSupport from "./components/AiSupport";
import BmiCalculator from "./components/BmiCalculator";
import BodyFatCalculator from "./components/BodyFatCalculator";
import DashboardHeader from "./components/DashboardHeader";
import ExerciseLibrary from "./components/ExerciseLibrary";
import HomePage from "./components/HomePage";
import Sidebar from "./components/Sidebar";
import StatsGrid from "./components/StatsGrid";
import WorkoutSection from "./components/WorkoutSection";
import {
  DAYS,
  EXERCISE_GUIDE,
  USER_PROFILE,
  WEEKLY_WORKOUTS,
} from "./data/workouts";
import type {
  AppView,
  ChatMessage,
  DailyWorkoutSummary,
  NewExerciseInput,
  StepLog,
  WeeklyWorkoutPlan,
  WorkoutDay,
  WorkoutSet,
} from "./types";

const STORAGE_KEY = "gym-tracker-workouts";
const STEPS_STORAGE_KEY = "gym-tracker-steps";
const CHAT_STORAGE_KEY = "gym-tracker-chat";
const CHAT_API_URL =
  import.meta.env.VITE_CHAT_API_URL ?? "http://127.0.0.1:5000/gymchat";

function loadWorkoutPlan(): WeeklyWorkoutPlan {
  const savedPlan = localStorage.getItem(STORAGE_KEY);

  if (!savedPlan) {
    return WEEKLY_WORKOUTS;
  }

  try {
    const parsedPlan = JSON.parse(savedPlan) as Partial<WeeklyWorkoutPlan>;

    return DAYS.reduce<WeeklyWorkoutPlan>(
      (plan, day) => ({
        ...plan,
        [day]: parsedPlan[day] ?? WEEKLY_WORKOUTS[day] ?? [],
      }),
      {} as WeeklyWorkoutPlan
    );
  } catch {
    return WEEKLY_WORKOUTS;
  }
}

function loadStepLog(): StepLog {
  const savedSteps = localStorage.getItem(STEPS_STORAGE_KEY);

  if (!savedSteps) {
    return DAYS.reduce<StepLog>(
      (steps, day) => ({ ...steps, [day]: 0 }),
      {} as StepLog
    );
  }

  try {
    const parsedSteps = JSON.parse(savedSteps) as Partial<StepLog>;

    return DAYS.reduce<StepLog>(
      (steps, day) => ({ ...steps, [day]: parsedSteps[day] ?? 0 }),
      {} as StepLog
    );
  } catch {
    return DAYS.reduce<StepLog>(
      (steps, day) => ({ ...steps, [day]: 0 }),
      {} as StepLog
    );
  }
}

function loadChatMessages(): ChatMessage[] {
  const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY);

  if (!savedMessages) {
    return [
      {
        id: 1,
        role: "bot",
        text: "Hi, I am your gym bot. Ask me about your workouts, steps, calories, or what to train next.",
        createdAt: new Date().toISOString(),
      },
    ];
  }

  try {
    const parsedMessages = JSON.parse(savedMessages) as ChatMessage[];

    if (!Array.isArray(parsedMessages)) {
      return [];
    }

    return parsedMessages.filter(
      (message) =>
        typeof message.id === "number" &&
        (message.role === "user" || message.role === "bot") &&
        typeof message.text === "string" &&
        typeof message.createdAt === "string"
    );
  } catch {
    return [];
  }
}

function calculateCalories(totalWeight: number, totalReps: number) {
  return Math.round(totalWeight * 0.05 + totalReps * 0.25);
}

function App() {
  const [currentView, setCurrentView] = useState<AppView>("home");
  const [selectedDay, setSelectedDay] = useState<WorkoutDay>("Day 1");
  const [workoutPlan, setWorkoutPlan] = useState<WeeklyWorkoutPlan>(loadWorkoutPlan);
  const [stepLog, setStepLog] = useState<StepLog>(loadStepLog);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(loadChatMessages);
  const [isChatSending, setIsChatSending] = useState(false);
  const exercises = workoutPlan[selectedDay];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workoutPlan));
  }, [workoutPlan]);

  useEffect(() => {
    localStorage.setItem(STEPS_STORAGE_KEY, JSON.stringify(stepLog));
  }, [stepLog]);

  useEffect(() => {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatMessages));
  }, [chatMessages]);

  const dashboardStats = useMemo(() => {
    const allExercises = Object.values(workoutPlan).flat();
    const totalVolume = allExercises.reduce((exerciseTotal, exercise) => {
      const setVolume = exercise.sets.reduce(
        (setTotal, set) => setTotal + set.reps * set.weight,
        0
      );

      return exerciseTotal + setVolume;
    }, 0);
    const activeDays = Object.values(workoutPlan).filter(
      (dayExercises) => dayExercises.length > 0
    ).length;

    return [
      { label: "Total Exercises", value: String(allExercises.length) },
      { label: "Total Volume", value: `${totalVolume.toLocaleString()} kg` },
      { label: "Workout Time", value: "01:24:12" },
      { label: "Weekly Streak", value: `${activeDays} Days` },
    ];
  }, [workoutPlan]);

  const dailySummaries = useMemo<DailyWorkoutSummary[]>(() => {
    return DAYS.map((day) => {
      const dayExercises = workoutPlan[day] ?? [];
      const totals = dayExercises.reduce(
        (dayTotal, exercise) => {
          const exerciseTotals = exercise.sets.reduce(
            (setTotal, set) => ({
              reps: setTotal.reps + set.reps,
              weight: setTotal.weight + set.reps * set.weight,
            }),
            { reps: 0, weight: 0 }
          );

          return {
            reps: dayTotal.reps + exerciseTotals.reps,
            weight: dayTotal.weight + exerciseTotals.weight,
          };
        },
        { reps: 0, weight: 0 }
      );

      return {
        day,
        exerciseCount: dayExercises.length,
        totalReps: totals.reps,
        totalWeight: totals.weight,
        caloriesBurned: calculateCalories(totals.weight, totals.reps),
        steps: stepLog[day] ?? 0,
      };
    });
  }, [stepLog, workoutPlan]);

  function handleAddExercise(newExercise: NewExerciseInput) {
    setWorkoutPlan((currentPlan) => ({
      ...currentPlan,
      [selectedDay]: [
        ...currentPlan[selectedDay],
        {
          id: Date.now(),
          name: newExercise.name,
          category: "Custom",
          sets: [{ reps: newExercise.reps, weight: newExercise.weight }],
        },
      ],
    }));
  }

  function handleRemoveExercise(exerciseId: number) {
    setWorkoutPlan((currentPlan) => ({
      ...currentPlan,
      [selectedDay]: currentPlan[selectedDay].filter(
        (exercise) => exercise.id !== exerciseId
      ),
    }));
  }

  function handleAddSet(exerciseId: number, newSet: WorkoutSet) {
    setWorkoutPlan((currentPlan) => ({
      ...currentPlan,
      [selectedDay]: currentPlan[selectedDay].map((exercise) =>
        exercise.id === exerciseId
          ? { ...exercise, sets: [...exercise.sets, newSet] }
          : exercise
      ),
    }));
  }

  function handleSaveSteps(day: WorkoutDay, steps: number) {
    setStepLog((currentSteps) => ({
      ...currentSteps,
      [day]: steps,
    }));
  }

  async function handleSendChatMessage(text: string) {
    const now = Date.now();
    const trimmedText = text.trim();

    if (!trimmedText) {
      return;
    }

    setChatMessages((currentMessages) => [
      ...currentMessages,
      {
        id: now,
        role: "user",
        text: trimmedText,
        createdAt: new Date(now).toISOString(),
      },
    ]);

    setIsChatSending(true);

    try {
      const response = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmedText,
          summaries: dailySummaries,
          workouts: workoutPlan,
          steps: stepLog,
        }),
      });

      if (!response.ok) {
        throw new Error("Chat backend request failed");
      }

      const data = (await response.json()) as {
        reply?: string;
        response?: string;
        message?: string;
      };
      const botReply =
        data.reply ??
        data.response ??
        data.message ??
        "I received your question, but the backend did not return a reply.";

      setChatMessages((currentMessages) => [
        ...currentMessages,
        {
          id: Date.now(),
          role: "bot",
          text: botReply,
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch {
      setChatMessages((currentMessages) => [
        ...currentMessages,
        {
          id: Date.now(),
          role: "bot",
          text: "I could not reach the chat backend. Please check VITE_CHAT_API_URL and make sure your backend is running.",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsChatSending(false);
    }
  }

  const browserJson = {
    workouts: workoutPlan,
    steps: stepLog,
  };

  return (
    <div className="app">
      <Sidebar
        days={DAYS}
        profile={USER_PROFILE}
        currentView={currentView}
        selectedDay={selectedDay}
        onSelectView={setCurrentView}
        onSelectDay={setSelectedDay}
      />

      <main className="dashboard">
        {currentView === "home" ? (
          <HomePage
            days={DAYS}
            selectedDay={selectedDay}
            summaries={dailySummaries}
            chatMessages={chatMessages}
            isChatSending={isChatSending}
            onSaveSteps={handleSaveSteps}
            onSendChatMessage={handleSendChatMessage}
          />
        ) : currentView === "exercises" ? (
          <ExerciseLibrary exercises={EXERCISE_GUIDE} savedJson={browserJson} />
        ) : currentView === "bmi" ? (
          <BmiCalculator />
        ) : currentView === "bodyFat" ? (
          <BodyFatCalculator />
        ) : currentView === "aiSupport" ? (
          <AiSupport
            chatMessages={chatMessages}
            isChatSending={isChatSending}
            onSendChatMessage={handleSendChatMessage}
          />
        ) : (
          <>
            <DashboardHeader />
            <StatsGrid stats={dashboardStats} />
            <WorkoutSection
              exercises={exercises}
              selectedDay={selectedDay}
              onAddExercise={handleAddExercise}
              onAddSet={handleAddSet}
              onRemoveExercise={handleRemoveExercise}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
