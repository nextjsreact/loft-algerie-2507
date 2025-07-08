"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react"; // Import Pencil icon
import { deleteZoneArea, ZoneArea } from "@/app/actions/zone-areas";
import { toast } from "@/components/ui/use-toast";

interface ZoneAreaListProps {
  zoneAreas: ZoneArea[];
  onEdit: (zoneArea: ZoneArea) => void;
  onRefresh: () => void; // Add onRefresh prop
}

export function ZoneAreaList({ zoneAreas, onEdit, onRefresh }: ZoneAreaListProps) {
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this zone area?")) {
      try {
        await deleteZoneArea(id);
        toast({
          title: "Success",
          description: "Zone area deleted successfully.",
        });
        onRefresh(); // Call onRefresh after successful delete
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete zone area.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Existing Zone Areas</h2>
      {zoneAreas.length === 0 ? (
        <p>No zone areas created yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {zoneAreas.map((zoneArea) => (
              <TableRow key={zoneArea.id}>
                <TableCell className="font-medium">{zoneArea.name}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(zoneArea)} // Call onEdit
                    className="mr-2" // Add some margin
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(zoneArea.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
