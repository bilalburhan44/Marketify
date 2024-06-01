const redis = require('redis');

const client = redis.createClient({
    url: 'redis://localhost:6379',  // Adjust the URL according to your Redis server configuration
    legacyMode: true
});
client.on('connect', () => {
    console.log('Connected to Redis');
  });

  process.on('exit', () => {
    client.quit();
  });
  
client.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
    await client.connect();
})();

module.exports = client;