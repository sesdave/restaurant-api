import { ApiProperty } from '@nestjs/swagger';

export class RestaurantRespDto {
  @ApiProperty()
  _id: string;
  
  @ApiProperty()
  name: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;
}
