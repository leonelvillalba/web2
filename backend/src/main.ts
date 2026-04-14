import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS para que el frontend se comunique (HTML estático o hosting)
  app.enableCors({
    origin: true, // Acepta cualquier origen (dev + producción)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Prefijo global /api
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🏛️ Sanctuary AI Backend corriendo en http://localhost:${port}`);
}
bootstrap();
