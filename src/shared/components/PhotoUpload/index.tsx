import React, { useRef, useState, ChangeEvent, DragEvent } from "react";
import { FaCamera, FaTrash } from "react-icons/fa";
import PhotoService from "./photoService";
import { useToast } from "@shared/components/Toast";
import { Button } from "@shared/components/Buttons";

interface PhotoUploadProps {
  imgUrl: string | undefined;
  onImgUrlChange: (url: string) => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  imgUrl,
  onImgUrlChange,
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);

      const publicUrl = await PhotoService.addPhoto(file);
      if (publicUrl !== null) {
        onImgUrlChange(publicUrl);
      }
    } catch (error: any) {
      console.error("Error uploading file:", error.message);
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!imgUrl) {
      onImgUrlChange("");
      return;
    }

    try {
      const response = await PhotoService.deletePhoto(imgUrl);
      if (response?.error) {
        toast.error("Failed to delete file. Please try again.");
        return;
      } else {
        onImgUrlChange("");
      }
    } catch (error: any) {
      console.error("Error removing file:", error.message);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input dialog
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true); // Highlight the drag area
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false); // Remove highlight when drag leaves
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false); // Remove highlight

    // Extract the dropped file
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div
      className={`group relative w-full h-64 rounded-t-xl overflow-hidden ${!imgUrl?.length && "rounded-b-xl"}`}
    >
      {imgUrl?.length ? (
        <>
          {/* Image */}
          <img
            src={imgUrl}
            alt="Uploaded"
            className="w-full h-full object-cover"
          />
          <button
            onClick={handleRemoveImage}
            title="Remove photo"
            aria-label="Remove photo"
            className="absolute right-3 top-3 w-9 h-9 rounded-full bg-black/45 hover:bg-black/65 flex items-center justify-center transition opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
          >
            <FaTrash className="w-3.5 h-3.5 text-white" />
          </button>
          <button
            onClick={handleUploadClick}
            disabled={uploading}
            className="absolute right-3.5 bottom-3.5 flex items-center gap-1.5 bg-black/55 hover:bg-black/70 text-white text-xs font-semibold px-3.5 py-2 rounded-full transition opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
          >
            <FaCamera className="w-3.5 h-3.5" />
            {uploading ? "Uploading..." : "Change Photo"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </>
      ) : (
        <div
          className={`border-2 ${
            dragging
              ? "border-leaf-green-500 bg-leaf-green-50"
              : "border-dashed border-gray-300"
          } rounded-t-xl p-6 flex flex-col items-center justify-center ${imgUrl ? "max-h-64" : "rounded-b-xl mb-4"}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            Drag & drop a photo here, or click to upload.
          </p>
          <Button onClick={handleUploadClick} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload File"}
          </Button>
          <input
            ref={fileInputRef} // Assign the ref to the hidden input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="mt-4 w-full">
            <input
              type="text"
              placeholder="Or paste an image URL"
              value={imgUrl}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onImgUrlChange(e.target.value)
              }
              className="border border-gray-300 rounded-lg p-2 w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
