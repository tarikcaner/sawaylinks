"use client";

import { useState, useCallback } from "react";
import Cropper, { type Area } from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Loader2, ZoomIn } from "lucide-react";
import { useT } from "@/contexts/LanguageContext";

interface AvatarCropDialogProps {
  open: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedBlob: Blob) => void;
}

// Helper function to create cropped image
async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = new Image();
  image.crossOrigin = "anonymous";
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = reject;
    image.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d")!;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas blob creation failed"));
      },
      "image/jpeg",
      0.9
    );
  });
}

export default function AvatarCropDialog({
  open,
  imageSrc,
  onClose,
  onCropComplete,
}: AvatarCropDialogProps) {
  const t = useT();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  const onCropChange = useCallback((crop: { x: number; y: number }) => {
    setCrop(crop);
  }, []);

  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom);
  }, []);

  const onCropAreaComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedBlob);
    } catch {
      // error handled by parent
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("crop.title")}</DialogTitle>
        </DialogHeader>

        <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropAreaComplete}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <ZoomIn className="size-4 text-muted-foreground shrink-0" />
            <Label className="text-xs text-muted-foreground shrink-0 w-10">Zoom</Label>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(values) => setZoom(values[0])}
              className="flex-1"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={processing}>
            {t("crop.cancel")}
          </Button>
          <Button onClick={handleCrop} disabled={processing}>
            {processing ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {t("crop.processing")}
              </>
            ) : (
              t("crop.confirm")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
