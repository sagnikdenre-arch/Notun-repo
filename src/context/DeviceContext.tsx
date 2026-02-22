import React, { createContext, useContext, useState, ReactNode } from "react";

// Updated to match the infrastructure theme
export type DeviceType = "Server" | "Router" | "Camera" | "Biometric";

export interface Device {
  id: string;
  name: string;
  deviceType: DeviceType;
  latitude: number;
  longitude: number;
  online: boolean;
  statusPing: string;
}

interface DeviceContextType {
  devices: Device[];
  addDevice: (device: Omit<Device, "id" | "online" | "statusPing">) => void;
  updateDevice: (id: string, device: Partial<Device>) => void;
  deleteDevice: (id: string) => void;
  selectedDeviceId: string | null;
  setSelectedDeviceId: (id: string | null) => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

// Generates realistic mock data when you add a new device
const statusGenerators: Record<DeviceType, () => string> = {
  Server: () => `${(1 + Math.random() * 9).toFixed(1)} Gbps`,
  Router: () => `${Math.floor(5 + Math.random() * 40)} ms ping`,
  Camera: () => (Math.random() > 0.5 ? "Recording 4K" : "Recording 1080p"),
  Biometric: () => "Active Sync",
};

// The exact nodes from your RouteMesh dashboard screenshot
const defaultDevices: Device[] = [
  { id: "RM-001", name: "IT Server Room", deviceType: "Server", latitude: 22.5620, longitude: 88.4900, online: true, statusPing: "9.9 Gbps" },
  { id: "RM-002", name: "Central Library Wi-Fi", deviceType: "Router", latitude: 22.5635, longitude: 88.4912, online: true, statusPing: "15 ms ping" },
  { id: "RM-003", name: "Admin Block Router", deviceType: "Router", latitude: 22.5610, longitude: 88.4895, online: true, statusPing: "15 ms ping" },
  { id: "RM-004", name: "North Gate CCTV", deviceType: "Camera", latitude: 22.5645, longitude: 88.4920, online: true, statusPing: "Recording 4K" },
  { id: "RM-005", name: "CSE Labs Gateway", deviceType: "Router", latitude: 22.5605, longitude: 88.4930, online: true, statusPing: "14 ms ping" },
  { id: "RM-006", name: "Main Gate Scanner", deviceType: "Biometric", latitude: 22.5615, longitude: 88.4945, online: true, statusPing: "Active Sync" },
  { id: "RM-007", name: "Cafeteria CCTV", deviceType: "Camera", latitude: 22.5590, longitude: 88.4910, online: true, statusPing: "Recording 4K" },
];

let counter = 8; // Starting at 8 since 1-7 are taken by default devices

export function DeviceProvider({ children }: { children: ReactNode }) {
  const [devices, setDevices] = useState<Device[]>(defaultDevices);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const addDevice = (device: Omit<Device, "id" | "online" | "statusPing">) => {
    const id = `RM-${String(counter++).padStart(3, "0")}`;
    const online = Math.random() > 0.1; // 90% chance to be online for better demo look
    const statusPing = online ? statusGenerators[device.deviceType]() : "OFFLINE";
    setDevices((prev) => [...prev, { ...device, id, online, statusPing }]);
  };

  const updateDevice = (id: string, updates: Partial<Device>) => {
    setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  };

  const deleteDevice = (id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
    if (selectedDeviceId === id) setSelectedDeviceId(null);
  };

  return (
    <DeviceContext.Provider value={{ devices, addDevice, updateDevice, deleteDevice, selectedDeviceId, setSelectedDeviceId }}>
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevices() {
  const ctx = useContext(DeviceContext);
  if (!ctx) throw new Error("useDevices must be used within DeviceProvider");
  return ctx;
}