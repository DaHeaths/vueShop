<template>
    <div>
      <nav-header></nav-header>
      <nav-bread>
        <span slot="bread">Goods</span>
      </nav-bread>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">Sort by:</span>
            <a href="javascript:void(0)" class="default cur">Default</a>
            <a href="javascript:void(0)" @click="sortGoods" class="price">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter" :class="{'filterby-show': filterBy}">
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd><a href="javascript:void(0)" :class="{'cur': priceChecked == 'all'}" @click="priceChecked='all'">All</a></dd>
                <dd v-for="(price, index) in priceFilter" >
                  <a href="javascript:void(0)" @click="setPriceFilter(index)" :class="{'cur': priceChecked==index}">{{price.startPrice}} ~ {{price.endPrice}}</a>
                </dd>
              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li v-for="item in goodsList">
                    <div class="pic">
                      <a href="javascript:;"><img :src="'/static/' + item.productImage" alt=""></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">{{item.salePrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
                <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">加载中......</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 遮罩 start -->
      <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
      <!-- 遮罩 end -->
      <nav-footer></nav-footer>
    </div>
</template>
<script>
import NavHeader from '@/components/header.vue'
import NavFooter from '@/components/footer.vue'
import NavBread from '@/components/bread.vue'
import axios from 'axios'

export default {
  data() {
    return {
      priceChecked: 'all',
      priceFilter: [
        {
          startPrice: '0',
          endPrice: '100'
        },
        {
          startPrice: '100',
          endPrice: '500'
        },
        {
          startPrice: '500',
          endPrice: '1000'
        },
        {
          startPrice: '1000',
          endPrice: '2000'
        },
      ],
      // 控制隐藏或者显示
      filterBy: false,
      // 遮罩
      overLayFlag: false,
      // API商品
      goodsList: [],
      // 是否滚动加载
      busy: true
    }
  },
  methods: {
    /**
     * 响应式，弹出价格菜单
     */
    showFilterPop () {
      this.filterBy = true
      this.overLayFlag = true
    },
    /**
     * 点击隐藏遮罩
     */
    closePop () {
    this.filterBy = false
      this.overLayFlag = false
    },
    setPriceFilter (index) {
      this.priceChecked = index
      this.page = 1
      this.closePop()
      this.getGoodsList()
    },
    /**
     * 分页获取商品
     */
    getGoodsList (flag) {
      let param = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag?1:-1,
        priceLevel: this.priceChecked,
        busy: true
      }
      /**
       * 请求商品API接口
       */
      axios.get('/goods', {params: param}).then((response) => {
        let res = response.data
        if (res.status == '0') {
          this.goodsList = res.result.list
          console.log(666, res.result.list)
          if (flag) {
            this.goodsList = this.goodsList.concat(res.result.list)
            if (res.result.count == 0) {
              this.busy = true
            } else {
              this.busy = false
            }
          } else {
            this.goodsList = res.result.list
            this.busy = false
          }
        } else {
          this.goodsList = []
        }
      })
    },
    /**
     * 价格降序和升序
     */
    sortGoods () {
      this.sortFlag = !this.sortFlag
      this.page = 1
      this.getGoodsList()
    },
    /**
     * 滚动加载商品
     */
    loadMore () {
      setTimeout(() => {
        this.page++;
        this.busy = true
      }, 1000)
    }
  },
  mounted () {
    this.getGoodsList()
  },

  /**
   * 组件
   */
  components: {
    NavHeader,
    NavFooter,
    NavBread
  }
}
</script>
<style>

</style>

