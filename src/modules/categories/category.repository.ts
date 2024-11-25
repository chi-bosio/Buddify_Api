import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryRepository {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}
    
    async createIfNotExists(categories: string[]): Promise<void> {
        for (const name of categories) {
            const exists = await this.categoryRepository.findOne({ where: { name } });
        if (!exists) {
            const category = this.categoryRepository.create({ name });
            await this.categoryRepository.save(category);
        }
        }
    }
    async findAll():Promise<Category[]>{
        return this.categoryRepository.find();
    }
}
