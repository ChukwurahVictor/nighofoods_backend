const router = require("express").Router();
const Recipe = require("../models/Recipe");

router.get("/", async (req, res, next) => {
  try {
    const recipes = await Recipe.find();
    return res.json({
      success: true,
      message: "recipes fetched successfully",
      recipes,
    });
  } catch (err) {
    next(err);
  }
});
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(400).json({
        success: false,
        message: "recipe not found",
      });
    }
    res.status(400).json({
      success: true,
      message: "recipe fetched successfully",
      recipe,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
