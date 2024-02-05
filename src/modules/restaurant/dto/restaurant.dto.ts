// restaurant.dto.ts
import { IsNotEmpty, IsNumber, IsString, IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RestaurantDto {
  @ApiProperty()
  @IsDefined({message: "Name is required"})
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @IsString({ message: 'Name should be a string' })
  name: string;

  @ApiProperty()
  @IsDefined({message: "Address is required"})
  @IsNotEmpty({ message: 'Address cannot be empty' })
  @IsString({ message: 'Address should be a string' })
  address: string;

  @ApiProperty()
  @IsDefined({message: "Latitude is required"})
  @IsNotEmpty({ message: 'Latitude cannot be empty' })
  @IsNumber({}, { message: 'Latitude should be a number' })
  latitude: number;

  @ApiProperty()
  @IsDefined({message: "Longitude is required"})
  @IsNotEmpty({ message: 'Longitude cannot be empty' })
  @IsNumber({}, { message: 'Longitude should be a number' })
  longitude: number;
}
