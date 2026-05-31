import type { StatCard } from "../types";

interface StatsGridProps {
  stats: StatCard[];
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <section className="stats-grid" aria-label="Workout stats">
      {stats.map((stat) => (
        <article className="stat-card" key={stat.label}>
          <span>{stat.label}</span>
          <h2>{stat.value}</h2>
        </article>
      ))}
    </section>
  );
}
