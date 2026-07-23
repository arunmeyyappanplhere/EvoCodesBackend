const cloudinary = require("./../config/cloudinary")

const uploadController = async(req, res)=>{
    try {
        console.log("Upload request received");
        console.log("File info:", req.file);
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
                details: "Please select a file to upload"
            })
        }

        console.log("Uploading to Cloudinary...");
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "evocodes_uploads",
            resource_type: "auto"
        })

        console.log("Upload successful:", result);
        res.status(200).json({
            success: true,
            message: "File uploaded successfully!",
            data: result
        })
    } catch (err) {
        console.error("Upload error (full):", JSON.stringify(err, null, 2));
        console.error("Upload error (raw object):", err);
        return res.status(500).json({
            success: false,
            message: "Error uploading file",
            error: err.message,
            cloudinaryDetails: err.error || null,
            http_code: err.http_code || null,
            details: err.http_code === 403 ? "Cloudinary authentication failed. Check your API credentials." : err.message
        })
    }
}

module.exports = uploadController