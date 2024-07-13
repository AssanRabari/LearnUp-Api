import { Redis } from "ioredis";
import createClient from "ioredis"; // Changed to default import
require("dotenv").config();

interface UpstashRedisConfig {
  url: string;
  password?: string;
}

const redisClient = async (): Promise<Redis> => {
  if (!process.env.REDIS_URL) {
    throw new Error("Missing REDIS_URL environment variable");
  }

  const config: UpstashRedisConfig = {
    url: process.env.REDIS_URL.replace(/^https?:\/\//, ""),
  };

  if (process.env.REDIS_UPSTASH_TOKEN) {
    config.password = process.env.REDIS_UPSTASH_TOKEN;
  }

  try {
    const client = new createClient(config);
    await client.connect();
    console.log("Redis connected");
    return client;
  } catch (error) {
    console.error("Redis connection error:", error);
    throw error;
  }
};

export const redis: Promise<Redis> = redisClient();


// import { Redis } from 'ioredis';
// require('dotenv').config();

// const redisClient = () => {
//   if (process.env.REDIS_URL) {
//     console.log('Redis connected');
//     return new Redis(process.env.REDIS_URL);
//   }
//   throw new Error('Redis connection failed');
// };

// export const redis = redisClient();

// export const redis = new Redis(redisClient());
// import { Redis } from '@upstash/redis'

// export const redis = new Redis({
//   url: 'https://winning-platypus-43852.upstash.io',
//   token: 'AatMAAIncDE2ZjE4ZGE4MjNmYWY0OTA3OTY3MGU3NmYyOWI3Y2U2ZnAxNDM4NTI',
// })
