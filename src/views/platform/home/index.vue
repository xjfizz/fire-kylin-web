<template>
  <div class="app-container">
      <div class="platform-home-content">
          <div class="platform-content-left">
              <waitInfo :homeMainData="homeMainData"></waitInfo>
          </div>
          <div class="platform-content-right">
              <div class="platform-top">
                  <message  :homeMainData="homeMainData"></message>
              </div>
              <div class="platform-bottom">
                  <produceData ref="produceData" :homeMainData="homeMainData"></produceData>
              </div>
          </div>
      </div>
  </div>
</template>

<script>

// import waitInfo from './commponents/waitInfo'
import waitInfo from './commponents/waitInfo/index'
import message from './commponents/message'
import produceData from './commponents/produce-data'
import homeApi from "@/api/platform/home";
import {getWorkshopInfoDetail} from "@/api/system/workshop/info/info";
export default {
  name: "roster",
  data() {
    return {
      homeMainData:{}
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
      this.getMainData()
      this.getWorkshopInfo()
    },
    /** 获取首页数据 */
    getMainData() {
      console.log('homeApi',homeApi)      
      let params = {}
      homeApi.homeData(params).then(res => {
        if(res.code == 200) {
         this.homeMainData = res.data
          this.homeMainData.chartData = this.homeMainData.productionAmountPieChartData
        this.$nextTick( ()=> {
          this.$refs.produceData.$refs.pieChart.initChart()
        })
         
          } else {
          this.$message({
            type:'warning',
            message:res.msg
          })
        }
      });
    },
    // 获取工场信息
    getWorkshopInfo() {
      getWorkshopInfoDetail().then(response => {
        if(response.code == 200) {
            this.$store.commit('SET_WORKSHOPINFO',response.data)
        }
      });
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
