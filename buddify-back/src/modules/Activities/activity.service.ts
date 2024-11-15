/* import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class ActivityService {
  async uploadImageToCloudinary(file: Express.Multer.File): Promise<string> {
    try {
      const result: UploadApiResponse = await cloudinary.uploader.upload(
        file.path,
        {
          folder: 'activities',
        },
      );
      return result.secure_url;
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      throw new Error('Failed to upload image');
    }
  }

  async createActivity(
    data: CreateActivityDto,
    imageFile: Express.Multer.File,
  ) {
    const imageUrl = await this.uploadImageToCloudinary(imageFile);
  }
}
 */

// LISTO PARA HABILITAR CUANDO ESTE CLOUDINARY
