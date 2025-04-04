import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImage";
import styles from "./CropperModal.module.css";

const CropperModal = ({ imageSrc, onCropDone, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedArea) => {
    setCroppedAreaPixels(croppedArea);
  }, []);

  const handleDone = async () => {
    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
    onCropDone(croppedBlob);
  };

  return (
    <div style={{display:'grid'}}>
      <div style={{height:"80%",width:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}>
        <Cropper 
        className={styles.crop}
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
       
      </div>
      <div  className={styles.control} style={{height:"70%",width:'100%', display:'flex',position:'relative',right:'50%',zIndex:'1',gap:'10px',top:'250%'}} >
          <button className={styles.controlbutton} onClick={onCancel}>Cancel</button>
          <button className={styles.controlbutton}  onClick={handleDone}>Crop</button>
        </div>
    </div>
  );
};

export default CropperModal;
