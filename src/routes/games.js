const router = require("express").Router();
const Game = require("../models/Game");

router.get("/", async (req, res, next) => {
  try {
    const games = await Game.find();
    let filteredGames = games;

    if (req.query.name) {
      const nameFilter = req.query.name.toLowerCase();
      filteredGames = games.filter(game =>
        game.name.toLowerCase().includes(nameFilter)
      );
    }

    // check if age query param is provided
    if (req.query.category) {
      const categoryFilter = req.query.category.toLowerCase();
      filteredGames = games.filter(game =>
        game.category.toLowerCase().includes(categoryFilter)
      );
    }
    return res.json({
      success: true,
      message: "Games fetched successfully",
      games: filteredGames,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {});

router.patch("/:id", async (req, res, next) => {});

router.delete("/:id", async (req, res, next) => {});

module.exports = router;
