import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://huudung038:1@clusterhuudung.z5tdrft.mongodb.net/')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
