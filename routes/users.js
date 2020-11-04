const express = require("express");
const fetchAllCommitPages = require("../helpers/commit-api-helper");

const router = express.Router();

/**
 * GET - returns all users who have commited between specified interval in
 * a JSON response of 
 * {
 *    users: string[]
 * }
 */
router.get('/users', async (req, res, next) => {
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

    return res.json({ users: Array.from(users) });

  } catch (error) {
    return next(error);
  }

});


module.exports = router;