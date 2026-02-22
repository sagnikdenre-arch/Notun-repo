import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Device } from "@/context/DeviceContext";

interface MapViewProps {
  devices: Device[];
  selectedDeviceId: string | null;
  onSelectDevice: (id: string) => void;
}

export function MapView({ devices, selectedDeviceId, onSelectDevice }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<string, L.CircleMarker>>(new Map());

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current, {
      center: [40.72, -74.0],
      zoom: 13,
      zoomControl: false,
    });

    L.control.zoom({ position: "bottomright" }).addTo(mapRef.current);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
    }).addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    devices.forEach((device) => {
      const marker = L.circleMarker([device.latitude, device.longitude], {
        radius: device.id === selectedDeviceId ? 10 : 7,
        fillColor: device.online ? "#10b981" : "#ef4444",
        color: device.id === selectedDeviceId ? "#fff" : "transparent",
        weight: device.id === selectedDeviceId ? 2 : 0,
        fillOpacity: 0.9,
      }).addTo(mapRef.current!);

      marker.bindTooltip(device.name, {
        className: "leaflet-dark-tooltip",
        direction: "top",
        offset: [0, -8],
      });

      marker.on("click", () => onSelectDevice(device.id));
      markersRef.current.set(device.id, marker);
    });
  }, [devices, selectedDeviceId, onSelectDevice]);

  useEffect(() => {
    if (!mapRef.current || !selectedDeviceId) return;
    const device = devices.find((d) => d.id === selectedDeviceId);
    if (device) {
      mapRef.current.flyTo([device.latitude, device.longitude], 15, { duration: 0.8 });
    }
  }, [selectedDeviceId, devices]);

  return (
    <>
      <style>{`
        .leaflet-dark-tooltip {
          background: hsl(220 30% 10% / 0.9);
          border: 1px solid hsl(215 20% 22%);
          color: hsl(210 20% 92%);
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          padding: 4px 8px;
          border-radius: 4px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }
        .leaflet-dark-tooltip::before {
          border-top-color: hsl(215 20% 22%) !important;
        }
      `}</style>
      <div ref={containerRef} className="h-full w-full rounded-lg" />
    </>
  );
}
