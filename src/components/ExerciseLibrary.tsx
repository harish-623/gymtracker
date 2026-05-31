import { useState } from "react";
import type { ExerciseGuide } from "../types";

interface ExerciseLibraryProps {
  exercises: ExerciseGuide[];
  savedJson: unknown;
}

export default function ExerciseLibrary({
  exercises,
  savedJson,
}: ExerciseLibraryProps) {
  const [isJsonVisible, setIsJsonVisible] = useState(false);
  const formattedJson = JSON.stringify(savedJson, null, 2);

  return (
    <section className="exercise-library">
      <div className="library-header">
        <div>
          <span className="section-label">Learn</span>
          <h1>Exercise Name List</h1>
          <p>Use this guide to learn common exercise names and target muscles.</p>
        </div>
      </div>

      <div className="library-grid">
        {exercises.map((exercise) => (
          <article className="library-card" key={exercise.id}>
            <img src={exercise.image} alt={`${exercise.name} exercise`} />
            <div>
              <span>{exercise.target}</span>
              <h2>{exercise.name}</h2>
              <p>{exercise.tip}</p>
            </div>
          </article>
        ))}
      </div>

      <section className="json-panel">
        <button
          className="json-toggle"
          onClick={() => setIsJsonVisible((isVisible) => !isVisible)}
          type="button"
        >
          {isJsonVisible ? "Hide Browser JSON Data" : "Show Browser JSON Data"}
        </button>

        {isJsonVisible && (
          <pre className="json-viewer">
            <code>{formattedJson}</code>
          </pre>
        )}
      </section>
    </section>
  );
}
