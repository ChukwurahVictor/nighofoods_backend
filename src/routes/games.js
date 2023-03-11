const router = require("express").Router();
const moment = require("moment-timezone");
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
    let games = await Game.find();

    if (req.query.createdAt) {
      const dateFilter = moment(req.query.createdAt).format("YYYY-MM-DD");
      games = games.filter(
        game =>
          moment(game.createdAt).tz("UTC").format("YYYY-MM-DD") === dateFilter
      );
    }

    if (req.query.category) {
      const categoryFilter = req.query.category.toLowerCase();
      games = games.filter(game =>
        game.category.toLowerCase().includes(categoryFilter)
      );
    }

    if (req.query.startDate && req.query.endDate) {
      const startDate = moment(req.query.startDate).format("YYYY-MM-DD");
      const endDate = moment(req.query.endDate).format("YYYY-MM-DD");

      games = games.filter(game => {
        const gameDate = moment(game.createdAt).tz("UTC").format("YYYY-MM-DD");
        return gameDate >= startDate && gameDate <= endDate;
      });
    }
    games = { games, total: games.length };
    successMessage(res, 200, "Games fetched successfully.", games);
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
