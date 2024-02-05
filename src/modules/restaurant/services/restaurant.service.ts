import { Injectable, Logger, NotFoundException, BadRequestException, InternalServerErrorException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant } from '../interfaces/restaurant.interface';
import { RestaurantDto } from '../dto/restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(@InjectModel('Restaurant') private readonly restaurantModel: Model<Restaurant>) {}
  private readonly logger = new Logger(RestaurantService.name);

  async getRestaurant(id: string): Promise<Restaurant> {
    try {
      const restaurant = await this.restaurantModel.findById(id).exec();

      if (!restaurant) {
        throw new NotFoundException('Restaurant not found');
      }

      return this.formatSingleRestaurant(restaurant);
    } catch (error) {
      this.logger.error(`Error fetching restaurant with ID ${id}`, error.stack);
      throw new NotFoundException('Restaurant not found');
    }
  }

  async addRestaurant(restaurantData: RestaurantDto): Promise<any> {
    try {
      const newRestaurant = await this.restaurantModel.create(restaurantData);
      this.logger.log(`Restaurant added: ${newRestaurant._id}`);
      return { restaurant: this.formatSingleRestaurant(newRestaurant), statusCode: HttpStatus.CREATED };
    } catch (error) {
      this.logger.error(`Error adding restaurant: ${error.message}`, error.stack);
      // Handle specific database errors
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        // Validation error from class-validator
        throw new BadRequestException(error.message);
      }

      // Handle other unexpected errors
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async updateRestaurant(id: string, updatedRestaurantData: RestaurantDto): Promise<Restaurant> {
    try {
      const existingRestaurant = await this.restaurantModel.findById(id).exec();

      if (!existingRestaurant) {
        throw new NotFoundException('Restaurant not found');
      }

      existingRestaurant.set(updatedRestaurantData);
      const updatedRestaurant = await existingRestaurant.save();

      return this.formatSingleRestaurant(updatedRestaurant);
    } catch (error) {
      // Handle specific database errors
      if (error.name === 'CastError') {
        throw new NotFoundException('Invalid restaurant ID');
      }

      // Handle other unexpected errors
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async deleteRestaurant(id: string): Promise<any> {
    try {
      const deletedRestaurant = await this.restaurantModel.findByIdAndDelete(id).exec();
  
      if (!deletedRestaurant) {
        throw new NotFoundException('Restaurant not found');
      }
  
      return { response: 'Restaurant deleted' };
    } catch (error) {
      this.logger.error(`Error Deleting restaurant with ID ${id}`, error.stack);
      throw new NotFoundException('Restaurant not found');
    }
  }
  

  async findRestaurants(city: string, latitude: number, longitude: number, distance: number, cuisine: string | null, priceRange: string | null, minRating: number | null | undefined): Promise<any> {
    try {

        const filter: any = {
          address: { $regex: new RegExp(city, 'i') },
          location: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [longitude, latitude],
              },
              $maxDistance: distance,
            },
          },
        };
    
        if (cuisine) {
          filter.cuisine = cuisine; // Add cuisine filter
        }
    
        if (priceRange) {
          filter.priceRange = priceRange; // Add price range filter
        }
    
        if (minRating !== undefined) {
          filter.rating = { $gte: minRating }; // Add minimum rating filter
        }
    
        const restaurants = await this.restaurantModel.find(filter).select({ location: 0, __v: 0 }).exec();
    

        const formattedRestaurants: Restaurant[] = this.formatRestaurants(restaurants);

        return { restaurants: formattedRestaurants };

      } catch (error) {
        // Handle specific database errors
        if (error.name === 'CastError') {
          throw new BadRequestException('Invalid input parameters');
        }

        // Handle other unexpected errors
        throw new InternalServerErrorException('Internal Server Error');
      }
  }

  private formatRestaurants(restaurants: any[]): Restaurant[] {
    return restaurants.map(restaurant => ({
      _id: restaurant._id,
      name: restaurant.name,
      address: restaurant.address,
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
    }));
  }

  private formatSingleRestaurant(restaurant: any): Restaurant {
    return {
      _id: restaurant._id,
      name: restaurant.name,
      address: restaurant.address,
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
    };
  }
}
