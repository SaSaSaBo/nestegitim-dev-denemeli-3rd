import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import * as config from 'config';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptor/response/response.interceptor';
import { LoggingInterceptor } from './common/interceptor/logging/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggingInterceptor(), new ResponseInterceptor() );

  app.use(cors());
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Veri tipi degisimi yapabilmemiz icin aktif edildi.
      disableErrorMessages: false, // Hata mesajlarinda anlamli metin donmesini saglar
      whitelist: true, // Whitelist acmazsak asagidaki iki kurali kullanamayiz.
      forbidNonWhitelisted: true, //  Alttaki kurali yazmama izin veriyor
      forbidUnknownValues: true, // POST,GET,PATCH,DELETE bilinmeyten deger gelmesini engelller.
    }));


  await app.listen(config.port).then(()=>{

    console.log('NODE ENV: ', process.env.NODE_ENV);
    console.log('PORT:', config.port);
  });
}

bootstrap(); 

/*
  This script enables the initialisation and configuration of a Node.js application. The code follows these steps:
  1. Importing Modules and Libraries: First, the required NestJS modules (`NestFactory`, `ValidationPipe`) and external libraries (`cors`, `config`) are imported. These modules and libraries provide NestJS application creation, CORS support, structural validation and global interceptors.
  2. Application Creation and Configuration: An `AppModule` is created using the `NestFactory.create()` method. This forms the basis of the NestJS application.
  3. Using Global Interceptors: `app.useGlobalInterceptors()` is used to implement the `LoggingInterceptor` and `ResponseInterceptor` global interceptors. These interceptors are used to monitor and regulate incoming requests and outgoing responses.
  4. Configuring CORS (Cross-Origin Resource Sharing) Settings: CORS support is enabled and configured with `app.use(cors())` and `app.enableCors()`. This specifies how the application accepts requests from different origins.
  5. Using Global Pipes: With `app.useGlobalPipes()`, `ValidationPipe` is implemented for structural validation. This checks the correctness of the incoming data and transforms it when necessary.
  6. Application Listening and Port Management: With `app.listen()`, the application starts listening on the specified port. When the listening process starts successfully, the port number and the working environment (`NODE_ENV`) are printed to the console.
  This code provides the basic structure required to start a RESTful API or web application configured with NestJS.
*/