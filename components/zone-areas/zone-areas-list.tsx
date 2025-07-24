"use client"

import { useTranslation } from "@/lib/i18n/context";
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
  const { t } = useTranslation();
  
  const handleDelete = async (id: string) => {
    if (confirm(t('zoneAreas.deleteConfirm'))) {
      try {
        await deleteZoneArea(id);
        toast({
          title: t('common.success'),
          description: t('zoneAreas.deleteSuccess'),
        });
        onRefresh(); // Call onRefresh after successful delete
      } catch (error) {
        toast({
          title: t('common.error'),
          description: t('zoneAreas.deleteError'),
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">{t('zoneAreas.existingZoneAreas')}</h2>
      {zoneAreas.length === 0 ? (
        <p>{t('zoneAreas.noZoneAreasYet')}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('zoneAreas.name')}</TableHead>
              <TableHead className="text-right">{t('zoneAreas.actions')}</TableHead>
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
