const router = require("express").Router();
const Game = require("../models/Game");

const ErrorResponse = require("../utils/errorResponse");

const successMessage = (res, stat, message, data) => {
  return res.status(stat).json({
    status: "success",
    message,
    data,
  });
};

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

router.post("/", async (req, res, next) => {
  const { name, category } = req.body;
  if (!name || !category)
    return next(new ErrorResponse("Please enter all fields", 400));
  try {
    const gameExists = await Game.findOne({ name });
    if (gameExists) return next(new ErrorResponse("Game already exists", 400));

    const game = await Game.create({ name, category });
    successMessage(res, 200, "Game created successfully.", game);
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const game = await Game.findByIdAndUpdate(id, req.body);
    if (!game) return next(new ErrorResponse("Error updating game", 400));
    successMessage(res, 200, "Game updated successfully.", game);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const game = await Game.findByIdAndDelete(id);
    if (!game) return next(new ErrorResponse("Error deleting game", 400));
    successMessage(res, 200, "Game deleted successfully.", game);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
