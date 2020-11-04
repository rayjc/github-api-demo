const express = require("express");
const fetchAllCommitPages = require("../helpers/commit-api-helper");

const router = express.Router();

/**
 * GET - returns top 5 users who have the most commits 
 * between specified interval in a JSON response of
 * {
 *    {
 *      name: string,
 *      commits: number
 *    }
 * }
 */
router.get('/most-frequent', async (req, res, next) => {
  try {
    const pages = await fetchAllCommitPages();

    const table = new Map();

    // process each page and rows of each page 
    for (let page of pages) {
      for (let row of page) {
        // assumption here is that all commits will have an author
        const { name } = row.commit.author;
        if (table.has(name)) {
          table.set(name, table.get(name) + 1);
        } else {
          table.set(name, 1);
        }
      }
    }

    // transform map to an array that holds top 5 contributors
    const ordered = [...table.entries()]
      .sort((a, b) => {
        return b[1] - a[1];
      });
    const result = ordered.slice(0, 5).map(([name, count]) => {
      return {
        name,
        commits: count
      };
    });

    return res.json(result);

  } catch (error) {
    return next(error);
  }

});


module.exports = router;