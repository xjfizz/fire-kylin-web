<template>
  <div class="app-container">
      <div class="home-content">
          <div class="content-left">
              <waitInfo></waitInfo>
          </div>
          <div class="content-right">
              ss
          </div>
      </div>
  </div>
</template>

<script>

import waitInfo from './commponents/waitInfo'
export default {
  name: "roster",
  data() {
    return {
 
    };
  },
  components: {
   waitInfo
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
          width: 70%;
          background-color: #f9f9f9;
      }
      .content-right{
          width: 30%;


      }
  }
}
</style>
