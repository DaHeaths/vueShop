const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  // res.render('index', { title: 'Express,Very Goood' })
  res.send('明天会更好！')
})

module.exports = router
