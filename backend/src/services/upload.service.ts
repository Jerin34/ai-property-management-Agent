
import { Readable } from "node:stream";
import cloudinary from "../config/cloudinary.js";

interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
}

const uploadImage = (
    buffer: Buffer
): Promise<CloudinaryUploadResult> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "property-maintenance",
                resource_type: "image",
            },
            (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }

                if (!result) {
                    reject(new Error("Cloudinary returned no upload result."));
                    return;
                }

                resolve({
                    secure_url: result.secure_url,
                    public_id: result.public_id,
                });
            }
        );

        Readable.from(buffer).pipe(uploadStream);
    });
};

export default uploadImage;
