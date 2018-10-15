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
  if (priceLevel !== 'all') {
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
        priceLte = 5000;
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

  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
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
        msg: '请求接口success。。。。。。。。。。',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
})
/**
 * 加入购物车
 */
router.post("/addCart", function (req,res,next) {
  let userId = '100000077'
  let productId = req.body.productId
  var User = require('../models/user')
  User.findOne({userId:userId}, function (err,userDoc) {
    if(err){
      res.json({
        status:"1",
        msg:err.message
      })
    }else{
      console.log("userDoc:"+userDoc);
      if(userDoc){
        var goodsItem = '';
        userDoc.cartList.forEach(function (item) {
          if(item.productId == productId){
            goodsItem = item;
            item.productNum ++;
          }
        });
        if(goodsItem){
          userDoc.save(function (err2,doc2) {
            if(err2){
              res.json({
                status:"1",
                msg:err2.message
              })
            }else{
              res.json({
                status:'0',
                msg:'',
                result:'数据调用成功'
              })
            }
          })
        }else{
          Goods.findOne({productId:productId}, function (err1,doc) {
            if(err1){
              res.json({
                status:"1",
                msg:err1.message
              })
            }else{
              if(doc){
                doc.productNum = 1;
                doc.checked = 1;
                userDoc.cartList.push(doc);
                userDoc.save(function (err2,doc2) {
                  if(err2){
                    res.json({
                      status:"1",
                      msg:err2.message
                    })
                  }else{
                    res.json({
                      status:'0',
                      msg:'',
                      result:'数据调用成功'
                    })
                  }
                })
              }
            }
          });
        }
      }
    }
  })
})

module.exports = router
