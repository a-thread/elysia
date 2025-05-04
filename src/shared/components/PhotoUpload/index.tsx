import React, { useRef, useState, ChangeEvent, DragEvent } from 'react';
import { FaTrash } from "react-icons/fa";
import PhotoService from './photoService';
import { useToast } from '@shared/components/Toast';
import { Button } from '@shared/components/Buttons';

interface PhotoUploadProps {
  imgUrl: string | undefined;
  onImgUrlChange: (url: string) => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ imgUrl, onImgUrlChange }) => {
  const [hover, setHover] = useState(false);
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
      console.error('Error uploading file:', error.message);
      toast.error('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!imgUrl) {
      onImgUrlChange('');
      return;
    }

    try {
      const response = await PhotoService.deletePhoto(imgUrl);
      if (response?.error) {
        toast.error('Failed to delete file. Please try again.');
        return;
      } else {
        onImgUrlChange('');
      }

    } catch (error: any) {
      console.error('Error removing file:', error.message);
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
      className={`relative w-full max-h-64 rounded-t-lg overflow-hidden ${!imgUrl?.length && 'rounded-b-lg'}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {imgUrl?.length ? (
        <>
          {/* Image */}
          <img
            src={imgUrl}
            alt="Uploaded"
            className="w-full h-full object-cover"
          />
          {/* Gray Overlay and Trash Icon on Hover */}
          {hover && (
            <div className="absolute inset-0 bg-gray-800/80 flex items-center justify-center">
              <button
                onClick={handleRemoveImage}
                className="text-white text-2xl hover:text-red-500"
              >
                <FaTrash
                  className="w-11 h-11 text-red-500 dark:text-red-600"
                  title="Delete Image"
                />
              </button>
            </div>
          )}
        </>
      ) : (
        <div
          className={`border-2 ${dragging ? 'border-blue-500 bg-leaf-green-50' : 'border-dashed border-gray-300'
            } rounded-t-lg p-6 flex flex-col items-center justify-center ${imgUrl ? 'max-h-64' : 'rounded-b-lg mb-4'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            Drag & drop a photo here, or click to upload.
          </p>
          <Button onClick={handleUploadClick} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload File'}
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
              onChange={(e: ChangeEvent<HTMLInputElement>) => onImgUrlChange(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
