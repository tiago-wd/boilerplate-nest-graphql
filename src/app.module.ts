import { ScheduleModule } from 'nest-schedule';
import { AuthService } from './auth/auth.service';
import { UserModule } from './user/user.module';
import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { configure as i18nConfigure } from 'i18n';
import { PubSub } from 'graphql-subscriptions';
import { MailerModule, HandlebarsAdapter } from '@nest-modules/mailer';
import { BillModule } from './bill/bill.module';

@Module({
  imports: [
    ScheduleModule.register(),
    TypeOrmModule.forRoot(),
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      path: "/graphql",
      playground: (process.env.ENVIRONMENT === 'dev') ? true : false,
      context: async ({ req, connection }) => {
        // subscriptions
        if (connection) {
          return { req: connection.context };
        }
        // queries and mutations
        return { req };
      },
      installSubscriptionHandlers: true,
    }),
    MailerModule.forRoot({
      transport: {
        service: 'Mailgun',
        auth: {
          user: 'postmaster@sandbox87747e9cc88b48e69e1861ebd715e947.mailgun.org',
          pass: '6d45605760e6681087c5305a1ab3d2a3'
        }
      },

      defaults: {
        from: '"Boilerplater" <no-reply@boiler.plate>',
      },
      template: {
        dir: './templates/emails',
        adapter: new HandlebarsAdapter(),
        options: {
          engine: 'handlebars'
        }
      }
    }),
    UserModule,
    BillModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: PubSub, useValue: new PubSub },
    AuthService
  ]
})
export class AppModule {

  static forRoot(options: { i18n: 'en-US' | 'pt-BR' }): DynamicModule {
    i18nConfigure({
      locales: ['en-US', 'pt-BR'],
      defaultLocale: options.i18n,
      directory: 'src/i18n'
    });

    return {
      module: AppModule
    };
  }

}
