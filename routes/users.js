const express = require("express");
const fetchAllCommitPages = require("../helpers/commit-api-helper");
const redisClient = require("../redis");
const checkCache = require("../middlewares/check-cache");
const { REDIS_EXP } = require("../config");
const CACHE_KEY = "users";

const router = express.Router();

/**
 * GET - returns all users who have commited between specified interval in
 * a JSON response of 
 * {
 *    users: string[]
 * }
 */
router.get('/users', checkCache(CACHE_KEY), async (req, res, next) => {
  try {
    const pages = await fetchAllCommitPages();

    const users = new Set();

    // process each page and rows of each page 
    for (let page of pages) {
      for (let row of page) {
        // assumption here is that all commits will have an author
        users.add(row.commit.author.name);
      }
    }

    const data = { users: Array.from(users) };
    // cache data with redis
    redisClient.setex(CACHE_KEY, REDIS_EXP, JSON.stringify(data));

    return res.json(data);

  } catch (error) {
    return next(error);
  }

});


module.exports = router;