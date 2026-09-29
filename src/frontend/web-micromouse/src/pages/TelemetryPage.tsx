import { BatteryCard } from "../components/telemetria/BatteryCard";
import { ConnectionCard } from "../components/telemetria/ConnectionCard";
import { GyroscopeCard } from "../components/telemetria/GyroscopeCard";
import { MotorRPMCard } from "../components/telemetria/MotorRPMCard";
import { SpeedCard } from "../components/telemetria/SpeedCard";

import { useTelemetry } from "../hooks/useTelemetry";

import "../components/telemetria/telemetry.css";

export function TelemetryPage() {
  const telemetry = useTelemetry();

  return (
    <main className="telemetry-page w-full">
      <div className="telemetry-grid">

        <ConnectionCard
          connected={telemetry.connected}
        />

        <BatteryCard
          battery={telemetry.battery}
        />

        <SpeedCard
          speed={telemetry.averageSpeed}
        />

        <MotorRPMCard
          motors={telemetry.motors}
        />

        <GyroscopeCard
          gyro={telemetry.gyro}
        />

      </div>
    </main>
  );
}