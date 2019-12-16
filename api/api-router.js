const router = require('express').Router();

const authRouter = require('../auth/auth-router');
const jokesRouter = require('../jokes/jokes-router');

router.use('/auth', authRouter);
router.use('/jokes', jokesRouter);

router.get('/', (req, res) => {
    res.json({message: "This is working!"})
})

module.exports = router;