import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantController } from './controllers/restaurant.controller';
import { RestaurantService } from './services/restaurant.service';
import  RestaurantSchema from './schemas/restaurant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Restaurant', schema: RestaurantSchema }]),
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService]
})
export class RestaurantModule {}
