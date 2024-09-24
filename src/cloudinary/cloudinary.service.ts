import { Injectable } from "@nestjs/common";
import { CloudinaryRepository } from "./cloudinary.repository";
import { UploadApiResponse, v2 } from "cloudinary";
import * as toStream from "buffer-to-stream";
import { Multer } from 'multer';

@Injectable()
export class CloudinaryService {
    constructor( 
        private cloudinaryRepository: CloudinaryRepository,
    ) {}

    async uploadImage(id: string, file: Express.Multer.File): Promise<UploadApiResponse> {
        const result = await new Promise<UploadApiResponse>((resolve, reject) => {
            const upload = v2.uploader.upload_stream(
                { 
                    resource_type: "auto", 
                    folder: "M4" 
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                },
            );
            toStream(file.buffer).pipe(upload);
        });
        await this.cloudinaryRepository.updateProductImage(id, result.secure_url);
        
        return result;
    }
    
}
