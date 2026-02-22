import React, { createContext, useContext, useState, ReactNode } from "react";

export type SensorType = "Temperature" | "Voltage" | "Pressure" | "Humidity";

export interface Device {
  id: string;
  name: string;
  sensorType: SensorType;
  latitude: number;
  longitude: number;
  online: boolean;
  reading: string;
}

interface DeviceContextType {
  devices: Device[];
  addDevice: (device: Omit<Device, "id" | "online" | "reading">) => void;
  updateDevice: (id: string, device: Partial<Device>) => void;
  deleteDevice: (id: string) => void;
  selectedDeviceId: string | null;
  setSelectedDeviceId: (id: string | null) => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

const sensorReadings: Record<SensorType, () => string> = {
  Temperature: () => `${(18 + Math.random() * 15).toFixed(1)}°C`,
  Voltage: () => `${(110 + Math.random() * 20).toFixed(1)}V`,
  Pressure: () => `${(980 + Math.random() * 40).toFixed(1)} hPa`,
  Humidity: () => `${(30 + Math.random() * 50).toFixed(1)}%`,
};

const defaultDevices: Device[] = [
  { id: "RM-001", name: "Substation Alpha", sensorType: "Voltage", latitude: 40.7128, longitude: -74.006, online: true, reading: "121.3V" },
  { id: "RM-002", name: "Thermal Unit B", sensorType: "Temperature", latitude: 40.7308, longitude: -73.9975, online: true, reading: "24.7°C" },
  { id: "RM-003", name: "Pressure Node C", sensorType: "Pressure", latitude: 40.7484, longitude: -73.9857, online: false, reading: "1012.4 hPa" },
  { id: "RM-004", name: "Humidity Sensor D", sensorType: "Humidity", latitude: 40.7061, longitude: -74.0088, online: true, reading: "62.3%" },
  { id: "RM-005", name: "Grid Monitor E", sensorType: "Voltage", latitude: 40.72, longitude: -74.015, online: false, reading: "0V" },
];

let counter = 6;

export function DeviceProvider({ children }: { children: ReactNode }) {
  const [devices, setDevices] = useState<Device[]>(defaultDevices);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const addDevice = (device: Omit<Device, "id" | "online" | "reading">) => {
    const id = `RM-${String(counter++).padStart(3, "0")}`;
    const online = Math.random() > 0.3;
    const reading = online ? sensorReadings[device.sensorType]() : "N/A";
    setDevices((prev) => [...prev, { ...device, id, online, reading }]);
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
