import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"


const uploadOnCloudinary = async (localFilePath) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    if (localFilePath === null) {
        console.log("local file not exists");
    }

    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        console.log("File is uploaded on cloudinary", response.url);
        fs.unlinkSync(localFilePath)
        return response.url
    } catch (error) {
        fs.unlinkSync(localFilePath)
        console.log("cloudinary error", error)
        return null
    }
}

const destoyImage = async (public_id) => {
    // .destroy(public_id, options).then(callback);
    console.log("destoyImage", public_id);

    try {
        const response = await cloudinary.uploader.destroy(public_id, {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        })
        console.log("File is deleted on cloudinary",);
        return response
    } catch (error) {
        console.log(error);
        return null
    }
}

const getPublicIdFromUrl = (url) => {
    let parts = url.split("/")
    let public_id = parts[parts.length - 1].split(".")[0]
    return public_id
}


export { uploadOnCloudinary, getPublicIdFromUrl, destoyImage }
