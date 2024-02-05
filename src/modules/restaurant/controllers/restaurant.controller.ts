// restaurant.controller.ts
import { Controller, Get, Post, Put, Delete, Query, Body, Param, NotFoundException, BadRequestException, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { RestaurantService } from '../services/restaurant.service';
import { RestaurantDto } from '../dto/restaurant.dto';
import { RestaurantRespDto } from '../dto/restaurant.response.dto';

@ApiTags('restaurants')
@Controller('v1/restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Successful response', type: RestaurantRespDto })
  async getRestaurant(@Param('id') id: string) {
    return this.restaurantService.getRestaurant(id);
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Successful Created', type: RestaurantRespDto })
  async addRestaurant(@Body(new ValidationPipe()) restaurantData: RestaurantDto) {
    return this.restaurantService.addRestaurant(restaurantData);
  }

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Successful Update', type: RestaurantRespDto })
  async updateRestaurant(@Param('id') id: string, @Body() updatedRestaurantData: RestaurantDto) {
    return this.restaurantService.updateRestaurant(id, updatedRestaurantData);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Restaurant deleted' })
  async deleteRestaurant(@Param('id') id: string) {
    return this.restaurantService.deleteRestaurant(id);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Successful response', type: RestaurantRespDto })
  async findRestaurants(
    @Query('city') city: string,
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('distance') distance: number,
    @Query('cuisine') cuisine?: string,
    @Query('priceRange') priceRange?: string,
    @Query('minRating') minRating?: number,
  ) {
    if (!city) {
      throw new NotFoundException('City not provided');
    }
  
    if (!latitude || !longitude) {
      throw new BadRequestException('Invalid coordinates. Both latitude and longitude are required.');
    }
  
    if (distance === undefined || distance < 0) {
      throw new BadRequestException('Invalid distance. Distance must be a non-negative value.');
    }

    return this.restaurantService.findRestaurants(city, latitude, longitude, distance, cuisine, priceRange, minRating);
  }
}
