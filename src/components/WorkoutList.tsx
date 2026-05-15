import { Workout } from '../types';

interface WorkoutListProps {
  workouts: Workout[];
  onAdd: () => void;
}

export default function WorkoutList({ workouts, onAdd }: WorkoutListProps) {
  return (
    <section className="workout-list">
      <div className="workout-list__header">
        <h2>Workout log</h2>
        <button type="button" onClick={onAdd} className="button button--primary">
          Add workout
        </button>
      </div>

      <div className="workout-grid">
        {workouts.map((workout) => (
          <article key={workout.id} className="workout-card">
            <h3>{workout.name}</h3>
            <p>{workout.category}</p>
            <p>
              {workout.sets} sets × {workout.reps} reps
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
