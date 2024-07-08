import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Uploads a file to Cloudinary.
 * @param {string} localPath - The local path of the file to upload.
 * @returns {object|null} The response from Cloudinary or null if upload failed.
 */
const uploadCloudinary = async (localPath) => {
    try {
        // Check if localPath is provided
        if (!localPath) {
            console.error("Local path is not provided");
            return null;
        }

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(
            resume.tempfilePath
        );

        // File uploaded successfully
        console.log(`File uploaded successfully to Cloudinary: ${response.url}`);
        fs.unlinkSync(localPath)
        return response;

    } catch (error) {
        // Log the error
        console.error("Error uploading file to Cloudinary:", error);

        // Remove locally saved temporary file as the upload operation failed
        if (fs.existsSync(localPath)) {
            fs.unlinkSync(localPath);
        }

        return null;
    }
}

export { uploadCloudinary };
