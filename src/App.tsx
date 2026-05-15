import { useEffect, useMemo, useState } from 'react';
import './App.css';

type DayName =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

interface ExerciseSet {
  id: string;
  reps: number;
  weight: number;
}

interface Exercise {
  id: string;
  name: string;
  sets: ExerciseSet[];
}

interface DayWorkout {
  durationSeconds: number;
  exercises: Exercise[];
}

interface WeekPlan {
  id: string;
  label: string;
  days: Record<DayName, DayWorkout>;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  goal: string;
  password: string;
  weeks: WeekPlan[];
}

interface LoginForm {
  email: string;
  password: string;
}

interface ExerciseForm {
  name: string;
  reps: number;
  weight: number;
}

type LegacySet = ExerciseSet & { count?: number; kg?: number };
type LegacyUser = Partial<UserProfile> & {
  workouts?: Record<DayName, Exercise[]>;
  weeks?: WeekPlan[];
};

const STORAGE_KEY = 'gym-tracker-users-json';
const SESSION_KEY = 'gym-tracker-current-user';
const DAYS: DayName[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];
const WEEKS = [
  { id: 'week-1', label: 'Week 1' },
  { id: 'week-2', label: 'Week 2' },
  { id: 'week-3', label: 'Week 3' },
];

const emptyDay = (): DayWorkout => ({
  durationSeconds: 0,
  exercises: [],
});

const emptyDays = (): Record<DayName, DayWorkout> => ({
  Monday: emptyDay(),
  Tuesday: emptyDay(),
  Wednesday: emptyDay(),
  Thursday: emptyDay(),
  Friday: emptyDay(),
  Saturday: emptyDay(),
  Sunday: emptyDay(),
});

const emptyWeeks = (): WeekPlan[] =>
  WEEKS.map((week) => ({
    ...week,
    days: emptyDays(),
  }));

const seedUsers: UserProfile[] = [
  {
    id: 'user-1',
    name: 'Harish',
    email: 'harish@gym.com',
    age: 24,
    goal: 'Build strength and track progressive overload',
    password: '123456',
    weeks: [
      {
        id: 'week-1',
        label: 'Week 1',
        days: {
          ...emptyDays(),
          Monday: {
            durationSeconds: 45 * 60,
            exercises: [
              {
                id: 'ex-1',
                name: 'Bench Press',
                sets: [
                  { id: 'set-1', reps: 10, weight: 40 },
                  { id: 'set-2', reps: 8, weight: 45 },
                  { id: 'set-3', reps: 6, weight: 50 },
                ],
              },
              {
                id: 'ex-2',
                name: 'Incline Dumbbell Press',
                sets: [
                  { id: 'set-4', reps: 12, weight: 18 },
                  { id: 'set-5', reps: 10, weight: 20 },
                ],
              },
            ],
          },
        },
      },
      ...emptyWeeks().slice(1),
    ],
  },
  {
    id: 'user-2',
    name: 'Demo User',
    email: 'demo@gym.com',
    age: 28,
    goal: 'Stay consistent with weekly training',
    password: 'demo123',
    weeks: [
      {
        id: 'week-1',
        label: 'Week 1',
        days: {
          ...emptyDays(),
          Monday: {
            durationSeconds: 30 * 60,
            exercises: [
              {
                id: 'ex-3',
                name: 'Squat',
                sets: [
                  { id: 'set-6', reps: 8, weight: 60 },
                  { id: 'set-7', reps: 8, weight: 65 },
                ],
              },
            ],
          },
        },
      },
      ...emptyWeeks().slice(1),
    ],
  },
];

const createId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const normalizeSet = (set: LegacySet): ExerciseSet => ({
  id: set.id || createId('set'),
  reps: set.reps ?? set.count ?? 0,
  weight: set.weight ?? set.kg ?? 0,
});

const normalizeExercises = (exercises: Exercise[] = []) =>
  exercises.map((exercise) => ({
    ...exercise,
    id: exercise.id || createId('exercise'),
    sets: exercise.sets.map((set) => normalizeSet(set as LegacySet)),
  }));

const normalizeDay = (day?: Partial<DayWorkout>): DayWorkout => ({
  durationSeconds: day?.durationSeconds ?? 0,
  exercises: normalizeExercises(day?.exercises),
});

const normalizeWeeks = (user: LegacyUser): WeekPlan[] => {
  if (user.weeks?.length) {
    return WEEKS.map((week, index) => {
      const savedWeek = user.weeks?.[index];

      return {
        id: week.id,
        label: week.label,
        days: DAYS.reduce((days, day) => {
          days[day] = normalizeDay(savedWeek?.days?.[day]);
          return days;
        }, emptyDays()),
      };
    });
  }

  return WEEKS.map((week, index) => ({
    id: week.id,
    label: week.label,
    days: DAYS.reduce((days, day) => {
      days[day] =
        index === 0
          ? {
              durationSeconds: 0,
              exercises: normalizeExercises(user.workouts?.[day]),
            }
          : emptyDay();
      return days;
    }, emptyDays()),
  }));
};

const normalizeUsers = (savedUsers: LegacyUser[]): UserProfile[] =>
  savedUsers.map((user) => ({
    id: user.id || createId('user'),
    name: user.name || 'Gym User',
    email: user.email || '',
    age: user.age || 0,
    goal: user.goal || 'Track workouts',
    password: user.password || '',
    weeks: normalizeWeeks(user),
  }));

const getStoredUsers = () => {
  const savedUsers = localStorage.getItem(STORAGE_KEY);

  if (!savedUsers) {
    return seedUsers;
  }

  try {
    return normalizeUsers(JSON.parse(savedUsers) as LegacyUser[]);
  } catch {
    return seedUsers;
  }
};

const formatDuration = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((item) => item.toString().padStart(2, '0'))
    .join(':');
};

function App() {
  const [users, setUsers] = useState<UserProfile[]>(getStoredUsers);
  const [currentUserId, setCurrentUserId] = useState(
    () => localStorage.getItem(SESSION_KEY) || ''
  );
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: 'harish@gym.com',
    password: '123456',
  });
  const [loginError, setLoginError] = useState('');
  const [selectedWeekId, setSelectedWeekId] = useState('week-1');
  const [selectedDay, setSelectedDay] = useState<DayName>('Monday');
  const [runningTimer, setRunningTimer] = useState(false);
  const [exerciseForm, setExerciseForm] = useState<ExerciseForm>({
    name: '',
    reps: 10,
    weight: 0,
  });

  const currentUser = useMemo(
    () => users.find((user) => user.id === currentUserId),
    [users, currentUserId]
  );

  const selectedWeek =
    currentUser?.weeks.find((week) => week.id === selectedWeekId) ||
    currentUser?.weeks[0];
  const selectedWorkout = selectedWeek?.days[selectedDay] || emptyDay();
  const selectedExercises = selectedWorkout.exercises;
  const totalSets = selectedExercises.reduce(
    (total, exercise) => total + exercise.sets.length,
    0
  );
  const totalWeight = selectedExercises.reduce(
    (total, exercise) =>
      total +
      exercise.sets.reduce(
        (exerciseTotal, set) => exerciseTotal + set.reps * set.weight,
        0
      ),
    0
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(SESSION_KEY, currentUserId);
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [currentUserId]);

  useEffect(() => {
    setRunningTimer(false);
  }, [selectedWeekId, selectedDay, currentUserId]);

  useEffect(() => {
    if (!runningTimer || !currentUser || !selectedWeek) {
      return;
    }

    const timerId = window.setInterval(() => {
      updateSelectedDay((day) => ({
        ...day,
        durationSeconds: day.durationSeconds + 1,
      }));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [runningTimer, currentUser, selectedWeek, selectedDay]);

  const updateSelectedDay = (updater: (day: DayWorkout) => DayWorkout) => {
    if (!currentUser || !selectedWeek) {
      return;
    }

    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === currentUser.id
          ? {
              ...user,
              weeks: user.weeks.map((week) =>
                week.id === selectedWeek.id
                  ? {
                      ...week,
                      days: {
                        ...week.days,
                        [selectedDay]: updater(week.days[selectedDay]),
                      },
                    }
                  : week
              ),
            }
          : user
      )
    );
  };

  const loginUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const user = users.find(
      (item) =>
        item.email.toLowerCase() === loginForm.email.trim().toLowerCase() &&
        item.password === loginForm.password
    );

    if (!user) {
      setLoginError('Email or password is wrong. Try the demo login shown below.');
      return;
    }

    setLoginError('');
    setCurrentUserId(user.id);
    setSelectedWeekId('week-1');
    setSelectedDay('Monday');
  };

  const logoutUser = () => {
    setCurrentUserId('');
    setLoginError('');
    setRunningTimer(false);
  };

  const addExercise = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentUser || !exerciseForm.name.trim()) {
      return;
    }

    const nextExercise: Exercise = {
      id: createId('exercise'),
      name: exerciseForm.name.trim(),
      sets: [
        {
          id: createId('set'),
          reps: exerciseForm.reps,
          weight: exerciseForm.weight,
        },
      ],
    };

    updateSelectedDay((day) => ({
      ...day,
      exercises: [nextExercise, ...day.exercises],
    }));

    setExerciseForm({ name: '', reps: 10, weight: 0 });
  };

  const addSet = (exerciseId: string) => {
    updateSelectedDay((day) => ({
      ...day,
      exercises: day.exercises.map((exercise) => {
        if (exercise.id !== exerciseId) {
          return exercise;
        }

        const previousSet = exercise.sets[exercise.sets.length - 1];

        return {
          ...exercise,
          sets: [
            ...exercise.sets,
            {
              id: createId('set'),
              reps: previousSet?.reps || 10,
              weight: previousSet?.weight || 0,
            },
          ],
        };
      }),
    }));
  };

  const updateSet = (
    exerciseId: string,
    setId: string,
    field: 'reps' | 'weight',
    value: number
  ) => {
    updateSelectedDay((day) => ({
      ...day,
      exercises: day.exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.id === setId ? { ...set, [field]: value } : set
              ),
            }
          : exercise
      ),
    }));
  };

  const removeExercise = (exerciseId: string) => {
    updateSelectedDay((day) => ({
      ...day,
      exercises: day.exercises.filter((exercise) => exercise.id !== exerciseId),
    }));
  };

  const resetTimer = () => {
    setRunningTimer(false);
    updateSelectedDay((day) => ({
      ...day,
      durationSeconds: 0,
    }));
  };

  if (!currentUser) {
    return (
      <main className="auth-page">
        <section className="login-card">
          <p className="eyebrow">React JSON Gym Tracker</p>
          <h1>Login to your workout plan</h1>
          <p className="muted">
            User data is fetched from React JSON and stored in browser local
            storage after every change.
          </p>

          <form className="login-form" onSubmit={loginUser}>
            <label>
              Email
              <input
                type="email"
                value={loginForm.email}
                onChange={(event) =>
                  setLoginForm({ ...loginForm, email: event.target.value })
                }
                placeholder="harish@gym.com"
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={loginForm.password}
                onChange={(event) =>
                  setLoginForm({ ...loginForm, password: event.target.value })
                }
                placeholder="123456"
              />
            </label>

            {loginError && <p className="error-text">{loginError}</p>}

            <button type="submit">Login</button>
          </form>

          <div className="demo-box">
            Demo login: <strong>harish@gym.com</strong> / <strong>123456</strong>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h1>{currentUser.name}'s Gym Tracker</h1>
          <p className="muted">{currentUser.goal}</p>
        </div>
        <button className="secondary-button" type="button" onClick={logoutUser}>
          Logout
        </button>
      </header>

      <section className="profile-grid">
        <article className="stat-card">
          <span>User</span>
          <strong>{currentUser.name}</strong>
        </article>
        <article className="stat-card">
          <span>Email</span>
          <strong>{currentUser.email}</strong>
        </article>
        <article className="stat-card">
          <span>Age</span>
          <strong>{currentUser.age}</strong>
        </article>
      </section>

      <section className="week-tabs" aria-label="Week selector">
        {currentUser.weeks.map((week) => (
          <button
            key={week.id}
            type="button"
            className={week.id === selectedWeekId ? 'week-tab active' : 'week-tab'}
            onClick={() => setSelectedWeekId(week.id)}
          >
            {week.label}
          </button>
        ))}
      </section>

      <section className="tracker-layout">
        <aside className="day-panel">
          <h2>{selectedWeek?.label} Days</h2>
          <div className="day-list">
            {DAYS.map((day) => (
              <button
                key={day}
                type="button"
                className={day === selectedDay ? 'day-button active' : 'day-button'}
                onClick={() => setSelectedDay(day)}
              >
                <span>{day}</span>
                <small>{selectedWeek?.days[day].exercises.length || 0} exercises</small>
              </button>
            ))}
          </div>
        </aside>

        <section className="workout-panel">
          <div className="section-header">
            <div>
              <p className="eyebrow">Selected day</p>
              <h2>
                {selectedWeek?.label} / {selectedDay}
              </h2>
            </div>
            <span className="pill">{selectedExercises.length} exercises</span>
          </div>

          <section className="summary-grid">
            <article className="summary-card">
              <span>Total sets</span>
              <strong>{totalSets}</strong>
            </article>
            <article className="summary-card">
              <span>Current day weight</span>
              <strong>{totalWeight} kg</strong>
              <small>reps x weight</small>
            </article>
            <article className="summary-card timer-card">
              <span>Workout time</span>
              <strong>{formatDuration(selectedWorkout.durationSeconds)}</strong>
              <div className="timer-actions">
                <button
                  type="button"
                  onClick={() => setRunningTimer((isRunning) => !isRunning)}
                >
                  {runningTimer ? 'Stop' : 'Start'}
                </button>
                <button className="secondary-button" type="button" onClick={resetTimer}>
                  Reset
                </button>
              </div>
            </article>
          </section>

          <form className="exercise-form" onSubmit={addExercise}>
            <label>
              Exercise
              <input
                type="text"
                value={exerciseForm.name}
                onChange={(event) =>
                  setExerciseForm({ ...exerciseForm, name: event.target.value })
                }
                placeholder="Shoulder Press"
              />
            </label>
            <label>
              Reps
              <input
                type="number"
                min="0"
                value={exerciseForm.reps}
                onChange={(event) =>
                  setExerciseForm({
                    ...exerciseForm,
                    reps: Number(event.target.value),
                  })
                }
              />
            </label>
            <label>
              Weight (kg)
              <input
                type="number"
                min="0"
                value={exerciseForm.weight}
                onChange={(event) =>
                  setExerciseForm({
                    ...exerciseForm,
                    weight: Number(event.target.value),
                  })
                }
              />
            </label>
            <button type="submit">Add Exercise</button>
          </form>

          <div className="exercise-list">
            {selectedExercises.length === 0 ? (
              <div className="empty-state">
                No exercises added for {selectedWeek?.label} {selectedDay}. Add
                your first workout above.
              </div>
            ) : (
              selectedExercises.map((exercise) => (
                <article className="exercise-card" key={exercise.id}>
                  <div className="exercise-card__header">
                    <h3>{exercise.name}</h3>
                    <button
                      className="danger-button"
                      type="button"
                      onClick={() => removeExercise(exercise.id)}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="set-table">
                    <div className="set-row set-row--heading">
                      <span>Set</span>
                      <span>Reps</span>
                      <span>Weight (kg)</span>
                    </div>
                    {exercise.sets.map((set, index) => (
                      <div className="set-row" key={set.id}>
                        <span>{index + 1}</span>
                        <input
                          type="number"
                          min="0"
                          value={set.reps}
                          onChange={(event) =>
                            updateSet(
                              exercise.id,
                              set.id,
                              'reps',
                              Number(event.target.value)
                            )
                          }
                        />
                        <input
                          type="number"
                          min="0"
                          value={set.weight}
                          onChange={(event) =>
                            updateSet(
                              exercise.id,
                              set.id,
                              'weight',
                              Number(event.target.value)
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => addSet(exercise.id)}
                  >
                    Add Set
                  </button>
                </article>
              ))
            )}
          </div>
        </section>
      </section>

      <section className="json-preview">
        <div className="section-header">
          <div>
            <p className="eyebrow">React JSON</p>
            <h2>Stored User Details</h2>
          </div>
        </div>
        <pre>{JSON.stringify(currentUser, null, 2)}</pre>
      </section>
    </main>
  );
}

export default App;
