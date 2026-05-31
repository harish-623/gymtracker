import { type FormEvent, useState } from "react";
import type {
  Exercise,
  NewExerciseInput,
  WorkoutDay,
  WorkoutSet,
} from "../types";
import ExerciseCard from "./ExerciseCard";

interface WorkoutSectionProps {
  exercises: Exercise[];
  selectedDay: WorkoutDay;
  onAddExercise: (exercise: NewExerciseInput) => void;
  onAddSet: (exerciseId: number, set: WorkoutSet) => void;
  onRemoveExercise: (exerciseId: number) => void;
}

export default function WorkoutSection({
  exercises,
  onAddExercise,
  onAddSet,
  onRemoveExercise,
  selectedDay,
}: WorkoutSectionProps) {
  const [exerciseName, setExerciseName] = useState("");
  const [reps, setReps] = useState("10");
  const [weight, setWeight] = useState("20");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanedName = exerciseName.trim();
    const parsedReps = Number.parseInt(reps, 10);
    const parsedWeight = Number.parseFloat(weight);

    if (
      !cleanedName ||
      !Number.isFinite(parsedReps) ||
      !Number.isFinite(parsedWeight) ||
      parsedReps <= 0 ||
      parsedWeight < 0
    ) {
      return;
    }

    onAddExercise({
      name: cleanedName,
      reps: parsedReps,
      weight: parsedWeight,
    });

    setExerciseName("");
    setReps("10");
    setWeight("20");
  }

  return (
    <>
      <section className="workout-header">
        <div>
          <h2>{selectedDay} Workout</h2>
          <p>Manage your exercises and sets</p>
        </div>

      </section>

      <form className="exercise-form" onSubmit={handleSubmit}>
        <label>
          <span>Exercise Name</span>
          <input
            onChange={(event) => setExerciseName(event.target.value)}
            placeholder="Bench Press"
            type="text"
            value={exerciseName}
          />
        </label>

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

        <button className="primary-btn" type="submit">
          Add Exercise
        </button>
      </form>

      <section className="exercise-list" aria-label={`${selectedDay} exercises`}>
        {exercises.length > 0 ? (
          exercises.map((exercise) => (
            <ExerciseCard
              exercise={exercise}
              key={exercise.id}
              onAddSet={onAddSet}
              onRemove={onRemoveExercise}
            />
          ))
        ) : (
          <div className="empty-state">
            <h3>Rest day</h3>
            <p>No exercises planned. Add one when you are ready.</p>
          </div>
        )}
      </section>
    </>
  );
}
