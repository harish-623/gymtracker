export type WorkoutDay = `Day ${number}`;

export type AppView =
  | "home"
  | "workout"
  | "exercises"
  | "bmi"
  | "bodyFat"
  | "aiSupport";

export interface UserProfile {
  name: string;
  initials: string;
  focus: string;
}

export interface WorkoutSet {
  reps: number;
  weight: number;
}

export interface Exercise {
  id: number;
  name: string;
  category: string;
  sets: WorkoutSet[];
}

export interface NewExerciseInput {
  name: string;
  reps: number;
  weight: number;
}

export interface StatCard {
  label: string;
  value: string;
}

export type WeeklyWorkoutPlan = Record<WorkoutDay, Exercise[]>;

export interface WeeklyProgress {
  week: string;
  workouts: number;
  calories: number;
  steps: number;
}

export interface DailyGoal {
  label: string;
  current: number;
  target: number;
  unit: string;
}

export interface ExerciseGuide {
  id: number;
  name: string;
  target: string;
  image: string;
  tip: string;
}

export type StepLog = Record<WorkoutDay, number>;

export interface DailyWorkoutSummary {
  day: WorkoutDay;
  exerciseCount: number;
  totalReps: number;
  totalWeight: number;
  caloriesBurned: number;
  steps: number;
}

export type ChatMessageRole = "user" | "bot";

export interface ChatMessage {
  id: number;
  role: ChatMessageRole;
  text: string;
  createdAt: string;
}
