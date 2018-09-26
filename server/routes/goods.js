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
  // 视图层转过来的价格占比
  let priceLevel = req.param("priceLevel")
  let priceGte = ''
  let priceLte = ''
  let params = {}
  /**
   *  按价格条件查询
   */
  if (priceLevel == 'all') {
  } else {
    switch (priceLevel) {
      case '0':
        priceGte = 0;
        priceLte = 100;
        break;
      case '1':
        priceGte = 100;
        priceLte = 500;
        break;
      case '2':
        priceGte = 500;
        priceLte = 1000;
        break;
      case '3':
        priceGte = 1000;
        priceLte = 2000;
        break;
    }
    params = {
      salePrice: {
        $gte: priceGte,
        $lte: priceLte
      }
    }
  }

  let skip = (page - 1) * pageSize
  // 价格排序
  let sort = req.param("sort")

  let goodsModel = Goods.find(params).skip(skip).limit(pageSize)
  goodsModel.sort({'salePrice': sort})

  goodsModel.exec({}, (err, doc) => {
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
