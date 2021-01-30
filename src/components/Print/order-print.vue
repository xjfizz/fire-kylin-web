<template>
  <div class="order-dialog" v-if="visible">
    <!-- 检测是否已分配取料员 -->
    <el-dialog :title="title" :visible.sync="visible" width="100">
      <div class="print-content">
        <div id="orderPrint">
          <div class="print-main" >
            <div class="left"></div>
            <div class="mid">
              <div class="top">
                <div class="item-title">订单</div>
                <div class="item-value" v-if="order.omsOrder">{{order.omsOrder.orderNo}}</div>
              </div>
              <div class="order-mid">
                <div class="mid-user">
                  <div class="user-left">客户</div>
                  <div class="user-right" v-if="order.wmsUser">
                    <div class="right-top">{{order.wmsUser.userName}}</div>
                    <div class="right-bottom">{{order.wmsUser.wxappPhone}}</div>
                  </div>
                </div>
                <div class="mid-productInfo">
                  <div class="productInfo-left">产品</div>
                  <div class="productInfo-mid"  v-if="order.omsOrder">
                    <div class="mid-top">{{order.serverName || '暂无'}}</div>
                    <div class="mid-mid">{{order.omsOrder.orderSpecification || '暂无'}} {{order.omsOrder.orderColor || '暂无'}}</div>
                    <div class="mid-bottom">{{order.omsOrder.orderQuantity || '0'}}个</div>
                  </div>
                </div>
              </div>
              <div class="bottom">
                <div class="bottom-left">
                  <div class="bottom-item">
                    <div class="bottom-item-title">经理</div>
                    <div class="bottom-item-value">{{order.productionManager}}</div>
                  </div>
                  <div class="bottom-item">
                    <div class="bottom-item-title">时间</div>
                    <div class="bottom-item-value">{{order.printDateTime}}</div>
                  </div>
                </div>
                <div class="bottom-right">
                  <div class="productInfo-right">
                    <div class="order-image">
                      <img
                        :src="order.orderQrcode"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="right"></div>
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
import {
  orderPrint
} from "@/api/module/production/oms/order/order";
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
      order:{},
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
      this.getOrderDetail(e)
    },

    // 取消
    cancel() {
      this.visible = false;
    },
    // 获取订单信息
     getOrderDetail(e) {
         let params = {
             orderPkid:e.pkid
         }
      orderPrint(params).then(res => {
          if(res.code == 200) {
              this.order = res.data
          }
      })
    },
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
    height:100%;
    display: flex;
    
    .left {
      width: 5%;
    }
    .mid {
      width: 90%;
      // border-left: 1px solid #cac6c6;
      //  border-right: 1px solid #cac6c6;

      .top {
        display: flex;
        align-items: center;
        padding-top: 5px;
        padding-bottom: 5px;

        .item-title {
          display: flex;
          align-items: center;
        }
        .item-value {
          margin-left: 10px;

          display: flex;
          align-items: center;
        }
      }
      .order-mid {
        padding-top: 5px;
        padding-bottom: 2px;
        // border-top: 1px solid #cac6c6;
        // border-bottom: 1px solid #cac6c6;

        .mid-user {
          display: flex;

          .user-left {
          }
          .user-right {
            margin-left: 10px;

            .right-top {
            }
            .right-bottom {
              margin-top: 5px;
            }
          }
        }
        .mid-productInfo {
          margin-top: 5px;
          display: flex;
          height: 120px;

          .productInfo-left {
          }
          .productInfo-mid {
            margin-left: 10px;
            .mid-top {
            }
            .mid-mid {
              margin-top: 5px;
            }
            .mid-bottom {
              margin-top: 5px;
            }
          }
        }
      }
      .bottom {
        margin-top: -30px;
        padding-bottom: 5px;
        display: flex;
        justify-content: space-between;
        .bottom-left {
          .bottom-item {
            margin-top: 10px;
            display: flex;
            align-items: center;
            .bottom-item-title {
            }
            .bottom-item-value {
              margin-left: 10px;
            }
          }
        }
        .bottom-right {
          .productInfo-right {
            right: 10px;
            bottom: 2px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            // width: 80%;
            .order-image {
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
    .right {
      width: 5%;
    }
  }
}
</style>