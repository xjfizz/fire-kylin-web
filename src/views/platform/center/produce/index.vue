<template>
  <div class="app-container">
    <div class="produce-content">
      <div class="produce-top">
        <el-collapse v-model="activeName1">
          <el-collapse-item name="1">
          <template slot="title">
            <span class="collapse-title">查询</span>
            <span class="collapse-des">请输入查询日期进行检索</span>
            <span class="collapse-tips">※：请选择年月日进行查询，默认查询时间范围为：当月(例如：2020-09)</span>
          </template>
          ssss
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="produce-mid">1</div>
      <div class="produce-bottom">2</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "roster",
  data() {
    return {
      activeName1: "1"
    };
  },
  components: {},
  watch: {},
  created() {
    // this.init()
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化
    init() {}
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.app-container {
  .produce-content {
    .produce-top{
      .collapse-title{
       font-size: 18px;
      font-weight: 400;
      color: #73879C;

      }
      .collapse-des{
        margin-left: 10px;
        font-size: 80%;
    font-weight: 400;
     color: #73879C;
      }
      .collapse-tips{
         margin-left: 10px;
        font-size: 80%;
      font-weight: 400;
      color: #ff0000;
      }
    }
  }
}
</style>
