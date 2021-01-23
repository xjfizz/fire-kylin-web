<template>
  <div class="main-options">
    <div class="content-item">
      <!--  :class="[(item.deviceStatus == 0 ? 'item-stop' : ''), (item.id == selectItemId ? 'item-select' : '')]" -->
      <div class="item-f">
        <div
          class="item"
          :class="item.deviceStatus == 0 ? 'item-stop' : '' "
          v-for="(item,index) in deviceList"
          :key="index"
          @click="selectItem(item)"
        >
          <!-- <el-radio v-model="item.isSelected" label="true"></el-radio> -->
          <!-- <el-image class="item-selected-img" src="../../../../../../assets/images/selected.png"></el-image> -->
          <img
            v-if="item.isSelected"
            class="item-selected-img"
            src="../../../../../../assets/images/selected.png"
          />
          <div class="item-top">{{item.deviceCode}}</div>
          <div class="item-mid">{{item.deviceName}}</div>
          <div
            class="item-bottom"
          >{{item.productInfo[0].producer}}/{{item.productInfo[0].productCode}}</div>
        </div>
      </div>
    </div>
    <div class="content-bottom">
      <div class="left">
        <el-checkbox v-model="allSelected" @change="allSelect">全选</el-checkbox>
        <el-button
          class="opt-button"
          type="success"
          icon="el-icon-folder-add"
          size="medium"
          @click="relationPeople()"
        >关联人员</el-button>
        <el-button
          class="opt-button"
          type="warning"
          icon="el-icon-folder-remove"
          size="medium"
          @click="removePeople()"
        >移除人员</el-button>
        <el-button
          class="opt-button"
          type="danger"
          icon="el-icon-folder-delete"
          size="medium"
          @click="stopDevice()"
        >停止设备</el-button>
         <el-button
          class="opt-button"
          type="primary"
          icon="el-icon-folder-checked"
          size="medium"
          @click="startDevice()"
        >启用设备</el-button>
      </div>
      
      <div class="right">
        <el-button
          class="opt-button"
          type="success"
          icon="el-icon-document"
          size="medium"
          @click="backPlan()"
        >排班计划</el-button>
      </div>
    </div>

    <!-- 对话框-start -->
    <div class="dialog">
      <el-dialog title="关联人员" :visible.sync="relationVisible" width="400px" center>
        <div class="relationVisibleMain">
          <div class="relationVisibleMain-top">
            <el-input placeholder="请输入工号/姓名" v-model="relationSearchKey" clearable></el-input>

            <el-button
              class="search-button"
              type="primary"
              icon="el-icon-search"
              size="medium"
              @click
            >查询</el-button>
          </div>
          <div class="mid">
            <div class="item" v-for="(item,index) in producerList" :key="index">
              <div class="left">
                <el-radio
                  v-model="selelctProducerId"
                  :label="item.id"
                  @change="selectProducer(item)"
                >
                  <span class="left-value">{{item.name}}/{{item.code}}</span>
                </el-radio>
              </div>
              <!-- <div class="right">
                <span>阿丹/01</span>
              </div>-->
            </div>
          </div>
          <div slot="footer" class="dialog-footer bottom">
            <el-button class="opt-button" size="medium" @click="cancelRelation()">取消</el-button>
            <el-button class="opt-button" type="primary" size="medium" @click="confirmRelation()">确认</el-button>
          </div>
        </div>
        <!-- <span slot="footer" class="dialog-footer">
          <el-button @click="deviceDetailVisible = false">取 消</el-button>
          <el-button type="primary" @click="deviceDetailVisible = false">确 定</el-button>
        </span>-->
      </el-dialog>
    </div>
    <!-- 对话框-end -->
  </div>
</template>

<script>
export default {
  name: "rosterOptions",
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      selectItemId: 1,
      relationVisible: false,
      deviceDetailForm: {},
      allSelected: false,
      selectList: [],
      relationSearchKey: "",
      producerList: [
        { id: 1, name: "张三", code: "02" },
        { id: 2, name: "李四", code: "03" },
        { id: 3, name: "王青", code: "04" },
        { id: 4, name: "张三1", code: "05" },
        { id: 5, name: "张三2", code: "06" },
        { id: 6, name: "张三3", code: "07" },
        { id: 7, name: "张三4", code: "08" },
        { id: 7, name: "张三4", code: "08" },
        { id: 7, name: "张三4", code: "08" },
        { id: 7, name: "张三4", code: "08" },
        { id: 7, name: "张三4", code: "08" },
        { id: 7, name: "张三4", code: "08" },
        { id: 7, name: "张三4", code: "08" },
        { id: 7, name: "张三4", code: "08" },
        { id: 7, name: "张三4", code: "08" },
        { id: 7, name: "张三4", code: "08" },
        { id: 7, name: "张三4", code: "08" },
        { id: 7, name: "张三4", code: "08" },
        { id: 7, name: "张三4", code: "08" },
        { id: 7, name: "张三4", code: "08" },
        { id: 7, name: "张三4", code: "08" }
      ],
      selelctProducerId: "",
      deviceList: [
        {
          id: 1,
          deviceCode: "A001",
          deviceName: "板带机",
          deviceModel: "UH890",
          deviceStatus: 1,
          productInfo: [
            {
              productId: "123456",
              producer: "张三",
              productCode: "02",
              createTime: "2021-01-22 08:15:32"
            },
            {
              productId: "123456",
              producer: "李四",
              productCode: "03",
              createTime: "2021-01-22 10:15:32"
            },
            {
              productId: "123456",
              producer: "张三",
              productCode: "02",
              createTime: "2021-01-22 08:15:32"
            }
          ]
        },
        {
          id: 2,
          deviceCode: "A002",
          deviceName: "板带机",
          deviceModel: "UH890",
          deviceStatus: 1,
          productInfo: [
            {
              productId: "123456",
              producer: "张三",
              productCode: "02",
              createTime: "2021-01-22 08:15:32"
            },
            {
              productId: "123456",
              producer: "李四",
              productCode: "03",
              createTime: "2021-01-22 10:15:32"
            },
            {
              productId: "123456",
              producer: "张三",
              productCode: "02",
              createTime: "2021-01-22 08:15:32"
            }
          ]
        },
        {
          id: 3,
          deviceCode: "A003",
          deviceName: "板带机",
          deviceModel: "UH890",
          deviceStatus: 1,
          productInfo: [
            {
              productId: "123456",
              producer: "张三",
              productCode: "02",
              createTime: "2021-01-22 08:15:32"
            },
            {
              productId: "123456",
              producer: "李四",
              productCode: "03",
              createTime: "2021-01-22 10:15:32"
            },
            {
              productId: "123456",
              producer: "张三",
              productCode: "02",
              createTime: "2021-01-22 08:15:32"
            }
          ]
        },
        {
          id: 1,
          deviceCode: "A001",
          deviceName: "板带机",
          deviceModel: "UH890",
          deviceStatus: 1,
          productInfo: [
            {
              productId: "123456",
              producer: "张三",
              productCode: "02",
              createTime: "2021-01-22 08:15:32"
            },
            {
              productId: "123456",
              producer: "李四",
              productCode: "03",
              createTime: "2021-01-22 10:15:32"
            },
            {
              productId: "123456",
              producer: "张三",
              productCode: "02",
              createTime: "2021-01-22 08:15:32"
            }
          ]
        },
        {
          id: 1,
          deviceCode: "A001",
          deviceName: "板带机",
          deviceModel: "UH890",
          deviceStatus: 1,
          productInfo: [
            {
              productId: "123456",
              producer: "张三",
              productCode: "02",
              createTime: "2021-01-22 08:15:32"
            },
            {
              productId: "123456",
              producer: "李四",
              productCode: "03",
              createTime: "2021-01-22 10:15:32"
            },
            {
              productId: "123456",
              producer: "张三",
              productCode: "02",
              createTime: "2021-01-22 08:15:32"
            }
          ]
        },
        {
          id: 1,
          deviceCode: "A001",
          deviceName: "板带机",
          deviceModel: "UH890",
          deviceStatus: 1,
          productInfo: [
            {
              productId: "123456",
              producer: "张三",
              productCode: "02",
              createTime: "2021-01-22 08:15:32"
            },
            {
              productId: "123456",
              producer: "李四",
              productCode: "03",
              createTime: "2021-01-22 10:15:32"
            },
            {
              productId: "123456",
              producer: "张三",
              productCode: "02",
              createTime: "2021-01-22 08:15:32"
            }
          ]
        },
        {
          id: 1,
          deviceCode: "A001",
          deviceName: "板带机",
          deviceModel: "UH890",
          deviceStatus: 1,
          productInfo: [
            {
              productId: "123456",
              producer: "张三",
              productCode: "02",
              createTime: "2021-01-22 08:15:32"
            },
            {
              productId: "123456",
              producer: "李四",
              productCode: "03",
              createTime: "2021-01-22 10:15:32"
            },
            {
              productId: "123456",
              producer: "张三",
              productCode: "02",
              createTime: "2021-01-22 08:15:32"
            }
          ]
        },
        {
          id: 1,
          deviceCode: "A001",
          deviceName: "板带机",
          deviceModel: "UH890",
          deviceStatus: 0,
          productInfo: [
            {
              productId: "123456",
              producer: "张三",
              productCode: "02",
              createTime: "2021-01-22 08:15:32"
            },
            {
              productId: "123456",
              producer: "李四",
              productCode: "03",
              createTime: "2021-01-22 10:15:32"
            },
            {
              productId: "123456",
              producer: "张三",
              productCode: "02",
              createTime: "2021-01-22 08:15:32"
            }
          ]
        },
        {
          id: 1,
          deviceCode: "A001",
          deviceName: "板带机",
          deviceModel: "UH890",
          deviceStatus: 1,
          productInfo: [
            {
              productId: "123456",
              producer: "张三",
              productCode: "02",
              createTime: "2021-01-22 08:15:32"
            },
            {
              productId: "123456",
              producer: "李四",
              productCode: "03",
              createTime: "2021-01-22 10:15:32"
            },
            {
              productId: "123456",
              producer: "张三",
              productCode: "02",
              createTime: "2021-01-22 08:15:32"
            }
          ]
        },
        {
          id: 1,
          deviceCode: "A001",
          deviceName: "板带机",
          deviceModel: "UH890",
          deviceStatus: 0,
          productInfo: [
            {
              productId: "123456",
              producer: "张三",
              productCode: "02",
              createTime: "2021-01-22 08:15:32"
            },
            {
              productId: "123456",
              producer: "李四",
              productCode: "03",
              createTime: "2021-01-22 10:15:32"
            },
            {
              productId: "123456",
              producer: "张三",
              productCode: "02",
              createTime: "2021-01-22 08:15:32"
            }
          ]
        },
        {
          id: 1,
          deviceCode: "A001",
          deviceName: "板带机",
          deviceModel: "UH890",
          deviceStatus: 1,
          productInfo: [
            {
              productId: "123456",
              producer: "张三",
              productCode: "02",
              createTime: "2021-01-22 08:15:32"
            },
            {
              productId: "123456",
              producer: "李四",
              productCode: "03",
              createTime: "2021-01-22 10:15:32"
            },
            {
              productId: "123456",
              producer: "张三",
              productCode: "02",
              createTime: "2021-01-22 08:15:32"
            }
          ]
        },
        {
          id: 1,
          deviceCode: "A001",
          deviceName: "板带机",
          deviceModel: "UH890",
          deviceStatus: 1,
          productInfo: [
            {
              productId: "123456",
              producer: "张三",
              productCode: "02",
              createTime: "2021-01-22 08:15:32"
            },
            {
              productId: "123456",
              producer: "李四",
              productCode: "03",
              createTime: "2021-01-22 10:15:32"
            },
            {
              productId: "123456",
              producer: "张三",
              productCode: "02",
              createTime: "2021-01-22 08:15:32"
            }
          ]
        },
        {
          id: 1,
          deviceCode: "A001",
          deviceName: "板带机",
          deviceModel: "UH890",
          deviceStatus: 1,
          productInfo: [
            {
              productId: "123456",
              producer: "张三",
              productCode: "02",
              createTime: "2021-01-22 08:15:32"
            },
            {
              productId: "123456",
              producer: "李四",
              productCode: "03",
              createTime: "2021-01-22 10:15:32"
            },
            {
              productId: "123456",
              producer: "张三",
              productCode: "02",
              createTime: "2021-01-22 08:15:32"
            }
          ]
        }
      ]
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
    // 选择设备
    selectItem(item) {
      this.selectItemId = item.id;
      item.isSelected = !item.isSelected;
      this.$forceUpdate();
      if (item.isSelected) {
        this.selectList.push(item.id);
      } else {
        this.selectList.map((res, index) => {
          if (res == item.id) {
            this.selectList.splice(index, 1);
          }
        });
      }
      console.log("item", item, this.selectList);
      //   this.deviceDetailForm = item;
      //   this.deviceDetailVisible = true;
    },
    // 全选
    allSelect(value) {
      this.selectList = [];
      if (this.allSelected) {
        this.deviceList.map(item => {
          item.isSelected = true;
          this.$forceUpdate();
          this.selectList.push(item.id);
        });
      } else {
        this.deviceList.map(item => {
          item.isSelected = false;
          this.$forceUpdate();
          this.selectList = [];
        });
      }

      console.log(this.selectList, this.deviceList);
    },
    // 关联人员
    relationPeople() {
      console.log(this.selectList, this.deviceList);
      if (this.selectList.length == 0) {
        return this.$message({ type: "warning", message: "请先选择设备!" });
      }
      this.relationVisible = true;
    },
    // 关联人员-对话框-选择人员
    selectProducer(val) {
      console.log("val", val);
    },
    // 关联人员-对话框-选择人员-取消
    cancelRelation() {
      this.selelctProducerId = "";
      this.relationVisible = false;
    },
    //关联人员-对话框-选择人员-确定
    confirmRelation() {
      if (!this.selelctProducerId) {
        return this.$message({ type: "warning", message: "请选择关联人员!" });
      }
      this.selelctProducerId = "";
      this.relationVisible = false;
    },
    // 移除关联人员
    removePeople() {
      if (this.selectList.length == 0) {
        return this.$message({ type: "warning", message: "请先选择设备!" });
      }
      this.$confirm("此操作将移除所选设备的关联人员, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    // 停止所选设备
    stopDevice() {
      if (this.selectList.length == 0) {
        return this.$message({ type: "warning", message: "请先选择设备!" });
      }
      this.$confirm("此操作将停止所选设备运作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
        // 停止所选设备
    startDevice() {
      if (this.selectList.length == 0) {
        return this.$message({ type: "warning", message: "请先选择设备!" });
      }
      this.$confirm("此操作将启用所选设备, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    // 返回排班计划
    backPlan() {
      this.$parent.changeRosterPlanShow(true);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.main-options {
  .content-item {
    height: 60vh;
    overflow: auto;
    .item-f {
      display: grid;
      justify-content: space-between;
      grid-template-columns: repeat(auto-fill, 100px);
      grid-gap: 10px;
      padding-top: 10px;
      border-top: 1px solid #e5e5e5;
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
        position: relative;
        .item-top {
        }
        .item-mid {
        }
        .item-bottom {
        }
        .item-selected-img {
          width: 15px;
          height: 15px;
          position: absolute;
          right: 1px;
          top: 1px;
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
      display: flex;
      align-items: center;
      .opt-button {
        margin-left: 20px;
      }
    }
    .right {
    }
  }
  .dialog {
    input::-webkit-input-placeholder {
      font-size: 9px;
      color: #c0c4cc;
    }
    input::-moz-input-placeholder {
      font-size: 9px;
      color: #c0c4cc;
    }
    input::-ms-input-placeholder {
      font-size: 9px;
      color: #c0c4cc;
    }
    .el-dialog__header {
      border-bottom: 1px solid #e5e5e5;
    }
    .el-dialog--center .el-dialog__body {
      text-align: initial;
      // padding: 10px 25px 30px;
      padding: 10px 0;
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
    .relationVisibleMain {
      .relationVisibleMain-top {
        display: flex;
        align-items: center;
        margin-left: 30px;
        margin-right: 30px;
        .search-button {
          margin-left: 10px;
        }
      }
      .mid {
        margin-top: 10px;
        margin-left: 30px;
        margin-right: 30px;
        height: 30vh;
        overflow: auto;
        .item {
          display: flex;
          align-items: center;
          margin-top: 10px;
          .left {
            .left-value {
              color: #606266;
            }
          }
        }
      }
      .bottom {
        border-top: 1px solid #e5e5e5;
        margin-top: 20px;
        padding-top: 10px;
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>