import { type FormEvent, useState } from "react";
import type { Exercise, WorkoutSet } from "../types";

interface ExerciseCardProps {
  exercise: Exercise;
  onAddSet: (exerciseId: number, set: WorkoutSet) => void;
  onRemove: (exerciseId: number) => void;
}

export default function ExerciseCard({
  exercise,
  onAddSet,
  onRemove,
}: ExerciseCardProps) {
  const [reps, setReps] = useState("10");
  const [weight, setWeight] = useState("20");

  function handleAddSet(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedReps = Number.parseInt(reps, 10);
    const parsedWeight = Number.parseFloat(weight);

    if (
      !Number.isFinite(parsedReps) ||
      !Number.isFinite(parsedWeight) ||
      parsedReps <= 0 ||
      parsedWeight < 0
    ) {
      return;
    }

    onAddSet(exercise.id, {
      reps: parsedReps,
      weight: parsedWeight,
    });

    setReps("10");
    setWeight("20");
  }

  return (
    <article className="exercise-card">
      <div className="exercise-top">
        <div>
          <h3>{exercise.name}</h3>
          <p>
            {exercise.category} / {exercise.sets.length} sets
          </p>
        </div>

        <button
          className="remove-btn"
          onClick={() => onRemove(exercise.id)}
          type="button"
        >
          Remove
        </button>
      </div>

      <div className="sets-container">
        {exercise.sets.map((set, index) => (
          <div className="set-pill" key={`${exercise.id}-${index}`}>
            <span>Set {index + 1}</span>
            <strong>
              {set.reps} x {set.weight}kg
            </strong>
          </div>
        ))}
      </div>

      <form className="set-form" onSubmit={handleAddSet}>
        <label>
          <span>Reps</span>
          <input
            inputMode="numeric"
            onChange={(event) => setReps(event.target.value)}
            placeholder="10"
            type="text"
            value={reps}
          />
        </label>

        <label>
          <span>Weight</span>
          <input
            inputMode="decimal"
            onChange={(event) => setWeight(event.target.value)}
            placeholder="20.5"
            type="text"
            value={weight}
          />
        </label>

        <button className="secondary-btn" type="submit">
          + Add Set
        </button>
      </form>
    </article>
  );
}
