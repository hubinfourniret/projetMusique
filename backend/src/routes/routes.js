const express = require('express')
const app = express()
const router = express.Router();

router.get('/test', (req, res) => {
    res.send('test response')
})

module.exports = router;
