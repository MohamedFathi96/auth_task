import { Module } from '@nestjs/common';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { AuthModule } from '@modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@/common/prisma/prisma.module';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { GlobalExceptionFilter } from '@/common/exceptions/global-exception.filter';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
