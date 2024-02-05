import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import * as request from 'supertest';
import { RestaurantController } from '../src/modules/restaurant/controllers/restaurant.controller';

// Mocked restaurant data for testing
const mockRestaurant = {
  _id: 'mocked-id',
  name: 'Cafe Delight',
  address: '123 Main St, New York, NY',
  latitude: 40.7112,
  longitude: -74.0055,
};

const mockRestaurantModel = {
  findById: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockRestaurant),
  }),
  create: jest.fn().mockResolvedValue(mockRestaurant),
  findByIdAndDelete: jest.fn().mockResolvedValue(mockRestaurant),
  find: jest.fn().mockResolvedValue([mockRestaurant]),
};

describe('RestaurantController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantController],
      providers: [
        {
          provide: getModelToken(RestaurantController.name),
          useValue: mockRestaurantModel,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/GET v1/restaurants/:id - Valid ID', () => {
    return request(app.getHttpServer())
      .get('/v1/restaurants/mocked-id')
      .expect(200)
      .expect(mockRestaurant);
  });

  it('/GET v1/restaurants/:id - Invalid ID', () => {
    return request(app.getHttpServer())
      .get('/v1/restaurants/invalid-id')
      .expect(404);
  });

  it('/POST v1/restaurants - Valid Input', () => {
    const newRestaurant = {
      name: 'New Restaurant',
      address: '456 Elm St, New York, NY',
      latitude: 40.7145,
      longitude: -74.0082,
    };

    return request(app.getHttpServer())
      .post('/v1/restaurants')
      .send(newRestaurant)
      .expect(201)
      .expect({
        restaurant: mockRestaurant,
        statusCode: 201,
      });
  });

  it('/POST v1/restaurants - Invalid Input', () => {
    // Omitting required field 'name'
    const invalidRestaurant = {
      address: '456 Elm St, New York, NY',
      latitude: 40.7145,
      longitude: -74.0082,
    };

    return request(app.getHttpServer())
      .post('/v1/restaurants')
      .send(invalidRestaurant)
      .expect(400);
  });

  it('/PUT v1/restaurants/:id - Valid Input', () => {
    const updatedRestaurant = {
      name: 'Updated Restaurant',
      address: '789 Oak St, New York, NY',
      latitude: 40.7165,
      longitude: -74.0092,
    };

    return request(app.getHttpServer())
      .put('/v1/restaurants/mocked-id')
      .send(updatedRestaurant)
      .expect(200)
      .expect(updatedRestaurant);
  });

  it('/PUT v1/restaurants/:id - Restaurant Not Found', () => {
    const updatedRestaurant = {
      name: 'Updated Restaurant',
      address: '789 Oak St, New York, NY',
      latitude: 40.7165,
      longitude: -74.0092,
    };

    return request(app.getHttpServer())
      .put('/v1/restaurants/non-existent-id')
      .send(updatedRestaurant)
      .expect(404);
  });

  it('/DELETE v1/restaurants/:id - Valid ID', () => {
    return request(app.getHttpServer())
      .delete('/v1/restaurants/mocked-id')
      .expect(200)
      .expect({ response: 'Restaurant deleted' });
  });

  it('/DELETE v1/restaurants/:id - Restaurant Not Found', () => {
    return request(app.getHttpServer())
      .delete('/v1/restaurants/non-existent-id')
      .expect(404);
  });

  it('/GET v1/restaurants - Valid Parameters', () => {
    const validParams = {
      city: 'New York',
      latitude: 40.7128,
      longitude: -74.0060,
      distance: 1000,
    };

    return request(app.getHttpServer())
      .get('/v1/restaurants')
      .query(validParams)
      .expect(200)
      .expect({ restaurants: [mockRestaurant] });
  });

  it('/GET v1/restaurants - Invalid Parameters', () => {
    const invalidParams = {
      // Missing 'latitude' parameter
      city: 'New York',
      longitude: -74.0060,
      distance: 1000,
    };

    return request(app.getHttpServer())
      .get('/v1/restaurants')
      .query(invalidParams)
      .expect(400);
  });

  it('/GET v1/restaurants - No Restaurants Found', () => {
    const noResultsParams = {
      city: 'Nonexistent City',
      latitude: 0,
      longitude: 0,
      distance: 1000,
    };

    return request(app.getHttpServer())
      .get('/v1/restaurants')
      .query(noResultsParams)
      .expect(200)
      .expect({ restaurants: [] });
  });
});
