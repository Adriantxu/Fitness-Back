// Nest Js
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Modules
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UtilsModule } from './utils/utils.module';

// Database
import { PrismaDbModule } from './prisma-db/prisma-db.module';
import { ExercisesModule } from './exercises/exercises.module';

@Module({
  imports: [
    AuthModule,
    PrismaDbModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    UtilsModule,
    ExercisesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
