import { useState } from "react";
import { AdvancedImage } from "@cloudinary/react";
import axios from "axios";

const MultipleImageUpload = () => {
  const [images, setImages] = useState<string[]>([]); // Explicitly specify type as string[]
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = e.target.files;
    setLoading(true); // Set loading before processing

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);
      formData.append("upload_preset", "testdemoapp");
      formData.append("cloud_name", "dtsxejgut");

      try {
        // Upload image to Cloudinary
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dtsxejgut/image/upload",
          formData
        );
        setImages((prevImages) => [...prevImages, response.data.secure_url]);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    setLoading(false);
  };

  return (
    <div>
      <input type="file" multiple onChange={handleImageUpload} />
      {loading ? (
        <p>Uploading...</p>
      ) : (
        images.map((image, index) => (
          <AdvancedImage
            key={index}
            cloudName="your_cloud_name"
            publicId={image}
            width="300"
            cldImg={undefined}
          />
        ))
      )}
    </div>
  );
};

export default MultipleImageUpload;
