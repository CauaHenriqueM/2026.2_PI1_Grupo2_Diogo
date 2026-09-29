interface SpeedCardProps {
  speed: number;
}

export function SpeedCard({
  speed,
}: SpeedCardProps) {
  return (
    <div className="telemetry-card">
      <span className="telemetry-label">
        Velocidade média
      </span>

      <div className="speed-value">
        <strong className="telemetry-main-value">
          {speed.toFixed(2)}
        </strong>

        <span className="telemetry-unit">
          m/s
        </span>
      </div>
    </div>
  );
}