import type { MotorData } from "../../types/telemetry";

interface MotorRPMCardProps {
  motors: MotorData;
}

export function MotorRPMCard({ motors }: MotorRPMCardProps) {
  return (
    <div className="telemetry-card">
      <span className="telemetry-label">
        RPM dos motores
      </span>

      <div className="motor-values">
        <div>
          <span>Esquerdo</span>
          <strong>{motors.leftRpm}</strong>
          <small>RPM</small>
        </div>

        <div>
          <span>Direito</span>
          <strong>{motors.rightRpm}</strong>
          <small>RPM</small>
        </div>
      </div>
    </div>
  );
}