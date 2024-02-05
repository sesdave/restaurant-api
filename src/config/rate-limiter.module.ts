// rate-limiter.module.ts
import { Module } from '@nestjs/common';
import { RateLimiterModule } from 'nestjs-rate-limiter';

@Module({
  imports: [
    RateLimiterModule.register({
      keyPrefix: 'myapp', // Customize prefix for request limit keys
      points: 3, // Number of requests allowed
      duration: 5, // Time window in seconds
    }),
  ],
})
export class RateLimiterConfigModule {}
