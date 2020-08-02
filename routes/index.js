const { Router } = require("express");
const router = Router();


//  import routes

router.use("/login", require('./login'));
// router.use("/login/:userId/notes", require('./notes'));
router.use("/notes", require('./notes'));


module.exports = router;