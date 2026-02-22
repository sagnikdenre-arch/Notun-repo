import { useDevices } from "@/context/DeviceContext";
import { AppHeader } from "@/components/AppHeader";
import { DeviceCard } from "@/components/DeviceCard";
import { RegisterDeviceDialog } from "@/components/RegisterDeviceDialog";
import { Server, Wifi, WifiOff } from "lucide-react";

const DashboardPage = () => {
  const { devices } = useDevices();
  const onlineCount = devices.filter((d) => d.online).length;
  const offlineCount = devices.length - onlineCount;

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        {/* Stats bar */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          {[
            { label: "Total Devices", value: devices.length, icon: Server, color: "text-foreground" },
            { label: "Online", value: onlineCount, icon: Wifi, color: "text-primary" },
            { label: "Offline", value: offlineCount, icon: WifiOff, color: "text-rose-status" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-lg p-4 flex items-center gap-3">
              <s.icon className={`h-5 w-5 ${s.color}`} />
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className={`font-mono text-xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Device Library</h2>
          <RegisterDeviceDialog />
        </div>

        {/* Device grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {devices.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
