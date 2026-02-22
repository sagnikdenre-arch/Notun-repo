import { Device, useDevices } from "@/context/DeviceContext";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { Trash2, Edit2, Power, Server, Router, Camera, Fingerprint, Activity } from "lucide-react";

// Updated to match the new infrastructure theme
const typeIcons: Record<string, any> = {
  Server: Server,
  Router: Router,
  Camera: Camera,
  Biometric: Fingerprint,
  // Fallbacks just in case the context still has the old types
  Temperature: Activity,
  Voltage: Activity,
  Pressure: Activity,
  Humidity: Activity,
};

interface DeviceCardProps {
  device: Device;
}

export function DeviceCard({ device }: DeviceCardProps) {
  const { deleteDevice } = useDevices();
  
  // @ts-ignore - Handle transition between old context and new context gracefully
  const typeLabel = device.deviceType || device.sensorType || "Unknown";
  // @ts-ignore
  const statusValue = device.statusPing || device.reading || "N/A";
  
  const Icon = typeIcons[typeLabel] || Activity;

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-white/5 bg-[#161b22] p-5 transition-all duration-300 hover:border-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.05)] h-[180px]">
      
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 transition-colors group-hover:bg-emerald-500/20">
            <Icon className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-100">{device.name}</h3>
            <p className="font-mono text-[11px] text-gray-500">{device.id}</p>
          </div>
        </div>
        <StatusBadge online={device.online} />
      </div>

      {/* Details Grid (Visible by default, pushed up slightly on hover) */}
      <div className="mt-4 flex-1 space-y-2.5 transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Device Type</span>
          <span className="text-xs font-medium text-gray-300">{typeLabel}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Status / Ping</span>
          <span className={`font-mono text-xs font-bold ${device.online ? 'text-emerald-500' : 'text-red-500'}`}>
            {statusValue}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Coords</span>
          <span className="font-mono text-[11px] text-gray-400">
            {device.latitude.toFixed(4)}, {device.longitude.toFixed(4)}
          </span>
        </div>
      </div>

      {/* Hover Actions (Overlays the bottom section on hover) */}
      <div className="absolute bottom-5 left-5 right-5 flex items-center gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100 bg-[#161b22] pt-1">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-10 shrink-0 border-gray-700 bg-transparent text-yellow-500/70 hover:bg-yellow-500/10 hover:text-yellow-500 hover:border-yellow-500/30"
        >
          <Power className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          className="h-8 flex-1 border-gray-700 bg-transparent text-xs text-gray-300 hover:bg-white/5 hover:text-white"
        >
          <Edit2 className="mr-1.5 h-3 w-3" />
          Edit
        </Button>
        <Button 
          variant="outline" 
          onClick={() => deleteDevice(device.id)}
          className="h-8 flex-1 border-red-500/30 bg-red-500/10 text-xs text-red-500 hover:bg-red-500/20 hover:text-red-400"
        >
          <Trash2 className="mr-1.5 h-3 w-3" />
          Delete
        </Button>
      </div>
    </div>
  );
}