export default function DashboardHeader() {
  return (
    <header className="topbar">
      <div>
        <h1>Workout Dashboard</h1>
        <p>Track your daily progress and performance</p>
      </div>

      <button className="logout-btn" type="button">
        Logout
      </button>
    </header>
  );
}
