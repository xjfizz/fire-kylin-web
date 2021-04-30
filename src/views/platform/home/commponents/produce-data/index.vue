<template>
  <div class="produce-main">
    <el-tabs v-model="activeName" @tab-click="handleClick" >
      <el-tab-pane name="1" >
        <div slot="label" class="title">
           <span class="title-money">{{homeMainData.totalProductionAmount || 0}}</span>
           <span  class="title-text">总生产金额(万元)</span>
          
        </div>
        <!-- 饼图 -->
        <div class="bottom" v-if="activeName == 1">
          <pieChart ref="pieChart" :activeName="activeName" :chartData="homeMainData.chartData"></pieChart>
        </div>
      </el-tab-pane>
      <el-tab-pane name="2">
         <div slot="label" class="title">
           <div class="title-money">{{homeMainData.totalProductionNum || 0}}</div>
           <div  class="title-text">总生产件数(万件)</div>
          
        </div>
       <!-- 饼图 -->
        <div class="bottom" v-if="activeName == 2">
          <pieChart ref="pieChart" :activeName="activeName" :chartData="homeMainData.chartData"></pieChart>
        </div>
      </el-tab-pane>
      <el-tab-pane name="3">
        <div slot="label" class="title">
           <div class="title-money">{{homeMainData.totalProductionOrderNum || 0}}</div>
           <div  class="title-text">总订单数量(个)</div>
          
        </div>
        <!-- 饼图 -->
        <div class="bottom" v-if="activeName == 3">
          <pieChart ref="pieChart" :activeName="activeName" :chartData="homeMainData.chartData"></pieChart>
        </div>
      </el-tab-pane>
      <el-tab-pane name="4">
        <div slot="label" class="title">
           <div class="title-money">{{homeMainData.totalCustomerNum || 0}}</div>
           <div  class="title-text">总客户数量(家)</div>
          
        </div>
         <!-- 饼图 -->
        <div class="bottom" v-if="activeName == 4">
          <pieChart ref="pieChart" :activeName="activeName"  :chartData="homeMainData.chartData"></pieChart>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import pieChart from "../chartCommponent/pieChart";
export default {
  name: "message",
  props: {
      homeMainData:{
          type:Object,
          default:() => {
              return {}
          }
      }
  },
  components: { pieChart },
  data() {
    return {
      activeName: "1",
      itemSelectPie: 1, // 统计类型
    };
  },
  computed: {},
  watch: {},
  mounted() {
  },

  methods: {
    handleClick(tab, event) {
     this.activeName = tab.name
      if(this.activeName == 1) {
        this.homeMainData.chartData = this.homeMainData.productionAmountPieChartData
      } else if(this.activeName == 2) {
         this.homeMainData.chartData = this.homeMainData.totalProductionNumPieChartData
      }else if(this.activeName == 3) {
         this.homeMainData.chartData = this.homeMainData.totalProductionOrderNumPieChartData
      }else if(this.activeName == 4) {
         this.homeMainData.chartData = this.homeMainData.totalCustomerNumPieChartData
      }
     this.$nextTick( ()=> {
        this.$refs.pieChart.initChart(this.homeMainData.chartData)
      })
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.produce-main {
  background: #ffffff;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  padding: 10px 10px 10px 10px;
  .title{
    
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    .title-money{
      padding: 0;
       font-size: 20px;
     // color: #1990FF;
    }
    .title-text{
      margin-top: -15px;
      font-size: 12px;
      color: #888888;
    }
    
  }
 
}

</style>
<style >
 .produce-main .el-tabs__item {
    height: 70px!important;
  }
 
</style>