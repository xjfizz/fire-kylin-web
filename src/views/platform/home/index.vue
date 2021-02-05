<template>
  <div class="app-container">
      <div class="home-content">
          <div class="content-left">
              <waitInfo></waitInfo>
          </div>
          <div class="content-right">
              <div class="top">
                  <message></message>
              </div>
              <div class="bottom">
                  <produceData></produceData>
              </div>
          </div>
      </div>
  </div>
</template>

<script>

import waitInfo from './commponents/waitInfo'
import message from './commponents/message'
import produceData from './commponents/produce-data'
export default {
  name: "roster",
  data() {
    return {
 
    };
  },
  components: {
   waitInfo,
   message,
   produceData
  },
  watch: {},
  created() {
    // this.init()
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化
    init() {
      
    },
  
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.app-container {
  .home-content{
      display: flex;
      .content-left{
          width: 60%;
          height: 100%;
         
          padding: 10px;
      }
      .content-right{
          width: 40%;
           padding: 10px;
           height: 100%;

            .top{};
            .bottom{
              margin-top: 15px;
            }

      }
  }
}
</style>
