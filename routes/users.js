const express = require("express");

const router = express.Router();

router.get('/users', (req, res, next) => {
  return res.json({ "message": "hit /user route" });
});


module.exports = router;