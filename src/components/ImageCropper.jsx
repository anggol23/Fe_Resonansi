import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";

export default function ImageCropper({
  src,
  aspect = 16 / 9,
  initialZoom = 1,
  onCancel,
  onCropped,
  title = "Sesuaikan Gambar",
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(initialZoom);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [error, setError] = useState("");

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const getCroppedImg = async (imageSrc, cropPixels) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      // Upayakan CORS agar bisa toBlob
      image.crossOrigin = "anonymous";
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = cropPixels.width;
        canvas.height = cropPixels.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          image,
          cropPixels.x,
          cropPixels.y,
          cropPixels.width,
          cropPixels.height,
          0,
          0,
          cropPixels.width,
          cropPixels.height
        );
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Gagal menghasilkan gambar"));
            resolve(blob);
          },
          "image/jpeg",
          0.9
        );
      };
      image.onerror = () => reject(new Error("Tidak dapat memuat gambar (CORS?)"));
      image.src = imageSrc;
    });
  };

  const handleConfirm = async () => {
    setError("");
    try {
      if (!croppedAreaPixels) return;
      const blob = await getCroppedImg(src, croppedAreaPixels);
      onCropped(blob);
    } catch (e) {
      setError(e.message || "Terjadi kesalahan saat memotong gambar");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-3xl overflow-hidden">
        <div className="px-4 py-3 border-b dark:border-gray-700 flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <div className="relative w-full h-[50vh] sm:h-[60vh] bg-gray-100 dark:bg-gray-800">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            restrictPosition={false}
            zoomWithScroll
            objectFit="contain"
          />
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600 dark:text-gray-300">Zoom</label>
            <input
              type="range"
              min={0.5}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600">{error}</div>
          )}

          <div className="flex justify-end gap-2">
            <button onClick={onCancel} className="px-4 py-2 rounded border">Batal</button>
            <button onClick={handleConfirm} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Simpan</button>
          </div>
        </div>
      </div>
    </div>
  );
}
