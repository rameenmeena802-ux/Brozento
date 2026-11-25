const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadImage = async (req, res) => {
  try {
    // Check 1: Kya file receive hui?
    if (!req.file) {
      console.log("DEBUG: No file received by Multer");
      return res.status(400).json({ message: 'No file provided' }); // Message update kiya hai
    }

    console.log("DEBUG: File received at path:", req.file.path);

    // Check 2: Cloudinary par upload karein (Image ya Video)
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'brozento_products',
      resource_type: 'auto', // YEH LINE ADD KI HAI (Image aur Video dono ke liye)
    });

    console.log("DEBUG: Cloudinary Upload Success:", result.secure_url);

    // File delete karein
    fs.unlinkSync(req.file.path);

    res.json({ imageUrl: result.secure_url }); // Ab yeh image aur video dono ka URL return karega
  } catch (error) {
    // Asal error yahan print hoga
    console.error("DEBUG ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};