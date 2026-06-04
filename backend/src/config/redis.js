const redis = require('redis');

let redisClient = null;

const connectRedis = async () => {
  const url = process.env.REDIS_URL;
  if (!url || url === 'redis://localhost:6379') {
    console.warn('Redis not configured. Caching disabled.');
    return null;
  }

  try {
    redisClient = redis.createClient({ url });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err.message);
      redisClient.quit();
      redisClient = null;
    });

    redisClient.on('connect', () => {
      console.log('Redis Connected');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('Redis connection failed. Continuing without Redis cache:', error.message);
    if (redisClient) redisClient.quit();
    redisClient = null;
    return null;
  }
};

const getRedisClient = () => redisClient;

const cacheData = async (key, data, ttl = 3600) => {
  if (!redisClient) return null;
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(data));
  } catch (error) {
    console.error('Redis cache set error:', error.message);
  }
};

const getCachedData = async (key) => {
  if (!redisClient) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Redis cache get error:', error.message);
    return null;
  }
};

const clearCache = async (pattern) => {
  if (!redisClient) return;
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    console.error('Redis cache clear error:', error.message);
  }
};

module.exports = { connectRedis, getRedisClient, cacheData, getCachedData, clearCache };
