const cloudinary = require("../utils/cloudinaryConfig");
const streamifier = require("streamifier");

const fileUploadService = {
  /**
   * Upload file buffer to Cloudinary
   * @param {Buffer} buffer 
   * @param {Object} options 
   * @returns {Promise<Object>} 
   */
  uploadToCloudinary: (buffer, options = {}) => {
    return new Promise((resolve, reject) => {
      const {
        folder = "medical-reports",
        resourceType = "raw", 
        filename = `report_${Date.now()}`,
        userId = null,
      } = options;

     
      const publicId = userId 
        ? `${folder}/${userId}/${filename}`
        : `${folder}/${filename}`;

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          folder: folder,
          public_id: publicId,
        
          tags: options.tags || ["medical-report"],
        },
        (error, result) => {
          if (error) {
            console.error("❌ Cloudinary upload error:", error);
            reject(new Error(`Failed to upload file: ${error.message}`));
          } else {
            console.log("✅ File uploaded to Cloudinary:", result.secure_url);
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              format: result.format,
              size: result.bytes,
              createdAt: result.created_at,
              resourceType: result.resource_type,
            });
          }
        }
      );

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  },

  /**
   * Delete file from Cloudinary
   * @param {string} publicId 
   * @param {string} resourceType
   * @returns {Promise<Object>}
   */
  deleteFromCloudinary: async (publicId, resourceType = "raw") => {
    try {
      console.log(`🗑️ Deleting file from Cloudinary: ${publicId}`);
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
      console.log("File deleted from Cloudinary");
      return result;
    } catch (error) {
      console.error("❌ Cloudinary deletion error:", error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  },
};

module.exports = fileUploadService;