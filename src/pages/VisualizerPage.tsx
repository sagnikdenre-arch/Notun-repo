import { useState, useCallback } from "react";
import { useDevices } from "@/context/DeviceContext";
import { AppHeader } from "@/components/AppHeader";
import { MapView } from "@/components/MapView";
import { StatusBadge } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Server, Router, Camera, Fingerprint, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const typeIcons: Record<string, any> = {
  Server: Server,
  Router: Router,
  Camera: Camera,
  Biometric: Fingerprint,
  // Fallbacks just in case
  Temperature: Activity,
  Voltage: Activity,
  Pressure: Activity,
  Humidity: Activity,
};

const VisualizerPage = () => {
  const { devices, selectedDeviceId, setSelectedDeviceId } = useDevices();
  const [search, setSearch] = useState("");

  const filtered = devices.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.id.toLowerCase().includes(search.toLowerCase())
  );

  const selectedDevice = devices.find((d) => d.id === selectedDeviceId);
  // @ts-ignore
  const SelectedIcon = selectedDevice ? (typeIcons[selectedDevice.deviceType || selectedDevice.sensorType] || Activity) : null;

  const handleSelectDevice = useCallback((id: string) => {
    setSelectedDeviceId(id);
  }, [setSelectedDeviceId]);

  return (
    <div className="flex min-h-screen flex-col bg-[#0d1117]">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <aside className="flex w-[320px] flex-col border-r border-white/5 bg-[#0d1117] z-10 shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
          <div className="p-4 border-b border-white/5 bg-[#161b22]/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search nodes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 border-gray-800 bg-[#0d1117] pl-10 text-gray-200 placeholder:text-gray-600 focus-visible:ring-emerald-500/50"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
            {filtered.map((device) => {
              // @ts-ignore
              const Icon = typeIcons[device.deviceType || device.sensorType] || Activity;
              const isSelected = selectedDeviceId === device.id;
              
              return (
                <button
                  key={device.id}
                  onClick={() => setSelectedDeviceId(device.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-all duration-200",
                    isSelected
                      ? "bg-emerald-500/10 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                      : "border border-transparent hover:bg-white/5 hover:border-white/10"
                  )}
                >
                  <div className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-md border transition-colors",
                    isSelected ? "bg-emerald-500/20 border-emerald-500/30" : "bg-gray-800/50 border-gray-700/50"
                  )}>
                    <Icon className={cn("h-4 w-4", isSelected ? "text-emerald-500" : "text-gray-400")} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-200">{device.name}</p>
                    <p className="font-mono text-[10px] text-gray-500">{device.id}</p>
                  </div>
                  <StatusBadge online={device.online} />
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main Map Area */}
        <div className="relative flex-1 bg-[#0a0d14]">
          <MapView
            devices={devices}
            selectedDeviceId={selectedDeviceId}
            onSelectDevice={handleSelectDevice}
          />

          {/* Location Detail Panel Overlay */}
          {selectedDevice && SelectedIcon && (
            <div className="absolute bottom-6 left-6 z-[1000] w-80 rounded-xl border border-white/10 bg-[#161b22]/95 p-5 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-md animate-in slide-in-from-bottom-4 duration-300">
              <div className="mb-4 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  <SelectedIcon className="h-6 w-6 text-emerald-500" />
                </div>
                <div className="flex-1 overflow-hidden pt-1">
                  <h3 className="truncate text-base font-bold text-gray-100">{selectedDevice.name}</h3>
                  <p className="font-mono text-[11px] text-emerald-500/80">{selectedDevice.id}</p>
                </div>
              </div>

              <div className="space-y-3.5 rounded-lg border border-white/5 bg-black/20 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Status</span>
                  <StatusBadge online={selectedDevice.online} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Status / Ping</span>
                  <span className={cn(
                    "font-mono text-xs font-bold",
                    selectedDevice.online ? "text-emerald-400" : "text-red-400"
                  )}>
                    {/* @ts-ignore */}
                    {selectedDevice.statusPing || selectedDevice.reading}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Coordinates</span>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-gray-600" />
                    <span className="font-mono text-[11px] text-gray-300">
                      {selectedDevice.latitude.toFixed(4)}, {selectedDevice.longitude.toFixed(4)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-white/5 pt-3">
                  <span className="text-xs font-medium text-gray-500">Device Type</span>
                  {/* @ts-ignore */}
                  <span className="text-xs font-semibold tracking-wide text-gray-300 uppercase">{selectedDevice.deviceType || selectedDevice.sensorType}</span>
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