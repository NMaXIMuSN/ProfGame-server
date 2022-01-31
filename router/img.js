const Router = require("express").Router;
const router = Router();
const path = require("path")

router.get("/:id", (req, res, next) => {
    res.sendFile(path.join(__dirname, "../uploads/" + req.params.id));
})
router.get("/shop/:name", (req, res, next) => {
    res.sendFile(path.join(__dirname, "../shop/" + req.params.name));
})


module.exports = router