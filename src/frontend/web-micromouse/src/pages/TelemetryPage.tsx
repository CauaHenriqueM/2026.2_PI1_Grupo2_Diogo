import { BatteryCard } from "../components/telemetria/BatteryCard";
import { GyroscopeCard } from "../components/telemetria/GyroscopeCard";
import { MotorRPMCard } from "../components/telemetria/MotorRPMCard";
import { SpeedCard } from "../components/telemetria/SpeedCard";
import { useTelemetry } from "../hooks/useTelemetry";

import GiroSvg from '../../assets/giro.svg'



export function TelemetryPage() {
  const telemetry = useTelemetry();

  const batteryPercent =
    typeof telemetry.battery === "number"
      ? telemetry.battery
      : telemetry.battery &&
          typeof telemetry.battery === "object" &&
          "value" in telemetry.battery
        ? Number(telemetry.battery.value)
        : 0;
  return (
    <main className="flex-1 overflow-y-auto px-4 pb-4 pt-34 text-slate-200 sm:p-12">
      
      <div
        className="
          grid w-full gap-4 sm:gap-5
          grid-cols-[repeat(auto-fit,minmax(240px,1fr))]
        "
      >
        {/* BATERIA */}
        <BatteryCard battery={batteryPercent} />

        {/* VELOCIDADE */}
        <SpeedCard
          speed={telemetry.averageSpeed}
        />

        {/* MOTORES */}
       <MotorRPMCard
        leftRpm={telemetry.motors.leftRpm}
        rightRpm={telemetry.motors.rightRpm}
       />

        {/* GIROSCÓPIO */}
        <GyroscopeCard
          x={telemetry.gyro.x}
          y={telemetry.gyro.y}
          z={telemetry.gyro.z}
          
        />
        
      </div>
    </main>
  );
}