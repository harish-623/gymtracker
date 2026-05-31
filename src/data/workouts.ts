import type {
  DailyGoal,
  ExerciseGuide,
  StatCard,
  UserProfile,
  WeeklyProgress,
  WeeklyWorkoutPlan,
  WorkoutDay,
} from "../types";

export const DAYS = Array.from(
  { length: 21 },
  (_, index) => `Day ${index + 1}` as WorkoutDay
);

export const USER_PROFILE: UserProfile = {
  name: "Harish",
  initials: "H",
  focus: "Strength Training",
};

export const WEEKLY_WORKOUTS: WeeklyWorkoutPlan = {
  "Day 1": [
    {
      id: 1,
      name: "Bench Press",
      category: "Chest",
      sets: [
        { reps: 10, weight: 40 },
        { reps: 8, weight: 45 },
      ],
    },
    {
      id: 2,
      name: "Shoulder Press",
      category: "Shoulders",
      sets: [
        { reps: 12, weight: 20 },
        { reps: 10, weight: 25 },
      ],
    },
  ],
  "Day 2": [
    {
      id: 3,
      name: "Deadlift",
      category: "Back",
      sets: [
        { reps: 8, weight: 70 },
        { reps: 6, weight: 80 },
      ],
    },
    {
      id: 4,
      name: "Lat Pulldown",
      category: "Back",
      sets: [
        { reps: 12, weight: 35 },
        { reps: 10, weight: 40 },
      ],
    },
  ],
  "Day 3": [
    {
      id: 5,
      name: "Squat",
      category: "Legs",
      sets: [
        { reps: 10, weight: 55 },
        { reps: 8, weight: 65 },
      ],
    },
  ],
  "Day 4": [
    {
      id: 6,
      name: "Incline Dumbbell Press",
      category: "Chest",
      sets: [
        { reps: 12, weight: 22 },
        { reps: 10, weight: 24 },
      ],
    },
  ],
  "Day 5": [
    {
      id: 7,
      name: "Barbell Curl",
      category: "Arms",
      sets: [
        { reps: 12, weight: 20 },
        { reps: 10, weight: 25 },
      ],
    },
  ],
  "Day 6": [
    {
      id: 8,
      name: "Plank",
      category: "Core",
      sets: [
        { reps: 1, weight: 60 },
        { reps: 1, weight: 75 },
      ],
    },
  ],
  "Day 7": [],
  "Day 8": [],
  "Day 9": [],
  "Day 10": [],
  "Day 11": [],
  "Day 12": [],
  "Day 13": [],
  "Day 14": [],
  "Day 15": [],
  "Day 16": [],
  "Day 17": [],
  "Day 18": [],
  "Day 19": [],
  "Day 20": [],
  "Day 21": [],
};

export const DASHBOARD_STATS: StatCard[] = [
  { label: "Total Exercises", value: "12" },
  { label: "Total Volume", value: "4,850 kg" },
  { label: "Workout Time", value: "01:24:12" },
  { label: "Weekly Streak", value: "6 Days" },
];

export const WEEKLY_PROGRESS: WeeklyProgress[] = [
  { week: "Week 1", workouts: 4, calories: 1850, steps: 52000 },
  { week: "Week 2", workouts: 5, calories: 2250, steps: 63000 },
  { week: "Week 3", workouts: 6, calories: 2720, steps: 71000 },
];

export const DAILY_GOALS: DailyGoal[] = [
  { label: "Calories Burned", current: 620, target: 750, unit: "kcal" },
  { label: "Steps", current: 7800, target: 10000, unit: "steps" },
];

export const EXERCISE_GUIDE: ExerciseGuide[] = [
  {
    id: 1,
    name: "Bench Press",
    target: "Chest, triceps, shoulders",
    image:
      "https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?auto=format&fit=crop&w=900&q=80",
    tip: "Keep your feet planted and lower the bar with control.",
  },
  {
    id: 2,
    name: "Deadlift",
    target: "Back, glutes, hamstrings",
    image:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=80",
    tip: "Brace your core before lifting and keep the bar close to your legs.",
  },
  {
    id: 3,
    name: "Squat",
    target: "Quads, glutes, core",
    image:
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=900&q=80",
    tip: "Push your knees out slightly and keep your chest tall.",
  },
  {
    id: 4,
    name: "Shoulder Press",
    target: "Shoulders, triceps",
    image:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=80",
    tip: "Press straight overhead and avoid leaning back too much.",
  },
  {
    id: 5,
    name: "Lat Pulldown",
    target: "Lats, upper back, biceps",
    image:
      "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=900&q=80",
    tip: "Pull your elbows down toward your ribs, not behind your body.",
  },
  {
    id: 6,
    name: "Barbell Curl",
    target: "Biceps, forearms",
    image:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=80",
    tip: "Keep your elbows near your sides and avoid swinging the weight.",
  },
  {
    id: 7,
    name: "Barbell Bent-Over Row",
    target: "Upper back, lats, rear shoulders",
    image:
      "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=900&q=80",
    tip: "Hinge at your hips, keep your back flat, and row the bar toward your lower ribs.",
  },
  {
    id: 8,
    name: "Smith Machine Chest Press",
    target: "Chest, triceps, front shoulders",
    image:
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?auto=format&fit=crop&w=900&q=80",
    tip: "Set the bench evenly under the bar and lower with control before pressing up.",
  },
  {
    id: 9,
    name: "Lat Pulldown Machine",
    target: "Lats, upper back, biceps",
    image:
      "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=900&q=80",
    tip: "Keep your chest lifted and pull the handle toward your upper chest.",
  },
  {
    id: 10,
    name: "Abs Crunches",
    target: "Abs, core",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=80",
    tip: "Curl your ribs toward your hips and avoid pulling your neck forward.",
  },
  {
    id: 11,
    name: "Pec Fly",
    target: "Chest, front shoulders",
    image:
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=900&q=80",
    tip: "Keep a soft bend in your elbows and squeeze your chest at the center.",
  },
  {
    id: 12,
    name: "Inner Chest Pec Fly",
    target: "Inner chest, pecs",
    image:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=80",
    tip: "Bring the handles together slowly and pause for a strong chest squeeze.",
  },
  {
    id: 13,
    name: "Triceps Pushdown",
    target: "Triceps",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80",
    tip: "Pin your elbows near your sides and press the rope or bar down fully.",
  },
];
