import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instructor } from 'src/entities/instructor.entity';
import { Student } from 'src/entities/student.entity';
import { User } from 'src/entities/user.entity';
console.log('Entities path:', __dirname + '/../**/*.entity{.ts,.js}'); // 🔥 Ajout ici pour debug

@Module({
  imports: [
    // Cette configuration initialise la connexion à la base de données en utilisant les configurations asynchrones de ConfigService.
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [Student,User,Instructor,__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: process.env.NODE_ENV === 'development',
        logging: process.env.NODE_ENV === 'development',
      }),
    }),
  ],
})
export class DatabaseModule {}
