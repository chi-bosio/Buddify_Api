import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { CategoryRepository } from './category.repository';


@Injectable()
export class CategoryService implements OnApplicationBootstrap {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  /**
   * Se ejecuta automáticamente al iniciar la aplicación.
   * Crea las categorías iniciales si no existen.
   */
  async onApplicationBootstrap() {
    const categoriasIniciales = [
      'Deportes',
      'Música',
      'Viajes',
      'Tecnología',
      'Salud',
      'Educación',
      'Comida',
      'Arte',
      'Negocios',
      'Videojuegos',
    ];
    await this.categoryRepository.createIfNotExists(categoriasIniciales);
  }

  async getCategories() {
    return this.categoryRepository.findAll();
  }
  
}
