"use client";

import { useState } from "react";
import { Heading } from "@/components/ui/heading";
import { ZoneAreaList } from "@/components/zone-areas/zone-areas-list";
import { ZoneAreaForm } from "@/components/forms/zone-area-form";
import { getZoneAreas, ZoneArea } from "@/app/actions/zone-areas";
import { toast } from "@/components/ui/use-toast";

interface ZoneAreasClientWrapperProps {
  initialZoneAreas: ZoneArea[];
}

export default function ZoneAreasClientWrapper({ initialZoneAreas }: ZoneAreasClientWrapperProps) {
  const [editingZoneArea, setEditingZoneArea] = useState<ZoneArea | undefined>(undefined);
  const [zoneAreas, setZoneAreas] = useState<ZoneArea[]>(initialZoneAreas);

  const handleEdit = (zoneArea: ZoneArea) => {
    setEditingZoneArea(zoneArea);
  };

  const handleFormSuccess = async () => {
    setEditingZoneArea(undefined); // Clear editing state
    // Re-fetch zone areas to update the list
    try {
      const updatedZoneAreas = await getZoneAreas();
      setZoneAreas(updatedZoneAreas);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh zone areas list.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title="Zone Areas"
          description="Manage the different zone areas for your lofts."
        />
      </div>
      {editingZoneArea ? (
        <ZoneAreaForm zoneArea={editingZoneArea} onSuccess={handleFormSuccess} />
      ) : (
        <ZoneAreaForm onSuccess={handleFormSuccess} />
      )}
      <ZoneAreaList zoneAreas={zoneAreas} onEdit={handleEdit} onRefresh={handleFormSuccess} />
    </>
  );
}
