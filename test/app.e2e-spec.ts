import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AuthGuard } from '../src/auth/AuthGuard';
import { RolesGuard } from '../src/auth/RolesGuard';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideGuard(AuthGuard)
    .useValue({
      canActivate: () => true, // Simulamos que el guard siempre permite el acceso
    })
    .overrideGuard(RolesGuard)
    .useValue({
      canActivate: () => true, // Simulamos que el RolesGuard permite el acceso
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

    it('Get /users/ regresa un array de usuarios con un status 200 de ok)', async () => {
      const response = await request(app.getHttpServer()).get('/users').query({ page: 1, limit: 5 });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
      expect(response.body).toHaveProperty('users');
      expect(Array.isArray(response.body.users)).toBe(true);
  });

    it("Get /users/:id regresa un objeto con un usuario con un status 200 de ok", async () => {
      const req = await request(app.getHttpServer()).get("/users/feb3a09f-d8f8-4d41-ac77-d3f48f65c633"); // un id de un usuario registrado anteriormente
      expect(req.status).toBe(200);
      expect(req.body).toBeInstanceOf(Object);
    });

    it("get /users/:id arroja un error si el id no es un UUID", 
      async () => {
        const req = await request(app.getHttpServer()).get(`/users/1234567890`);
        expect(req.status).toBe(400); 
        expect(req.body.message).toBe('Validation failed (uuid is expected)');
    })

    it("get /users/:id arroja un error NotFoundException si el usuario no existe con el mensaje Usuario no encontrado", 
      async () => {
        const id = "feb3a09f-d8f8-4d41-ac77-d3f48f65c634"; // un id incorrecto por un valor de un usuario registrado anteriormente
        const req = await request(app.getHttpServer()).get(`/users/${id}`);
        expect(req.status).toBe(404);
        expect(req.body.message).toBe(`Usuario con id ${id} no encontrado`);      
    })

    it('Get /products/ regresa un array de productos con un status 200 de ok)', async () => {
      const response = await request(app.getHttpServer()).get('/products').query({ page: 1, limit: 5 });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
      expect(response.body).toHaveProperty('products');
      expect(Array.isArray(response.body.products)).toBe(true);
  });

  it("Get /products/:id regresa un objeto con un producto con un status 200 de ok", async () => {
    const req = await request(app.getHttpServer()).get("/products/2a36b8a2-fba5-469d-90ce-b98c3d9b5630"); // un id de un producto registrado anteriormente
    expect(req.status).toBe(200);
    expect(req.body).toBeInstanceOf(Object);
  });

  it("get /products/:id arroja un error si el id no es un UUID", 
    async () => {
      const req = await request(app.getHttpServer()).get(`/products/1234567890`);
      expect(req.status).toBe(400); 
      expect(req.body.message).toBe('Validation failed (uuid is expected)');
  })

  it("get /products/:id arroja un error NotFoundException si el producto no existe con el mensaje Producto no encontrado", 
    async () => {
      const id = "2a36b8a2-fba5-469d-90ce-b98c3d9b5631"; // un id incorrecto por un valor de un producto registrado anteriormente
      const req = await request(app.getHttpServer()).get(`/products/${id}`);
      expect(req.status).toBe(404);
      expect(req.body.message).toBe(`Producto con id ${id} no encontrado`);      
  })

  it("Post /products arroja un error BadRequestException si el producto ya existe", 
    async () => {
      const product = { name: "Iphone 15", price: 999, description: "Nuevo Iphone 15", stock: 10, categoryId: "84e8f918-df87-4073-83d7-7cd8ebe17c8d"}; // un id de una categoria registrada anteriormente
      const req = await request(app.getHttpServer()).post("/products").send(product); 
      expect(req.status).toBe(400); 
      expect(req.body.message).toBe(`El producto con el nombre '${product.name}' ya existe.`);
  });
  

  it("Get /orders/:id regresa un objeto con una orden con un status 200 de ok", async () => {
    const req = await request(app.getHttpServer()).get("/orders/a36518f2-f133-41ad-958b-9f11387f7f98"); // un id de una orden registrada anteriormente
    expect(req.status).toBe(200);
    expect(req.body).toBeInstanceOf(Object);
  });

  it("get /orders/:id arroja un error si el id no es un UUID", 
    async () => {
      const req = await request(app.getHttpServer()).get(`/orders/1234567890`);
      expect(req.status).toBe(400); 
      expect(req.body.message).toBe('Validation failed (uuid is expected)');
  })

  it("get /orders/:id arroja un error NotFoundException si la orden no existe con el mensaje Orden no encontrada", 
    async () => {
      const id = "a36518f2-f133-41ad-958b-9f11387f7f99"; // un id incorrecto por un valor de una orden registrada anteriormente
      const req = await request(app.getHttpServer()).get(`/orders/${id}`);
      expect(req.status).toBe(404);
      expect(req.body.message).toBe(`Orden con el id ${id} no encontrada`);      
  })


});
