const cloudinary = require('cloudinary').v2;

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
      return res.status(400).json({ message: 'No file provided' });
    }

    console.log("DEBUG: File received, size:", req.file.size);

    // Check 2: Buffer se seedha Cloudinary par upload (Image ya Video)
    // Vercel pe file ka path nahi hota, is liye buffer use karenge
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'brozento_products',
          resource_type: 'auto', // Image aur Video dono ke liye
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    console.log("DEBUG: Cloudinary Upload Success:", result.secure_url);

    // Ab fs.unlinkSync ki zaroorat nahi, kyunki file kabhi save hui hi nahi

    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    // Asal error yahan print hoga
    console.error("DEBUG ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};