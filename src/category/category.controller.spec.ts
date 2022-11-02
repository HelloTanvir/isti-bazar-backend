import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Model } from 'mongoose';
import * as sinon from 'sinon';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Category } from './schema';

describe('CategoryController', () => {
    let categoryController: CategoryController;
    let categoryService: CategoryService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [CategoryController],
            providers: [
                CategoryService,
                {
                    provide: getModelToken(Category.name),
                    useValue: sinon.createStubInstance(Model),
                },
            ],
        }).compile();

        categoryService = await moduleRef.resolve(CategoryService);
        categoryController = await moduleRef.resolve(CategoryController);
    });

    describe('findAll', () => {
        it('should return an array of categories', async () => {
            const result = [];
            jest.spyOn(categoryService, 'findAll').mockImplementation(async () => result);

            expect(await categoryController.findAll('userId')).toBe(result);
        });
    });

    describe('findOne', () => {
        it('should return a single category', async () => {
            const result = {} as Category;
            jest.spyOn(categoryService, 'findOne').mockImplementation(async () => result);

            expect(await categoryController.findOne('userId', 'categoryId')).toBe(result);
        });
    });

    describe('create', () => {
        it('should create a category', async () => {
            const result = {} as Category;
            jest.spyOn(categoryService, 'create').mockImplementation(async () => result);

            expect(await categoryController.create('userId', {} as Category)).toBe(result);
        });
    });

    describe('update', () => {
        it('should update a category', async () => {
            const result = {} as Category;
            jest.spyOn(categoryService, 'update').mockImplementation(async () => result);

            expect(await categoryController.update('userId', 'categoryId', {} as Category)).toBe(
                result
            );
        });
    });

    describe('delete', () => {
        it('should delete a category', async () => {
            const result = {} as Category;
            jest.spyOn(categoryService, 'delete').mockImplementation(async () => result);

            expect(await categoryController.delete('userId', 'categoryId')).toBe(result);
        });
    });
});
