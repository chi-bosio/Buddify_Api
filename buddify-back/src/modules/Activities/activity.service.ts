/* import { Injectable, NotFoundException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaService } from 'src/prisma/prisma.service'; // Suponiendo que uses Prisma
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ActivityService {
  constructor(private readonly prisma: PrismaService) {}

  // Subir imagen a Cloudinary
  private async uploadImageToCloudinary(file: Express.Multer.File): Promise<string> {
    if (!file) return null;
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'activities',
      });
      return result.secure_url;
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      throw new Error('Failed to upload image');
    }
  }

  // Crear actividad
  async createActivity(createActivityDto: CreateActivityDto, imageFile: Express.Multer.File) {
    const imageUrl = await this.uploadImageToCloudinary(imageFile);
    const activity = await this.prisma.activity.create({
      data: { ...createActivityDto, image: imageUrl },
    });
    return activity;
  }

  // Obtener todas las actividades
  async getAllActivities() {
    return this.prisma.activity.findMany();
  }

  // Obtener actividad por ID
  async getActivityById(id: string) {
    const activity = await this.prisma.activity.findUnique({ where: { id } });
    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }
    return activity;
  }

  // Actualizar actividad
  async updateActivity(id: string, updateActivityDto: UpdateActivityDto, imageFile?: Express.Multer.File) {
    const activity = await this.prisma.activity.findUnique({ where: { id } });
    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }

    const imageUrl = imageFile ? await this.uploadImageToCloudinary(imageFile) : activity.image;
    return this.prisma.activity.update({
      where: { id },
      data: { ...updateActivityDto, image: imageUrl },
    });
  }

  // Eliminar actividad
  async deleteActivity(id: string) {
    const activity = await this.prisma.activity.findUnique({ where: { id } });
    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }

    // Podrías agregar lógica para eliminar la imagen de Cloudinary aquí si es necesario

    return this.prisma.activity.delete({ where: { id } });
  }
}

 */

// LISTO PARA HABILITAR CUANDO ESTE CLOUDINARY
