import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoriesRepository } from './categories.repository';
import { AuthGuard } from '../auth/AuthGuard';
import { Category } from './Categories.entity';
import { CreateCategoryDto } from './CreateCategory.dto';


describe('CategoriesController', () => {
  let mockCategoriesController: CategoriesController;
  let mockCategoriesService: Partial<CategoriesService>;
  let mockCategoriesRepository: Partial<CategoriesRepository>;

  const mockCategory: Category = {
    id: "1234fs-234sd-24csfd-34sdfg", 
    name: "Lapices", 
    products: [], 
  };

  beforeEach(async () => {
    mockCategoriesService = {
      addCategory: (category: CreateCategoryDto) =>
        Promise.resolve(mockCategory), 

      getCategories: () =>
        Promise.resolve([mockCategory]), 
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        { provide: CategoriesService, useValue: mockCategoriesService },
        { provide: CategoriesRepository, useValue: mockCategoriesRepository },
      ],
    })
      .overrideGuard(AuthGuard) // Deshabilitar el AuthGuard
      .useValue({ canActivate: () => true }) // Sobreescribir para que siempre permita el acceso
      .compile();

    mockCategoriesController = module.get<CategoriesController>(CategoriesController);
  });

  it('Debería estar definido el controlador', () => {
    expect(mockCategoriesController).toBeDefined();
  });

  it("getCategories() debería devolver un array de categorías", async () => {
    const categories = await mockCategoriesController.getCategories();

    expect(categories).toEqual([{
      id: "1234fs-234sd-24csfd-34sdfg",
      name: "Lapices",
      products: [] 
    }]);
  });

  
  it("addCategory() debería crear una categoría", async () => {
    const category = await mockCategoriesController.addCategory({ name: "Lapices" }); 
    expect(category).toEqual({
      id: "1234fs-234sd-24csfd-34sdfg",
      name: "Lapices",
      products: [] 
    });
  });
});
