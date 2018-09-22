const express = require('express')
const router = express.Router()

let mongoose = require('mongoose')
let Goods = require('../models/goods')

mongoose.connect('mongodb://localhost:27017/dumall')

mongoose.connection.on('connected', function () {
  console.log("MongoDB connected success. | 数据库连接成功！")
})

mongoose.connection.on('error', () => {
  console.log("MongoDB connected fail. | 数据连接出错啦！")
})

mongoose.connection.on('disconnected', () => {
  console.log("MongoDB connectd disconnected. | 没有找到对应的数据库！")
})

router.get('/', (req, res, next) => {
  // res.send('努力，就是为了给自己将来想要的生活打基础！')

  // 页数
  let page = parseInt(req.param("page"))
  // 请求每页显示的数量
  let pageSize = parseInt(req.param("pageSize"))
  let skip = (page - 1) * pageSize
  // 价格排序
  let sort = req.param('sort')
  let params = {}
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize)
  goodsModel.sort({'salePrice': sort})

  goodsModel.exec((err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '请求接口success',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
})

module.exports = router
