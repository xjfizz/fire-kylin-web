<template>
  <div class="app-container">
    <div class="produce-content">
      <div class="produce-top">
        <el-collapse v-model="activeName1">
          <el-collapse-item name="1">
            <template slot="title">
              <div class="collapse-title-sty">
                <span class="collapse-title">查询</span>
                <span class="collapse-des">请输入查询日期进行检索</span>
                <span class="collapse-tips">※：请选择年月日进行查询，默认查询时间范围为：当月(例如：2020-09)</span>
              </div>
            </template>
            查询
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="produce-mid">
        <el-collapse v-model="activeName1">
          <el-collapse-item name="1">
            <template slot="title">
              <div class="collapse-title-sty">
                <span class="collapse-title">统计</span>
                 <span class="collapse-tips">※统计：平台订单、用户、实收</span>
              </div>
            </template>
            统计
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="produce-bottom">
        <el-collapse v-model="activeName1">
          <el-collapse-item name="1">
            <template slot="title">
              <div class="collapse-title-sty">
                <span class="collapse-title">新增订单</span>
              
              </div>
            </template>
            新增订单
          </el-collapse-item>
        </el-collapse>
      </div>
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
  background-color: #f9f9f9;
  .produce-content {
    .produce-top {
      .collapse-title-sty {
        width: 100%;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e6e9ed;
        .collapse-title {
          font-size: 18px;
          font-weight: 400;
          color: #73879c;
        }
        .collapse-des {
          margin-left: 10px;
          font-size: 80%;
          font-weight: 400;
          color: #73879c;
        }
        .collapse-tips {
          margin-left: 10px;
          font-size: 80%;
          font-weight: 400;
          color: #ff0000;
        }
      }
    }

    .produce-mid {
      .collapse-title-sty {
        width: 100%;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e6e9ed;
        .collapse-title {
          font-size: 18px;
          font-weight: 400;
          color: #73879c;
        }
        .collapse-des {
          margin-left: 10px;
          font-size: 80%;
          font-weight: 400;
          color: #73879c;
        }
        .collapse-tips {
          margin-left: 10px;
          font-size: 80%;
          font-weight: 400;
          color: #ff0000;
        }
      }
    }

    .produce-bottom {
      .collapse-title-sty {
        width: 100%;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e6e9ed;
        .collapse-title {
          font-size: 18px;
          font-weight: 400;
          color: #73879c;
        }
        .collapse-des {
          margin-left: 10px;
          font-size: 80%;
          font-weight: 400;
          color: #73879c;
        }
        .collapse-tips {
          margin-left: 10px;
          font-size: 80%;
          font-weight: 400;
          color: #ff0000;
        }
      }
    }
  }
}
</style>
