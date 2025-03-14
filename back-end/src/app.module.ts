import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // Change to your database type
      host: 'localhost',
      port: 5432, // Change if needed
      username: 'user',
      password: 'pwd',
      database: 'lkm',
      entities: [User],
      synchronize: true, // Set to false in production
    }),
  ],
})
export class AppModule {}
