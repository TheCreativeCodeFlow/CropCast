const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image to Cloudinary
async function uploadToCloudinary(buffer, folder = 'cropcast') {
  try {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: folder,
          quality: 'auto',
          fetch_format: 'auto',
          transformation: [
            { width: 1024, height: 1024, crop: 'limit' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(new Error('Failed to upload image'));
          } else {
            resolve(result.secure_url);
          }
        }
      ).end(buffer);
    });
  } catch (error) {
    console.error('Cloudinary service error:', error);
    throw new Error('Image upload service unavailable');
  }
}

// Delete image from Cloudinary
async function deleteFromCloudinary(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image');
  }
}

// Get image transformations for different use cases
function getImageTransformations() {
  return {
    thumbnail: {
      width: 200,
      height: 200,
      crop: 'fill',
      quality: 'auto'
    },
    medium: {
      width: 500,
      height: 500,
      crop: 'limit',
      quality: 'auto'
    },
    large: {
      width: 1024,
      height: 1024,
      crop: 'limit',
      quality: 'auto'
    }
  };
}

// Generate transformed image URLs
function getTransformedUrl(publicId, transformation) {
  return cloudinary.url(publicId, transformation);
}

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  getImageTransformations,
  getTransformedUrl
};