import React, { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import { FaUpload, FaRedo, FaCheck } from "react-icons/fa";

const ImageCropper = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [previewSrc, setPreviewSrc] = useState("");

  const fileInputRef = useRef(null);

  // Capture the cropping area in pixels
  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Handle image upload
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImageSrc(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Reset all values
  const resetAll = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setImageSrc(null);
    setPreviewSrc("");
  };

  // Generate cropped image
  const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const radians = (rotation * Math.PI) / 180;
    const sin = Math.abs(Math.sin(radians));
    const cos = Math.abs(Math.cos(radians));

    // Calculate new dimensions based on rotation
    const newWidth = image.width * cos + image.height * sin;
    const newHeight = image.width * sin + image.height * cos;

    canvas.width = newWidth;
    canvas.height = newHeight;

    // Move canvas center, rotate, and draw the image
    ctx.translate(newWidth / 2, newHeight / 2);
    ctx.rotate(radians);
    ctx.translate(-image.width / 2, -image.height / 2);
    ctx.drawImage(image, 0, 0);

    // Create cropped canvas
    const croppedCanvas = document.createElement("canvas");
    croppedCanvas.width = pixelCrop.width;
    croppedCanvas.height = pixelCrop.height;
    const croppedCtx = croppedCanvas.getContext("2d");

    croppedCtx.drawImage(
      canvas,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );


    return new Promise((resolve) => {
      croppedCanvas.toBlob((blob) => {
        resolve(URL.createObjectURL(blob));
      }, "image/png");
    });
  };

  // Generate preview
  const generatePreview = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
    setPreviewSrc(croppedImage);
  };

  return (
    <div className="container">
      <label className="upload-btn">
        <FaUpload className="icon" />
        Upload Image
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} hidden />
      </label>

      {imageSrc && (
        <div className="crop-container">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1} // Keep aspect ratio square
            cropShape="rect" // Allow free movement
            showGrid={true} // Show grid while cropping
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            restrictPosition={false} // Allows moving image freely
          />
        </div>
      )}

      <div className="controls">
        <label>Zoom</label>
        <input type="range" min="1" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} />
        <label>Rotate</label>
        <input type="range" min="-180" max="180" step="1" value={rotation} onChange={(e) => setRotation(parseInt(e.target.value))} />
      </div>

      <div className="buttons">
        <button className="btn reset" onClick={resetAll}>
          <FaRedo className="icon" /> Reset
        </button>
        <button className="btn preview" onClick={generatePreview}>
          <FaCheck className="icon" /> Preview
        </button>
      </div>

      {previewSrc && (
        <div className="profile-preview">
          <p>Profile Preview</p>
          <img src={previewSrc} alt="Profile Preview" className="profile-image" />
        </div>
      )}

      <style>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 30px;
          background-color: #ffffff;
          text-align: center;
        }
        
        .upload-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 20px;
          background: linear-gradient(135deg, #ff7eb3, #ff758c);
          color: white;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        }

        .upload-btn:hover {
          background: linear-gradient(135deg, #ff758c, #ff7eb3);
        }

        .icon {
          font-size: 18px;
        }

        .crop-container {
          width: 320px;
          height: 320px;
          position: relative;
          border-radius: 10px;
          overflow: hidden;
          background-color: #f0f0f0;
          border: 3px dashed #ccc;
          margin-top: 15px;
        }

        .controls {
          margin-top: 15px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .controls input[type='range'] {
          width: 200px;
          margin: 5px 0;
        }

        .buttons {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 15px;
          border: none;
          font-weight: bold;
          color: white;
          border-radius: 8px;
          cursor: pointer;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        }

        .reset {
          background: #ff4b4b;
        }

        .reset:hover {
          background: #ff1a1a;
        }

        .preview {
          background: #4CAF50;
        }

        .preview:hover {
          background: #2e7d32;
        }

        .profile-preview {
          margin-top: 20px;
        }

        .profile-image {
          width: 300px;
          height: 300px;
          border-radius: 10px;
          object-fit: cover;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
          background: white;
        }
          .reactEasyCrop_Contain {
    max-width: 100%;
    max-height: 100%;
    margin: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    object-fit: cover;
}
      `}</style>
    </div>
  );
};

export default ImageCropper;
