import { useState, useCallback } from "react";
import { useDevices } from "@/context/DeviceContext";
import { AppHeader } from "@/components/AppHeader";
import { MapView } from "@/components/MapView";
import { StatusBadge } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Thermometer, Zap, Gauge, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";

const sensorIcons = {
  Temperature: Thermometer,
  Voltage: Zap,
  Pressure: Gauge,
  Humidity: Droplets,
};

const VisualizerPage = () => {
  const { devices, selectedDeviceId, setSelectedDeviceId } = useDevices();
  const [search, setSearch] = useState("");

  const filtered = devices.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.id.toLowerCase().includes(search.toLowerCase())
  );

  const selectedDevice = devices.find((d) => d.id === selectedDeviceId);
  const SelectedIcon = selectedDevice ? sensorIcons[selectedDevice.sensorType] : null;

  const handleSelectDevice = useCallback((id: string) => {
    setSelectedDeviceId(id);
  }, [setSelectedDeviceId]);

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="flex w-72 flex-col border-r border-border bg-card">
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search devices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.map((device) => {
              const Icon = sensorIcons[device.sensorType];
              return (
                <button
                  key={device.id}
                  onClick={() => setSelectedDeviceId(device.id)}
                  className={cn(
                    "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors",
                    selectedDeviceId === device.id
                      ? "bg-primary/10 border-l-2 border-primary"
                      : "hover:bg-muted border-l-2 border-transparent"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{device.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{device.id}</p>
                  </div>
                  <StatusBadge online={device.online} />
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main map area */}
        <div className="relative flex-1">
          <MapView
            devices={devices}
            selectedDeviceId={selectedDeviceId}
            onSelectDevice={handleSelectDevice}
          />

          {/* Location detail panel */}
          {selectedDevice && SelectedIcon && (
            <div className="absolute bottom-4 left-4 z-[1000] w-72 glass-strong rounded-lg p-4 glow-emerald">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                  <SelectedIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{selectedDevice.name}</h3>
                  <p className="font-mono text-[10px] text-muted-foreground">{selectedDevice.id}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Status</span>
                  <StatusBadge online={selectedDevice.online} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Reading</span>
                  <span className="font-mono text-sm font-bold text-foreground">{selectedDevice.reading}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Coordinates</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {selectedDevice.latitude.toFixed(4)}, {selectedDevice.longitude.toFixed(4)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Type</span>
                  <span className="text-xs text-foreground">{selectedDevice.sensorType}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualizerPage;
