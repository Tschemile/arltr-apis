import { CacheModule } from "@nestjs/common";
import * as redisStore from "cache-manager-redis-store";
import type { RedisClientOptions } from "redis";

const connectCache = CacheModule.register<RedisClientOptions>({
  store: redisStore,
  isGlobal: true,
  url: process.env.CACHE_URL,
})

export default connectCache