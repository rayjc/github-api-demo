const redis = require("redis");
const { REDIS_PORT } = require("./config");

const redisClient = redis.createClient(`redis://redis:${REDIS_PORT}`);

module.exports = redisClient;