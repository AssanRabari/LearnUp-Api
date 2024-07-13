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

import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: 'https://winning-platypus-43852.upstash.io',
  token: 'AatMAAIncDE2ZjE4ZGE4MjNmYWY0OTA3OTY3MGU3NmYyOWI3Y2U2ZnAxNDM4NTI',
})