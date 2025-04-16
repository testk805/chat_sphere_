import { useState } from "react";
import axios from "axios";

export default function ImageUpload() {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [resizedPreview, setResizedPreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!image) return alert("Please select an image first!");

        const formData = new FormData();
        formData.append("image", image);

        try {
            const response = await axios.post("https://chat-sphere-tkbs.onrender.com/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                responseType: "blob",
            });

            const blob = new Blob([response.data], { type: "image/png" });
            setResizedPreview(URL.createObjectURL(blob));
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload image!");
        }
    };

    return (
        <div className="container">
            <h2>Image Upload & Resize</h2>
            <input type="file" onChange={handleImageChange} className="file-input" />
            <button onClick={handleUpload} className="upload-btn">Upload & Resize</button>

            <div className="image-preview-container">
                {preview && (
                    <div className="image-box">
                        <h3>Original Image:</h3>
                        <img src={preview} alt="Original" className="image-preview" />
                    </div>
                )}

                {resizedPreview && (
                    <div className="image-box">
                        <h3>Resized 600x600 Image:</h3>
                        <img src={resizedPreview} alt="Resized" className="image-preview resized" />
                    </div>
                )}
            </div>
        </div>
    );
}
