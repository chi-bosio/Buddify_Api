/* import { 
  Controller, 
  Post, 
  Get, 
  Patch, 
  Delete, 
  Param, 
  Body, 
  UploadedFile, 
  UseInterceptors 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  // Crear actividad
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createActivity(
    @Body() createActivityDto: CreateActivityDto,
    @UploadedFile() imageFile: Express.Multer.File,
  ) {
    return this.activityService.createActivity(createActivityDto, imageFile);
  }

  // Obtener todas las actividades
  @Get()
  async getAllActivities() {
    return this.activityService.getAllActivities();
  }

  // Obtener actividad por ID
  @Get(':id')
  async getActivityById(@Param('id') id: string) {
    return this.activityService.getActivityById(id);
  }

  // Actualizar actividad
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updateActivity(
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
    @UploadedFile() imageFile?: Express.Multer.File,
  ) {
    return this.activityService.updateActivity(id, updateActivityDto, imageFile);
  }

  // Eliminar actividad
  @Delete(':id')
  async deleteActivity(@Param('id') id: string) {
    return this.activityService.deleteActivity(id);
  }
}*/

/* LISTO PARA HABILITAR CUANDO SE IMPLEMENTE CLOUDINARY */
