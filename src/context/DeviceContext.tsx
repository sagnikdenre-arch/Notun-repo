import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export type SensorType = "Temperature" | "Voltage" | "Pressure" | "Humidity" | "Server" | "Router" | "Camera" | "Biometric";

export interface Device {
  id: string;
  name: string;
  sensorType: SensorType;
  lat: number;
  lng: number;
  online: boolean;
  reading: string;
}

export interface Edge {
  from: string;
  to: string;
}

interface DeviceContextType {
  devices: Device[];
  edges: Edge[];
  activeRoute: string[];
  addDevice: (device: Omit<Device, "id" | "online" | "reading">) => void;
  updateDevice: (id: string, device: Partial<Device>) => void;
  deleteDevice: (id: string) => void;
  toggleDeviceStatus: (id: string) => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

const generateReading = (type: SensorType): string => {
  switch (type) {
    case "Server": return `${(9 + Math.random() * 2).toFixed(1)} Gbps`;
    case "Router": return `${Math.floor(8 + Math.random() * 15)} ms ping`;
    case "Camera": return "Recording 4K";
    case "Biometric": return "Active Sync";
    case "Temperature": return `${(18 + Math.random() * 15).toFixed(1)}°C`;
    case "Voltage": return `${(110 + Math.random() * 20).toFixed(1)}V`;
    case "Pressure": return `${(980 + Math.random() * 40).toFixed(1)} hPa`;
    case "Humidity": return `${(40 + Math.random() * 40).toFixed(0)}%`;
    default: return "Unknown";
  }
};

const uemDevices: Device[] = [
  { id: "RM-001", name: "IT Server Room", sensorType: "Server", lat: 22.5620, lng: 88.4900, online: true, reading: "10.0 Gbps" },
  { id: "RM-002", name: "Central Library Wi-Fi", sensorType: "Router", lat: 22.5635, lng: 88.4912, online: true, reading: "12 ms ping" },
  { id: "RM-003", name: "Admin Block Router", sensorType: "Router", lat: 22.5610, lng: 88.4895, online: true, reading: "15 ms ping" },
  { id: "RM-004", name: "North Gate CCTV", sensorType: "Camera", lat: 22.5645, lng: 88.4920, online: true, reading: "Recording 4K" },
  { id: "RM-005", name: "CSE Labs Gateway", sensorType: "Router", lat: 22.5605, lng: 88.4930, online: true, reading: "8 ms ping" },
  { id: "RM-006", name: "Main Gate Scanner", sensorType: "Biometric", lat: 22.5615, lng: 88.4945, online: true, reading: "Active Sync" },
  { id: "RM-007", name: "Cafeteria CCTV", sensorType: "Camera", lat: 22.5590, lng: 88.4910, online: true, reading: "Recording 4K" },
];

const campusEdges: Edge[] = [
  { from: "RM-001", to: "RM-002" }, { from: "RM-001", to: "RM-003" },
  { from: "RM-002", to: "RM-004" }, { from: "RM-002", to: "RM-005" },
  { from: "RM-003", to: "RM-006" }, { from: "RM-003", to: "RM-005" },
  { from: "RM-005", to: "RM-007" },
];

export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const [devices, setDevices] = useState<Device[]>(uemDevices);
  const [activeRoute, setActiveRoute] = useState<string[]>([]);
  
  // BFS PATHFINDING LOGIC
  useEffect(() => {
    const calculateShortestPath = (start: string, target: string) => {
      const graph: Record<string, string[]> = {};
      const onlineNodeIds = new Set(devices.filter(d => d.online).map(d => d.id));

      campusEdges.forEach(({ from, to }) => {
        if (!graph[from]) graph[from] = [];
        if (!graph[to]) graph[to] = [];
        if (onlineNodeIds.has(from) && onlineNodeIds.has(to)) {
          graph[from].push(to); graph[to].push(from);
        }
      });

      let queue = [[start]];
      let visited = new Set([start]);
      while (queue.length > 0) {
        let path = queue.shift()!;
        let current = path[path.length - 1];
        if (current === target) { setActiveRoute(path); return; }
        const neighbors = graph[current] || [];
        for (let neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor); queue.push([...path, neighbor]);
          }
        }
      }
      setActiveRoute([]);
    };
    calculateShortestPath("RM-005", "RM-001");
  }, [devices]);

  // LIVE SIMULATOR
  useEffect(() => {
    const liveDataStream = setInterval(() => {
      setDevices((prev) => prev.map((d) => {
        if (!d.online) return d;
        let newReading = d.reading;
        const num = parseFloat(d.reading);
        if (d.sensorType === "Router") {
          newReading = `${Math.floor(8 + Math.random() * 10)} ms ping`;
        } else if (d.sensorType === "Server") {
          newReading = `${(9 + Math.random() * 2).toFixed(1)} Gbps`;
        } else if (!isNaN(num)) {
          const next = (num + (Math.random() * 0.4 - 0.2)).toFixed(1);
          if (d.sensorType === "Temperature") newReading = `${next}°C`;
          if (d.sensorType === "Voltage") newReading = `${next}V`;
          if (d.sensorType === "Pressure") newReading = `${next} hPa`;
          if (d.sensorType === "Humidity") newReading = `${Math.round(num)}%`;
        }
        return { ...d, reading: newReading };
      }));
    }, 2500);
    return () => clearInterval(liveDataStream);
  }, []);

  const toggleDeviceStatus = useCallback((id: string) => {
    setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, online: !d.online } : d)));
  }, []);

  const updateDevice = useCallback((id: string, updates: Partial<Device>) => {
    setDevices((prev) => prev.map((d) => {
      if (d.id === id) {
        const newReading = updates.sensorType && updates.sensorType !== d.sensorType 
          ? generateReading(updates.sensorType) : d.reading;
        return { ...d, ...updates, reading: newReading };
      }
      return d;
    }));
  }, []);

  const addDevice = useCallback((device: Omit<Device, "id" | "online" | "reading">) => {
    setDevices((prev) => [...prev, { ...device, id: `RM-${String(prev.length + 1).padStart(3, "0")}`, online: true, reading: generateReading(device.sensorType) }]);
  }, []);

  const deleteDevice = useCallback((id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
  }, []);

  return (
    <DeviceContext.Provider value={{ devices, edges: campusEdges, activeRoute, addDevice, updateDevice, deleteDevice, toggleDeviceStatus }}>
      {children}
    </DeviceContext.Provider>
  );
}

export const useDevices = () => {
  const ctx = useContext(DeviceContext);
  if (!ctx) throw new Error("useDevices must be used within DeviceProvider");
  return ctx;
};