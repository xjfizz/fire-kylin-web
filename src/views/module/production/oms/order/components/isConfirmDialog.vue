<template>
  <div class="order-dialog">
    <!-- 检测是否已分配取料员 -->
    <el-dialog title="已确认订单" :visible.sync="visible" width="150">
      <el-table :data="isPickList"  height="300"  @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="id" label="订单编号" ></el-table-column>
        <el-table-column prop="statusText" label="取料状态" ></el-table-column>
      </el-table>
      <div class="order-dialog-bth">
        <el-button type="primary" @click="cancelSelected()">取消所选</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>


export default {
  name: "isPickDialog",
  props: {
    value: {
      type: String,
      default: ""
    },
    // visible: {
    //   type: Boolean,
    //   default: false
    // },
      isPickList: {
      type: Array,
      default: []
    }
  },
  components: {
   
  },
  data() {
    return {
      visible:false,
      orderList:[] // 选择的已取料订单
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
      // 打开对话框
      open() {
          this.visible = true
      },
      // 关闭对话框
      close() {
          this.visible = false
      },
      // 选择已取料订单
      handleSelectionChange(e) {
          console.log(e)
          this.orderList = e.map(item => item.id);
      },
      // 取消所选
      cancelSelected() {
          this.close()
        this.$parent.cancelSelected(this.orderList)
      }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.order-dialog {
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
      .mid-no{
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 15px;
        color: #999999;
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
    .order-dialog-bth{
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
    }
  }
</style>