
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import '../config/cloudinary'; // Ensure config is loaded

export const uploadToCloudinary = (fileBuffer: Buffer): Promise<string> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result?.secure_url as string);
                }
            }
        );
        const stream = Readable.from(fileBuffer);
        stream.pipe(uploadStream);
    });
};
