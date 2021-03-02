<template>
  <div class="calendar-main">
    <div class="calendar-top" v-if="copyDate">
      <span>系统检测:</span>
      <span>已复制{{copyDate}}计划</span>
      <el-button class="insert-btn" size="mini" @click="insertRoster()">插入</el-button>
    </div>
    <div class="calendar-main-mid">
      <Calendar v-on:choseDay="clickDay" v-on:changeMonth="changeDate" v-on:isToday="clickToday"></Calendar>
      <!--   :markDate="[copyDate]" -->
    </div>
    <div class="bottom">
      <el-button class="opt-button" size="medium" @click="cancelPlan()">取消</el-button>
      <el-button class="opt-button" type="primary" size="medium" @click="confirmPlan()">确认</el-button>
    </div>
  </div>
</template>

<script>
import Calendar from "vue-calendar-component";
import { copyRoster } from "@/api/module/production/dms/roster/roster";
export default {
  name: "calendar",
  props: {
    value: {
      type: String,
      default: ""
    },
    copyDate: {
      type: String,
      default: ""
    }
  },
  components: {
    Calendar
  },
  data() {
    return {
      // arr: [copyDate],
      insertDate: ""
    };
  },
  computed: {},
  watch: {
    value: {
      handler(val) {},
      immediate: true
    }
  },
  mounted() {},

  methods: {
    clickDay(data) {
      console.log(data); //选中某天
      // this.insertDate = data.replace(/\//g, "-");
      this.insertDate = this.dataFormat(new Date(data));
    },
    dataFormat(d) {
      console.log("d", d);
      let str =
        d.getFullYear() +
        "-" +
        this.p(d.getMonth() + 1) +
        "-" +
        this.p(d.getDate());
      return str;
    },
    //创建补0函数
    p(s) {
      return s < 10 ? "0" + s : s;
    },
    changeDate(data) {
      console.log(data); //左右点击切换月份
    },
    clickToday(data) {
      console.log(data); //跳到了本月
    },
    // 取消
    cancelPlan() {
      console.log(" this.$parent", this.$parent);

      this.$parent.$parent.cancelPlanForm();
    },
    // 确认
    confirmPlan() {
      this.$parent.$parent.cancelPlanForm(this.insertDate);
    },
    insertRoster() {
      if (!this.insertDate) {
        return this.$message({
          type: "warning",
          message: "请选择插入的日期"
        });
      }
      let params = {
        copyRosterDate:this.copyDate, // this.insertDate,
        insertRosterDate: this.insertDate
      };
      copyRoster(params).then(res => {
        if (res.code == 200) {
            this.$message({
            type: "success",
            message: "插入成功!"
          });
           this.$parent.$parent.cancelPlanForm(this.insertDate);
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.calendar-main {
  // 606266 c0c4cc 1890ff

  .calendar-top {
    display: flex !important;
    justify-content: flex-start;
    align-items: center;
    margin-left: 30px;
    margin-right: 30px;
    color: #ffffff !important;
    letter-spacing: 1px;
    background-color: #ec7e3d !important;
    padding: 3px 5px;
    .insert-btn {
      margin-left: auto;
    }
  }
  .calendar-main-mid {
    margin-top: 10px;
    margin-left: 30px;
    margin-right: 30px;
    min-height: 350px;
    border: 1px solid #e5e5e5 !important;
    box-shadow: 0 0 5px #dadada !important;
  }
  .bottom {
    display: flex;
    justify-content: center;
    border-top: 1px solid #e5e5e5 !important;
    margin-top: 20px;
    padding-top: 10px;
  }
}
</style>
<style>
    .calendar-main-mid .wh_item_date:hover {
    background: #ffffff !important;
    color: #1890ff !important;
    cursor: pointer !important;
  }
  .calendar-main-mid .wh_content_all {
    background-color: #ffffff !important;
    color: #606266 !important;
  }
  .calendar-main-mid .wh_content:first-child .wh_content_item_tag,
  .calendar-main-mid .wh_content:first-child .wh_content_item {
    color: #606266 !important;
  }
  .calendar-main-mid .wh_content_item,
  wh_content_item_tag {
    color: #606266 !important;
  }

  .calendar-main-mid .wh_jiantou1 {
    border-top: 2px solid #606266 !important;
    border-left: 2px solid #606266 !important;
  }

  .calendar-main-mid .wh_jiantou1:active,
  .calendar-main-mid .wh_jiantou2:active {
    border-color: #606266 !important;
  }

  .calendar-main-mid .wh_jiantou2 {
    border-top: 2px solid #606266 !important;
    border-right: 2px solid #606266 !important;
  }
  .calendar-main-mid .wh_content_item > .wh_isMark {
    background: #1890ff !important;
    color: #ffffff !important;
  }
  .calendar-main-mid .wh_content_item .wh_other_dayhide {
    color: #c0c4cc !important;
  }
  .calendar-main-mid .wh_content_item .wh_want_dayhide {
    color: #c0c4cc !important;
  }
  .calendar-main-mid .wh_content_item .wh_isToday {
    background: #ffffff !important;
    color: #1890ff !important;
  }
  .calendar-main-mid .wh_content_item .wh_chose_day {
    background: #1890ff !important;
    color: #fff !important;
  }

  .calendar-main-mid .wh_top_changge li {
    color: #606266 !important;
  }
</style>