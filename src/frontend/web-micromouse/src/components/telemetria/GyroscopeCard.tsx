import type { GyroscopeData } from "../../types/telemetry";

interface GyroscopeCardProps {
  gyro: GyroscopeData;
}

export function GyroscopeCard({
  gyro,
}: GyroscopeCardProps) {
  return (
    <div className="telemetry-card">
      <span className="telemetry-label">
        Giroscópio
      </span>

      <div className="gyro-values">
        <div>
          <span>X</span>
          <strong>{gyro.x.toFixed(2)}°</strong>
        </div>

        <div>
          <span>Y</span>
          <strong>{gyro.y.toFixed(2)}°</strong>
        </div>

        <div>
          <span>Z</span>
          <strong>{gyro.z.toFixed(2)}°</strong>
        </div>
      </div>
    </div>
  );
}