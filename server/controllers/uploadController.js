const cloudinary = require("./../config/cloudinary")

const uploadController = async(req, res)=>{
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            })
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "evocodes_uploads"
        })

        res.status(200).json({
            success: true,
            message: "File uploaded successfully!",
            data: result
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error uploading file",
            error: err.message
        })
    }
}

module.exports = uploadController