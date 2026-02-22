import { Device, useDevices } from "@/context/DeviceContext";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { Trash2, Thermometer, Zap, Gauge, Droplets } from "lucide-react";

const sensorIcons = {
  Temperature: Thermometer,
  Voltage: Zap,
  Pressure: Gauge,
  Humidity: Droplets,
};

interface DeviceCardProps {
  device: Device;
}

export function DeviceCard({ device }: DeviceCardProps) {
  const { deleteDevice } = useDevices();
  const Icon = sensorIcons[device.sensorType];

  return (
    <div className="group glass rounded-lg p-4 transition-all hover:glow-emerald">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{device.name}</h3>
            <p className="font-mono text-xs text-muted-foreground">{device.id}</p>
          </div>
        </div>
        <StatusBadge online={device.online} />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">{device.sensorType}</p>
          <p className="font-mono text-lg font-bold text-foreground">{device.reading}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteDevice(device.id)}
          className="h-8 w-8 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-3 border-t border-border pt-2">
        <p className="font-mono text-[10px] text-muted-foreground">
          {device.latitude.toFixed(4)}, {device.longitude.toFixed(4)}
        </p>
      </div>
    </div>
  );
}
