const redisClient = require("../redis");

const checkCache = (route) => {
  return (req, res, next) => {
    redisClient.get(route, (err, data) => {
      if (err) {
        // console.log(err);
        return next(err);
      }
      // found data
      if (data != null) {
        res.json(JSON.parse(data));
      }
      else {
        return next();
      }
    });
  };
};


module.exports = checkCache;