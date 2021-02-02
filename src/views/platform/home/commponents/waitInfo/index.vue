<template>
<el-card shadow="never"  class="waitInfo-card">

  <div class="waitInfo-main">
      <!-- 制帽业务中心 -->
      <div class="wait-item">
          <div class="top">
              <div class="top-title top-title-color1">制帽业务中心</div>
          </div>
          <div class="mid">我的待办</div>
          <div class="bottom">
              <div class="bottom-item">
                  <div class="item-title">待取料</div>
                  <div class="item-value">20</div>
              </div>
               <div class="bottom-item">
                  <div class="item-title">待确认</div>
                  <div class="item-value">20</div>
              </div>
               <div class="bottom-item">
                  <div class="item-title">待生产</div>
                  <div class="item-value">20</div>
              </div>
               <div class="bottom-item">
                  <div class="item-title">待检测</div>
                  <div class="item-value">20</div>
              </div>
               <div class="bottom-item">
                  <div class="item-title">待配送</div>
                  <div class="item-value">20</div>
              </div>
          </div>
      </div>
      <!-- 裁剪业务中心 -->
       <div class="wait-item">
          <div class="top">
              <div class="top-title top-title-color2">裁剪业务中心</div>
          </div>
          <div class="mid">我的待办</div>
          <div class="bottom">
              <div class="bottom-item">
                  <div class="item-title">待取料</div>
                  <div class="item-value">20</div>
              </div>
               <div class="bottom-item">
                  <div class="item-title">待确认</div>
                  <div class="item-value">20</div>
              </div>
               <div class="bottom-item">
                  <div class="item-title">待生产</div>
                  <div class="item-value">20</div>
              </div>
               <div class="bottom-item">
                  <div class="item-title">待检测</div>
                  <div class="item-value">20</div>
              </div>
               <div class="bottom-item">
                  <div class="item-title">待配送</div>
                  <div class="item-value">20</div>
              </div>
          </div>
      </div>

      <!-- 派单业务中心 -->
       <div class="wait-item">
          <div class="top">
              <div class="top-title top-title-color3">派单业务中心</div>
          </div>
          <div class="mid">我的待办</div>
          <div class="bottom">
              <div class="bottom-item">
                  <div class="item-title">待取料</div>
                  <div class="item-value">20</div>
              </div>
               <div class="bottom-item">
                  <div class="item-title">待确认</div>
                  <div class="item-value">20</div>
              </div>
               <div class="bottom-item">
                  <div class="item-title">待生产</div>
                  <div class="item-value">20</div>
              </div>
               <div class="bottom-item">
                  <div class="item-title">待检测</div>
                  <div class="item-value">20</div>
              </div>
               <div class="bottom-item">
                  <div class="item-title">待配送</div>
                  <div class="item-value">20</div>
              </div>
          </div>
      </div>
  </div>
</el-card>

</template>

<script>
export default {
  name: "waitInfo",
  props: {
   
  },
  components: {},
  data() {
    return {
      visible: false,
      orderList: [] // 选择的已取料订单
    };
  },
  computed: {},
  watch: {
    
  },
  mounted() {},

  methods: {
   
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.waitInfo-card{
        
        .waitInfo-main{
             background-color: #f9f9f9;
             padding-top: 1px;
        .wait-item{
            margin-top: 20px;
            .top{
                padding: 10px;
            .top-title{
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #bf81e6;
                color: #ffffff;
                font-size: 14px;
                width: 120px;
                padding: 3px;
            }
            .top-title-color1{
                 background-color: #bf81e6;
            }
            .top-title-color2{
                 background-color: #b7e011;
            }
            .top-title-color3{
                 background-color: #826df9;
            }
        }
        .mid{
            padding: 10px; 
            font-size: 14px;
        }
        .bottom{
            background-color: #ffffff;
             padding: 20px 10px; 
             display: flex;
             justify-content: space-between;
             .bottom-item{
                 display: flex;
                 align-items: center;
                
                 .item-title{
                   font-size: 14px;  
                 }
                 .item-value{
                     margin-left: 20px;
                     font-size: 40px;
                     color: #fb734e;
                 }
             }

        }
        }
        .border-bottom1{
            border-bottom: 1px solid #e5e5e5;
        }
   }
}

</style>