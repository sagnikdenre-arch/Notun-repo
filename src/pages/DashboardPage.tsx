import { useDevices } from "@/context/DeviceContext";
import { AppHeader } from "@/components/AppHeader";
import { DeviceCard } from "@/components/DeviceCard";
import { RegisterDeviceDialog } from "@/components/RegisterDeviceDialog";
import { Server, Wifi, WifiOff, Activity, Filter, ChevronDown } from "lucide-react";

const DashboardPage = () => {
  const { devices } = useDevices();
  const onlineCount = devices.filter((d) => d.online).length;
  const offlineCount = devices.length - onlineCount;

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-200">
      <AppHeader />
      
      <main className="mx-auto max-w-[1400px] px-4 py-6 md:px-8">
        
        {/* Top Stats & Actions Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-6 text-sm font-medium">
            <div className="flex items-center gap-2 text-gray-400">
              <Activity className="h-4 w-4 text-emerald-500" />
              <span>Total Devices:</span>
              <span className="font-mono text-emerald-500">{devices.length}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Wifi className="h-4 w-4 text-emerald-500" />
              <span>Online:</span>
              <span className="font-mono text-emerald-500">{onlineCount}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <WifiOff className="h-4 w-4 text-red-500" />
              <span>Offline:</span>
              <span className="font-mono text-red-500">{offlineCount}</span>
            </div>
          </div>

          <div>
            <RegisterDeviceDialog />
          </div>
        </div>

        {/* Live Data Route Banner */}
        <div className="mb-8 flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-[#161b22] px-4 py-3 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
          <Activity className="h-5 w-5 text-emerald-500" />
          <span className="text-sm font-medium text-emerald-500">
            Live Data Route (CSE Labs to Server):
          </span>
          <span className="font-mono text-sm font-bold text-emerald-400">
            RM-005 <span className="text-emerald-700">→</span> RM-002 <span className="text-emerald-700">→</span> RM-001
          </span>
        </div>

        {/* Active Infrastructure Header & Filter */}
        <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
          <h2 className="text-lg font-bold text-gray-100">Active Infrastructure</h2>
          
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-gray-500" />
            <button className="flex items-center gap-2 rounded-md border border-white/10 bg-[#161b22] px-3 py-1.5 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5">
              View All Nodes
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Device Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {devices.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
        
      </main>
    </div>
  );
};

export default DashboardPage;