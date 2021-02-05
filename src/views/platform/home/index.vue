<template>
  <div class="app-container">
      <div class="platform-home-content">
          <div class="platform-content-left">
              <waitInfo></waitInfo>
          </div>
          <div class="platform-content-right">
              <div class="platform-top">
                  <message></message>
              </div>
              <div class="platform-bottom">
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
  .platform-home-content{
      display: flex;
      .platform-content-left{
          width: 60%;
          height: 100%;
         
          padding: 10px;
      }
      .platform-content-right{
          width: 40%;
           padding: 10px;
           height: 100%;

            .platform-top{};
            .platform-bottom{
              margin-top: 15px;
            }

      }
  }
}
</style>
