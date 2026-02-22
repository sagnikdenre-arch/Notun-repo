import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Device, Edge } from "@/context/DeviceContext";

interface MapViewProps {
  devices: Device[];
  edges: Edge[];
  activeRoute: string[];
  selectedDeviceId: string | null;
  onSelectDevice: (id: string) => void;
}

export function MapView({ devices, edges, activeRoute, selectedDeviceId, onSelectDevice }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<string, L.CircleMarker>>(new Map());
  const linesRef = useRef<L.Polyline[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapRef.current = L.map(containerRef.current, { center: [22.5620, 88.4900], zoom: 17, zoomControl: false });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png").addTo(mapRef.current);
    return () => { mapRef.current?.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();
    linesRef.current.forEach((l) => l.remove());
    linesRef.current = [];

    const isEdgeActive = (fromId: string, toId: string) => {
      for (let i = 0; i < activeRoute.length - 1; i++) {
        if ((activeRoute[i] === fromId && activeRoute[i+1] === toId) || (activeRoute[i] === toId && activeRoute[i+1] === fromId)) return true;
      }
      return false;
    };

    edges.forEach((edge) => {
      const from = devices.find(d => d.id === edge.from);
      const to = devices.find(d => d.id === edge.to);
      if (!from || !to) return;
      const active = isEdgeActive(edge.from, edge.to);
      const line = L.polyline([[from.lat, from.lng], [to.lat, to.lng]], {
        color: active ? "#10b981" : "#3f3f46",
        weight: active ? 4 : 2,
        dashArray: active ? "8, 8" : undefined,
      }).addTo(mapRef.current!);
      if (active) line.getElement()?.classList.add("animate-pulse");
      linesRef.current.push(line);
    });

    devices.forEach((device) => {
      const marker = L.circleMarker([device.lat, device.lng], {
        radius: 8, fillColor: device.online ? "#10b981" : "#ef4444", color: device.online ? "#10b981" : "#ef4444", fillOpacity: device.online ? 0.4 : 0.8,
      }).addTo(mapRef.current!);
      marker.on("click", () => onSelectDevice(device.id));
      markersRef.current.set(device.id, marker);
    });
  }, [devices, edges, activeRoute]);

  return <div ref={containerRef} className="h-full w-full rounded-xl overflow-hidden" />;
}