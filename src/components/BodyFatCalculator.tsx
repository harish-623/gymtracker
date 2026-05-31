import { type FormEvent, useMemo, useState } from "react";

type BodyFatFormula = "adult-male" | "adult-female" | "boy" | "girl";

function calculateBodyFat(bmi: number, age: number, formula: BodyFatFormula) {
  if (formula === "adult-male") {
    return 1.2 * bmi + 0.23 * age - 16.2;
  }

  if (formula === "adult-female") {
    return 1.2 * bmi + 0.23 * age - 5.4;
  }

  if (formula === "boy") {
    return 1.51 * bmi - 0.7 * age - 2.2;
  }

  return 1.51 * bmi - 0.7 * age + 1.4;
}

export default function BodyFatCalculator() {
  const [bmi, setBmi] = useState("");
  const [age, setAge] = useState("");
  const [formula, setFormula] = useState<BodyFatFormula>("adult-male");
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(() => {
    const parsedBmi = Number.parseFloat(bmi);
    const parsedAge = Number.parseInt(age, 10);

    if (
      !Number.isFinite(parsedBmi) ||
      !Number.isFinite(parsedAge) ||
      parsedBmi <= 0 ||
      parsedAge <= 0
    ) {
      return null;
    }

    return Math.max(calculateBodyFat(parsedBmi, parsedAge, formula), 0);
  }, [age, bmi, formula]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="bmi-page">
      <div className="bmi-header">
        <div>
          <span className="section-label">Calculator</span>
          <h1>Body Fat Calculator</h1>
          <p>
            Enter BMI and age, then choose the BMI method category to estimate
            body fat percentage.
          </p>
        </div>
      </div>

      <form className="bmi-form" onSubmit={handleSubmit}>
        <label>
          <span>BMI</span>
          <input
            inputMode="decimal"
            onChange={(event) => setBmi(event.target.value)}
            placeholder="22.5"
            type="text"
            value={bmi}
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

        <label>
          <span>Method</span>
          <select
            onChange={(event) => setFormula(event.target.value as BodyFatFormula)}
            value={formula}
          >
            <option value="adult-male">Adult Male</option>
            <option value="adult-female">Adult Female</option>
            <option value="boy">Boy</option>
            <option value="girl">Girl</option>
          </select>
        </label>

        <button className="primary-btn" type="submit">
          Calculate
        </button>
      </form>

      {submitted && result !== null && (
        <section className="bmi-results" aria-label="Body fat result">
          <article>
            <span>Body Fat Percentage</span>
            <h2>{result.toFixed(1)}%</h2>
            <p>BMI method estimate</p>
          </article>
        </section>
      )}

      {submitted && result === null && (
        <div className="empty-state">
          <h3>Enter valid details</h3>
          <p>BMI and age must be greater than zero.</p>
        </div>
      )}
    </section>
  );
}
