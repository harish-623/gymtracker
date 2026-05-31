import type { AppView, UserProfile, WorkoutDay } from "../types";

interface SidebarProps {
  days: WorkoutDay[];
  profile: UserProfile;
  currentView: AppView;
  selectedDay: WorkoutDay;
  onSelectView: (view: AppView) => void;
  onSelectDay: (day: WorkoutDay) => void;
}

export default function Sidebar({
  days,
  profile,
  currentView,
  selectedDay,
  onSelectView,
  onSelectDay,
}: SidebarProps) {
  return (
    <aside className="sidebar" aria-label="App navigation">
      <div className="logo">
        <h2>GYM PRO</h2>
      </div>

      <div className="profile-card">
        <div className="avatar">{profile.initials}</div>
        <h3>{profile.name}</h3>
        <p>{profile.focus}</p>
      </div>

      <nav className="nav-links">
        <button
          className={currentView === "home" ? "active" : ""}
          onClick={() => onSelectView("home")}
          type="button"
        >
          Home
        </button>
        <button
          className={currentView === "workout" ? "active" : ""}
          onClick={() => onSelectView("workout")}
          type="button"
        >
          Workout Plan
        </button>
        <button
          className={currentView === "exercises" ? "active" : ""}
          onClick={() => onSelectView("exercises")}
          type="button"
        >
          Exercises
        </button>
        <button
          className={currentView === "bmi" ? "active" : ""}
          onClick={() => onSelectView("bmi")}
          type="button"
        >
          BMI Calculator
        </button>
        <button
          className={currentView === "bodyFat" ? "active" : ""}
          onClick={() => onSelectView("bodyFat")}
          type="button"
        >
          Body Fat
        </button>
        <button
          className={currentView === "aiSupport" ? "active" : ""}
          onClick={() => onSelectView("aiSupport")}
          type="button"
        >
          AI Support
        </button>
      </nav>

      {currentView === "workout" && (
        <nav className="nav-links day-links" aria-label="Workout days">
        {days.map((day) => (
          <button
            className={selectedDay === day ? "active" : ""}
            key={day}
            onClick={() => onSelectDay(day)}
            type="button"
          >
            {day}
          </button>
        ))}
        </nav>
      )}
    </aside>
  );
}
