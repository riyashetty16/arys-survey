export default function ProgressBar({ value }) {
  const pct = Math.round(Math.min(1, Math.max(0.03, value)) * 100);
  return (
    <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
      <div className="progress-fill" style={{ width: `${pct}%` }} />
      <div className="progress-dot" style={{ left: `${pct}%` }} />
    </div>
  );
}
