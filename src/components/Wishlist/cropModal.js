import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImage";
import styles from "./CropperModal.module.css";

const CropperModal = ({ imageSrc, onCropDone, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Handle the completion of the crop
  const onCropComplete = useCallback((_, croppedArea) => {
    setCroppedAreaPixels(croppedArea);
  }, []);

  // Handle the Done button click
  const handleDone = async () => {
    if (!croppedAreaPixels) return; // Make sure there's a cropped area

    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, zoom);
      onCropDone(croppedBlob);
    } catch (error) {
      console.error("Error cropping the image:", error);
    }
  };

  return (
    <div style={{ display: "grid" }}>
      <div
        style={{
          height: "80%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Cropper
          className={styles.crop}
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1} // Square crop (you can change this)
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>
      <div
        className={styles.control}
        style={{
          height: "70%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
       top: "0px",
          bottom: "0px",
          left: "0px",
          right: "0px",
          zIndex: 1,
          gap: "10px",
        }}
      >
        <button className={styles.controlbutton} onClick={onCancel}>
          Cancel
        </button>
        <button className={styles.controlbutton} onClick={handleDone}>
          Crop
        </button>
      </div>
    </div>
  );
};

export default CropperModal;
