import { useState } from "react";
import { useDevices, DeviceType } from "@/context/DeviceContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

const deviceTypes: DeviceType[] = ["Server", "Router", "Camera", "Biometric"];

export function RegisterDeviceDialog() {
  const { addDevice } = useDevices();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [deviceType, setDeviceType] = useState<DeviceType>("Router");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    if (!name.trim() || isNaN(latitude) || isNaN(longitude)) return;

    addDevice({ name: name.trim(), deviceType, latitude, longitude });
    setName("");
    setLat("");
    setLng("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-[#10b981] text-black hover:bg-[#059669] font-semibold transition-colors">
          <Plus className="h-4 w-4" />
          Register New Node
        </Button>
      </DialogTrigger>
      
      <DialogContent className="border border-white/10 bg-[#161b22] text-gray-200 shadow-[0_0_40px_rgba(16,185,129,0.1)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-100">Register New Node</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="device-name" className="text-xs font-medium text-gray-400">Node Name</Label>
            <Input
              id="device-name"
              placeholder="e.g. South Gate CCTV"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 border-gray-700 bg-[#0d1117] text-gray-200 placeholder:text-gray-600 focus-visible:ring-emerald-500/50"
              required
            />
          </div>
          
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-gray-400">Device Type</Label>
            <Select value={deviceType} onValueChange={(v) => setDeviceType(v as DeviceType)}>
              <SelectTrigger className="h-10 border-gray-700 bg-[#0d1117] text-gray-200 focus:ring-emerald-500/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-gray-700 bg-[#161b22] text-gray-200">
                {deviceTypes.map((type) => (
                  <SelectItem key={type} value={type} className="hover:bg-white/5 focus:bg-white/5 focus:text-white">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="lat" className="text-xs font-medium text-gray-400">Latitude</Label>
              <Input
                id="lat"
                type="number"
                step="any"
                placeholder="22.5620"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="h-10 border-gray-700 bg-[#0d1117] text-gray-200 placeholder:text-gray-600 focus-visible:ring-emerald-500/50"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lng" className="text-xs font-medium text-gray-400">Longitude</Label>
              <Input
                id="lng"
                type="number"
                step="any"
                placeholder="88.4900"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="h-10 border-gray-700 bg-[#0d1117] text-gray-200 placeholder:text-gray-600 focus-visible:ring-emerald-500/50"
                required
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="mt-2 w-full bg-[#10b981] text-black hover:bg-[#059669] font-medium"
          >
            Deploy Node to Grid
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}