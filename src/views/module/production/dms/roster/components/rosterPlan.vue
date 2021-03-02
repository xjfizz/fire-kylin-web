<template>
  <div
    class="roster-main"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    v-loading="loading"
  >
    <div class="roster-content-item" v-if="this.rosterList.length > 0">
      <div class="item-time">排班日期:{{searchDate}}</div>
      <div class="item-f">
       <div
          class="item"
          :class="item.deviceStatus == 1 ? 'item-stop' : '' "
          v-for="(item,index) in deviceList"
          :key="index"
          @click="selectItem(item)"
        >
          <div class="item-top">{{item.deviceCode}}</div>
          <div class="item-mid">{{item.deviceName}}</div>
         
          <el-popover
            class="item-bottom"
            v-if="item.dmsDeviceRelationRecord && item.dmsDeviceRelationRecord.userPkid"
            placement="bottom"
            title="关联人员"
            width="200"
            trigger="hover"
            :content="item.dmsDeviceRelationRecord.userName + '/' + item.dmsDeviceRelationRecord.userJobNumber"
          >
            <span
              slot="reference"
            >
           
            <span>{{item.dmsDeviceRelationRecord.userName}}</span>
            <span v-if="item.dmsDeviceRelationRecord.userJobNumber">/{{item.dmsDeviceRelationRecord.userJobNumber}}</span>
           
            </span>
          </el-popover>
          <div class="item-bottom" v-else>暂无关联</div>
        </div>
      </div>
    </div>
    <div class="content-item-no" v-else>
      <el-button
        class="search-btn"
        type="info"
        icon="el-icon-document-add"
        size="medium"
        @click="insertPlan()"
      >插入排班计划</el-button>
      <span class="btn-text">今日没有生产排班</span>
    </div>
    <div class="content-bottom">
      <div
        class="left"
      >共{{deviceList.length || 0}}台设备，正常{{nomalDevices || 0}}台，停止{{abnormalDevices || 0}}台</div>
      <div class="right">
        <el-button
          class="search-btn"
          type="success"
          icon="el-icon-folder-opened"
          size="medium"
          @click="openOptions()"
        >操作</el-button>
      </div>
    </div>

    <!-- 对话框-start -->
    <div class="dialog">
      <el-dialog title="设备信息" :visible.sync="deviceDetailVisible" width="25%" center>
        <div class="deviceDialogMain">
          <div class="item">
            <div class="item-title">设备编号</div>
            <div class="item-value">{{deviceDetailForm.deviceCode}}</div>
          </div>
          <div class="item">
            <div class="item-title">设备名称</div>
            <div class="item-value">{{deviceDetailForm.deviceName}}</div>
          </div>
          <div class="item">
            <div class="item-title">设备型号</div>
            <div class="item-value">{{deviceDetailForm.deviceModel}}</div>
          </div>
          <div class="item">
            <div class="item-title">设备状态</div>
            <div class="item-value">
              <el-tag
                v-if="deviceDetailForm.deviceStatus == 1"
                type="danger"
                effect="dark"
                size="medium"
              >停止</el-tag>
              <el-tag
                v-if="deviceDetailForm.deviceStatus == 0"
                type="success"
                effect="dark"
                size="medium"
              >正常</el-tag>
            </div>
          </div>
          <!-- <div
            class="item-history-people"
            v-for="(item,index) in (deviceDetailForm.deviceRelationRecords)"
            :key="index"
            v-if="index < 2"
          >
            <div class="left">关联人员</div>
            <div class="right">
              <div class="right-top">{{item.userName}}/{{item.userJobNumber}}</div>
              <div class="right-bottom">始 {{item.createTime}}</div>
            </div>
          </div>-->
          <div class="item-history-people">
            <div class="left">关联人员</div>
            <div class="right" v-if="deviceDetailForm.dmsDeviceRelationRecord && deviceDetailForm.dmsDeviceRelationRecord.userPkid">
              <div
                class="right-top"
              >
              <span>{{deviceDetailForm.dmsDeviceRelationRecord.userName}}</span>
              <span v-if="deviceDetailForm.dmsDeviceRelationRecord.userJobNumber">/{{deviceDetailForm.dmsDeviceRelationRecord.userJobNumber}}</span>

              </div>
              <div class="right-bottom">始 {{deviceDetailForm.dmsDeviceRelationRecord.createTime}}</div>
            </div>
            <div class="right" v-else>
              <div class="right-top">暂无关联人员</div>
            </div>
          </div>
          <div class="item-history-people item-history-people-history">
            <div class="left">历史关联</div>
            <div
              class="right"
              v-if=" deviceDetailForm.deviceRelationRecords && deviceDetailForm.deviceRelationRecords.length >= 2"
            >
              <div
                class="right-top"
              >
              <!-- {{deviceDetailForm.deviceRelationRecords[deviceDetailForm.deviceRelationRecords.length - 2].userName}}/{{deviceDetailForm.deviceRelationRecords[deviceDetailForm.deviceRelationRecords.length - 2].userJobNumber}} -->
              
               <span>{{deviceDetailForm.deviceRelationRecords[deviceDetailForm.deviceRelationRecords.length - 2].userName}}</span>
               <span v-if="deviceDetailForm.deviceRelationRecords[deviceDetailForm.deviceRelationRecords.length - 2].userJobNumber">/{{deviceDetailForm.deviceRelationRecords[deviceDetailForm.deviceRelationRecords.length - 2].userJobNumber}}</span>
              
              </div>
              
              
              
              <div
                class="right-bottom"
              >始 {{deviceDetailForm.deviceRelationRecords[deviceDetailForm.deviceRelationRecords.length - 2].createTime}}</div>
            </div>
            <div class="right" v-else>
              <div class="right-top">暂无历史关联人员</div>
            </div>
          </div>
        </div>
      </el-dialog>

      <!-- 日期对话框 -->
      <el-dialog title="插入排班计划" :visible.sync="calendarVisible" width="25%" center>
        <calendar :copyDate="copyDate"></calendar>
      </el-dialog>
    </div>
    <!-- 对话框-end -->
  </div>
</template>

<script>
import calendar from "./common/calendar";
import {
  listRoster,
  listDevice
} from "@/api/module/production/dms/roster/roster";

export default {
  name: "rosterPlan",
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
    calendar
  },
  data() {
    return {
      searchDate: "",
      selectItemId: 1,
      deviceDetailVisible: false,
      deviceDetailForm: {},
      calendarVisible: false,
      deviceList: [],
      rosterList: [], //排班计划
      loading: false
    };
  },
  computed: {
    nomalDevices() {
      //正常设备
      let arr = [];
      this.deviceList.map(item => {
        if (item.deviceStatus == 0) {
          arr.push(item);
        }
      });
      return arr.length || 0;
    },
    abnormalDevices() {
      //异常设备
      let arr = [];
      this.deviceList.map(item => {
        if (item.deviceStatus == 1) {
          arr.push(item);
        }
      });
      return arr.length || 0;
    }
  },
  watch: {
    value: {
      handler(val) {},
      immediate: true
    }
  },
  mounted() {},
  created() {
    // this.getRosterList()
  },

  methods: {
    /** 查询排班计划列表 */
    getRosterList(e) {
      // this.loading = true;
      if (!e) {
        return this.$message({
          type: "warning",
          message: "未选择查询日期"
        });
      }
      this.loading = true;
      this.searchDate = e;
      let params = {
        rosterDate: e
      };
      listRoster(params).then(res => {
        if (res.code == 200) {
          this.rosterList = res.data;
          this.loading = false;
          if (res.data) {
            if (this.rosterList.length > 0) {
              this.getDeviceList();
            }
          }
        }
      });
    },
    /** 查询设备列表 */
    getDeviceList() {
      // this.loading = true;
      let params = {
        rosterDate: this.searchDate
      };
      listDevice(params).then(res => {
        if (res.code == 200) {
          this.deviceList = res.data;
          // if (this.deviceList.deviceRelationRecords) {
          //   this.deviceList.deviceRelationRecords = this.deviceList.deviceRelationRecords.reverse();
          // }
          this.loading = false;
          this.$message({
            type: "success",
            message: "查询成功!"
          });
        }
      });
    },

    // 选择设备
    selectItem(item) {
      this.selectItemId = item.id;
      this.deviceDetailForm = item;
      this.deviceDetailVisible = true;
    },
    // 打开操作组件
    openOptions() {
      this.$parent.changeRosterPlanShow(false, this.searchDate);
    },
    // 插入排班计划
    insertPlan() {
      this.calendarVisible = true;
    },
    // 取消插入排班计划
    cancelPlanForm(date) {
      this.calendarVisible = false;
      console.log('date', date)
      if (date) {
        this.$parent.changeRosterPlanShow(false, date);
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.roster-main {
  .content-item-no {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding-top: 10px;
    border-top: 1px solid #e5e5e5;
    height: 60vh;
    .btn-text {
      margin-top: 10px;
      font-size: 14px;
      color: #676a6c;
    }
  }
  .roster-content-item {
    // min-height: 500px;
    height: 60vh;
    overflow: auto;
    .item-time {
      width: 100%;
      font-size: 15px;
      color: #999999;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      border-top: 1px solid #e5e5e5;
      padding-top: 10px;
      padding-right: 10px;
    }
    .item-f {
      display: grid;
      justify-content: space-between;
      grid-template-columns: repeat(auto-fill, 100px);
      grid-gap: 10px;
      padding-top: 10px;
      // display: flex;
      // justify-content: flex-start;            
      // display: -webkit-flex;
      // flex-direction: row;
      // flex-wrap: wrap;
    
      // padding-top: 10px;
      // padding-right: 20px;
      // border-top: 1px solid #e5e5e5;
      .item {
        cursor: pointer;
        min-width: 70px;
        min-height: 70px;
        border: 1px solid #e2e2e2;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background: #67c23a;
        font-size: 13px;
        color: #ffffff;
        margin-left: 10px;
        margin-top: 10px;
        transition: all 0.4s;
        -moz-transition: all 0.4s;
        -webkit-transition: all 0.4s;
        -o-transition: all 0.4s;
        .item-top {
        }
        .item-mid {
        }
        .item-bottom {
          padding: 0 10px;
          width: 100%;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          //规定段落中的文本不进行换行
          white-space: nowrap;
        }
      }
      .item:hover {
        cursor: pointer;
        /* background-color: #ff5400; */
        transform: scale(1.2);
      }
      .item-select {
        transform: scale(1.2);
      }
      .item-stop {
        // background: #f56c6c;
        background: #ffba00;
        color: #ffffff;
      }
    }
  }
  .content-bottom {
    margin-top: 20px;
    padding: 10px;
    border-top: 1px solid #e5e5e5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      color: #676a6c;
      font-size: 16px;
    }
    .right {
    }
  }
  .dialog {
    .el-dialog__header {
      border-bottom: 1px solid #e5e5e5;
    }
    .el-dialog--center .el-dialog__body {
      text-align: initial;
      // padding: 10px 25px 30px;
      padding: 20px 0;
    }
    .el-dialog {
      display: flex;
      flex-direction: column;
      margin: 0 !important;
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      /*height:600px;*/
      max-height: calc(100% - 30px);
      max-width: calc(100% - 30px);
    }
    .el-dialog .el-dialog__body {
      flex: 1;
      overflow: auto;
    }
    .deviceDialogMain {
      //  border-top: 1px solid #e5e5e5;
      padding-left: 20px;
      padding-right: 20px;
      .item {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        .item-title {
        }
        .item-value {
          margin-left: 20px;
        }
      }
      .item-history-people {
        display: flex;
        // align-items: center;
        margin-top: 15px;
        .left {
        }
        .right {
          margin-left: 20px;
          .right-top {
          }
          .right-bottom {
            margin-top: 8px;
          }
        }
      }
      .item-history-people-history {
        color: #c0c1bf;
      }
    }
  }
}
</style>