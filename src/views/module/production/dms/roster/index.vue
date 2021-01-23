<template>
  <div class="app-container">
    <div class="top">
      <div class="left">
        <el-date-picker
          v-model="srarchDate"
          align="left"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions"
           format="yyyy 年 MM 月 dd 日"
           value-format="yyyy-MM-dd"
        ></el-date-picker>
        <el-button
          class="search-btn"
          type="primary"
          
          icon="el-icon-search"
          size="medium"
          @click=""
        >查询</el-button>
      </div>
      <div class="right">
        <el-button
          class="copy-btn"
          type="success"
          
          icon="el-icon-document-copy"
          size="medium "
          @click=""
        >复制</el-button>
      </div>
    </div>
    <div class="content">
       <rosterPlan v-if="rosterPlanShow"></rosterPlan>
       <rosterOptions v-if="!rosterPlanShow"></rosterOptions>
    </div>
  </div>
</template>

<script>
import rosterPlan from "./components/rosterPlan";
import rosterOptions from "./components/rosterOptions";
export default {
  name: "roster",
  data() {
    return {
      rosterPlanShow:true,
      pickerOptions: {
        // disabledDate(time) {
        //   return time.getTime() > Date.now();
        // },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      srarchDate: new Date()
    };
  },
  components: {
    rosterPlan,
    rosterOptions
  },
  watch: {},
  created() {},
  methods: {
    // 切换plan options 组件
    changeRosterPlanShow(e) {
      console.log('sss')
      this.rosterPlanShow = e
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.app-container{
  .top {
    padding-left: 20px;
    padding-right: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // border-bottom: 1px solid #e5e5e5;
    padding-bottom: 10px;
    .search-btn{
      margin-left: 20px;
    }
    .copy-btn{
      // margin-right: 20px
    }
  
  
  }
  .content{
    padding: 10px 10px 10px 10px;
  }
}

</style>
