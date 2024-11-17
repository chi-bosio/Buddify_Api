/* import { Controller, Post, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createActivity(
    @Body() createActivityDto: CreateActivityDto,
    @UploadedFile() imageFile: Express.Multer.File,
  ) {
    return this.activityService.createActivity(createActivityDto, imageFile);
  }
} */

// LISTO PARA HABILITAR CUANDO ESTE CLOUDINARY
