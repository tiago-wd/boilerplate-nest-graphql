import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path'
import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule.forRoot({ i18n: 'pt-BR' }),
  );

  app.useStaticAssets(join(__dirname, 'public'));
  app.use(cors());
  await app.listen(3000);
}
bootstrap();
