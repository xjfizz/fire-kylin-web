<template>
  <div class="order-dialog" v-if="visible">
    <!-- 检测是否已分配取料员 -->
    <el-dialog :title="title" :visible.sync="visible" width="100">
      <div
        class="print-content"
        v-loading="loading"
        element-loading-text="正在加载中..."
        element-loading-spinner="el-icon-loading"
      >
        <div id="orderPrint">
          <div class="print-main">
            <div class="print-left"></div>
            <div class="print-mid">
              <div class="print-top">
                <div class="print-item-title">订单</div>
                <div class="print-item-value" v-if="order.omsOrder">{{order.omsOrder.orderNo}}</div>
              </div>
              <div class="print-order-mid">
                <div class="print-mid-user">
                  <div class="print-user-left">客户</div>
                  <div class="print-user-right" v-if="order.wmsUser">
                    <div class="print-right-top">{{order.wmsUser.userName}}</div>
                    <div class="print-right-bottom">{{order.wmsUser.wxappPhone}}</div>
                  </div>
                </div>
                <div class="print-mid-productInfo">
                  <div class="print-productInfo-left">产品</div>
                  <div class="print-productInfo-mid" v-if="order.omsOrder">
                    <div class="print-mid-top">{{order.serverName || '暂无'}}</div>
                    <div
                      class="print-mid-mid"
                    >{{order.omsOrder.orderSpecification || '暂无'}} {{order.omsOrder.orderColor || '暂无'}}</div>
                    <div class="print-mid-bottom">{{order.omsOrder.orderQuantity || '0'}}打</div>
                  </div>
                </div>
              </div>
              <div class="print-bottom">
                <div class="print-bottom-left">
                  <div class="print-bottom-item">
                    <div class="print-bottom-item-title">经理</div>
                    <div class="print-bottom-item-value">{{order.productionManager}}</div>
                  </div>
                  <div class="print-bottom-item">
                    <div class="print-bottom-item-title">时间</div>
                    <div class="print-bottom-item-value">{{order.printDateTime}}</div>
                  </div>
                </div>
                <div class="print-bottom-right">
                  <div class="print-productInfo-right">
                    <div class="print-order-image">
                      <img :src="order.orderQrcode" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="print-right"></div>
          </div>
        </div>
      </div>
      <div class="bottom-btn">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" v-print="printObj">打印</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { orderPrint } from "@/api/module/production/oms/order/order";
export default {
  name: "orderPrint",
  props: {
    value: {
      type: String,
      default: ""
    },
    // visible: {
    //   type: Boolean,
    //   default: false
    // },

    title: {
      type: String,
      default: ""
    }
  },
  components: {},
  data() {
    return {
      visible: false,
      order: {},
      loading: false,
      printObj: {
        id: "orderPrint", //打印标签的id
        popTitle: "Document" //文件标题
        //   extraCss: 'https://www.google.com,https://www.google.com',
        //   extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>'
      }
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
    // 打开
    open(e) {
      this.visible = true;
      this.loading = true;
      this.getOrderDetail(e);
    },

    // 取消
    cancel() {
      this.visible = false;
    },
    // 获取订单信息
    getOrderDetail(e) {
      let params = {
        orderPkid: e.pkid
      };
      orderPrint(params).then(res => {
        if (res.code == 200) {
          this.order = res.data;
          this.loading = false;
        }
      });
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
    //border-bottom: 1px solid #cac6c6;
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

  //   打印样式-start
  .print-content {
    display: flex;
    justify-content: center;
  }
  .bottom-btn {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  //   打印样式-end
}

#orderPrint {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  font-size: 20px;
  // width: 350px;
  // height: 350px;
  .print-main {
    // border: 1px solid #cac6c6;
    // width: 100%;
    // height: 100%;
    width: 100%;
    height: 100%;
    display: flex;

    .print-left {
      width: 5%;
    }
    .print-mid {
      width: 90%;
      // border-left: 1px solid #cac6c6;
      //  border-right: 1px solid #cac6c6;

      .print-top {
        display: flex;
        align-items: center;
        padding-top: 5px;
        padding-bottom: 5px;

        .print-item-title {
          display: flex;
          align-items: center;
        }
        .print-item-value {
          margin-left: 10px;

          display: flex;
          align-items: center;
        }
      }
      .print-order-mid {
        padding-top: 5px;
        padding-bottom: 2px;
        // border-top: 1px solid #cac6c6;
        // border-bottom: 1px solid #cac6c6;

        .print-mid-user {
          display: flex;

          .print-user-left {
          }
          .print-user-right {
            margin-left: 10px;

            .print-right-top {
            }
            .print-right-bottom {
              margin-top: 5px;
            }
          }
        }
        .print-mid-productInfo {
          margin-top: 5px;
          display: flex;
          height: 120px;

          .print-productInfo-left {
          }
          .print-productInfo-mid {
            margin-left: 10px;
            .print-mid-top {
            }
            .print-mid-mid {
              margin-top: 5px;
            }
            .print-mid-bottom {
              margin-top: 5px;
            }
          }
        }
      }
      .print-bottom {
        margin-top: -30px;
        padding-bottom: 5px;
        display: flex;
        justify-content: space-between;
        .print-bottom-left {
          .print-bottom-item {
            margin-top: 10px;
            display: flex;
            align-items: center;
            .print-bottom-item-title {
            }
            .print-bottom-item-value {
              margin-left: 10px;
            }
          }
        }
        .print-bottom-right {
          .print-productInfo-right {
            right: 10px;
            bottom: 2px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            // width: 80%;
            .print-order-image {
              margin-top: -50px;
              img {
                width: 120px;
                height: 120px;
              }
            }
          }
        }
      }
    }
    .print-right {
      width: 5%;
    }
  }
}
</style>