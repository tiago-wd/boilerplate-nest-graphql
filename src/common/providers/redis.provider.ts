import { Tedis } from "tedis";

export const redisCon = {
  provide: 'REDIS',
  useFactory: () => {
    return new Tedis({
      host: "redis",
      port: 6379,
    });
  },
};