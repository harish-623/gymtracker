import { type FormEvent, useMemo, useState } from "react";

function getBmiStatus(bmi: number) {
  if (bmi < 18.5) {
    return "Underweight";
  }

  if (bmi < 25) {
    return "Healthy";
  }

  if (bmi < 30) {
    return "Overweight";
  }

  return "Obese";
}

function calculateDailyCalories(weight: number, height: number, age: number) {
  const bmr = 10 * weight + 6.25 * height - 5 * age + 5;

  return Math.round(bmr * 1.45);
}

export default function BmiCalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(() => {
    const parsedHeight = Number.parseFloat(height);
    const parsedWeight = Number.parseFloat(weight);
    const parsedAge = Number.parseInt(age, 10);

    if (
      !Number.isFinite(parsedHeight) ||
      !Number.isFinite(parsedWeight) ||
      !Number.isFinite(parsedAge) ||
      parsedHeight <= 0 ||
      parsedWeight <= 0 ||
      parsedAge <= 0
    ) {
      return null;
    }

    const heightInMeters = parsedHeight / 100;
    const bmi = parsedWeight / (heightInMeters * heightInMeters);
    const maintenanceCalories = calculateDailyCalories(
      parsedWeight,
      parsedHeight,
      parsedAge
    );

    return {
      bmi,
      status: getBmiStatus(bmi),
      maintenanceCalories,
      weightLossCalories: Math.max(maintenanceCalories - 500, 1200),
      weightGainCalories: maintenanceCalories + 400,
    };
  }, [age, height, weight]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="bmi-page">
      <div className="bmi-header">
        <div>
          <span className="section-label">Calculator</span>
          <h1>BMI Calculator</h1>
          <p>
            Enter height, weight, and age to estimate BMI and daily calories for
            weight loss or weight gain.
          </p>
        </div>
      </div>

      <form className="bmi-form" onSubmit={handleSubmit}>
        <label>
          <span>Height</span>
          <input
            inputMode="decimal"
            onChange={(event) => setHeight(event.target.value)}
            placeholder="170 cm"
            type="text"
            value={height}
          />
        </label>

        <label>
          <span>Weight</span>
          <input
            inputMode="decimal"
            onChange={(event) => setWeight(event.target.value)}
            placeholder="70 kg"
            type="text"
            value={weight}
          />
        </label>

        <label>
          <span>Age</span>
          <input
            inputMode="numeric"
            onChange={(event) => setAge(event.target.value)}
            placeholder="25"
            type="text"
            value={age}
          />
        </label>

        <button className="primary-btn" type="submit">
          Calculate
        </button>
      </form>

      {submitted && result && (
        <section className="bmi-results" aria-label="BMI results">
          <article>
            <span>BMI</span>
            <h2>{result.bmi.toFixed(1)}</h2>
            <p>{result.status}</p>
          </article>
          <article>
            <span>Maintain Weight</span>
            <h2>{result.maintenanceCalories.toLocaleString()} kcal</h2>
            <p>Estimated daily calories</p>
          </article>
          <article>
            <span>Weight Loss</span>
            <h2>{result.weightLossCalories.toLocaleString()} kcal</h2>
            <p>Approximate daily target</p>
          </article>
          <article>
            <span>Weight Gain</span>
            <h2>{result.weightGainCalories.toLocaleString()} kcal</h2>
            <p>Approximate daily target</p>
          </article>
        </section>
      )}

      {submitted && !result && (
        <div className="empty-state">
          <h3>Enter valid details</h3>
          <p>Height, weight, and age must be greater than zero.</p>
        </div>
      )}
    </section>
  );
}
