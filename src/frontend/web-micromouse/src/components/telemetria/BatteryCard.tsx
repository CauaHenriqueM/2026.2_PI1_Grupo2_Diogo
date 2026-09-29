import type { BatteryData } from "../../types/telemetry";

interface BatteryCardProps {
  battery: BatteryData;
}

export function BatteryCard({
  battery,
}: BatteryCardProps) {
  return (
    <div className="telemetry-card">
      <span className="telemetry-label">
        Bateria
      </span>

      <div className="battery-header">
        <strong className="telemetry-main-value">
          {battery.percentage.toFixed(0)}%
        </strong>
      </div>

      <div className="battery-bar">
        <div
          className="battery-progress"
          style={{
            width: `${battery.percentage}%`,
          }}
        />
      </div>

      <div className="telemetry-details">
        <div>
          <span>Tensão</span>
          <strong>
            {battery.voltage.toFixed(2)} V
          </strong>
        </div>

        <div>
          <span>Consumo</span>
          <strong>
            {battery.current.toFixed(2)} A
          </strong>
        </div>

        <div>
          <span>Recarga estimada</span>
          <strong>
            {battery.estimatedRechargeMinutes} min
          </strong>
        </div>
      </div>
    </div>
  );
}