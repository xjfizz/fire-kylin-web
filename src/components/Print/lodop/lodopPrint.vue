<template>
  <el-button
    plain
    :type="type"
    :size="size"
    :icon="icon"
   >{{value}}</el-button>
  <!--  @click="lodopPrint" -->
</template>

<script>
import { getLodop } from "./LodopFuncs";
import {
  orderPrint,
  orderPrints
} from "@/api/module/production/oms/order/order";
export default {
  name: "lodopPrint",
  props: {
    icon: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      loading: false,
      orderList: []
    };
  },

  methods: {
    // 打开
    open(e) {
      console.log(e);
      this.visible = true;
      this.loading = true;
      this.getOrderList(e);
    },
    // 获打印列表取
    getOrderList(e) {
      let params = {
        orderPkids: e
      };
      orderPrints(params).then(res => {
        if (res.code == 200) {
          this.orderList = res.data;
          this.lodopPrint(this.orderList);
          this.loading = false;
        }
      });
    },
    lodopPrint(e) {
      var { LODOP, lodopMessage } = getLodop();
      if (lodopMessage) {
        this.$alert(lodopMessage, "LODOP启动错误", {
          dangerouslyUseHTMLString: true
        });
      }
    // 遍历打印
      e.map(item => {
        //打印初始化
        LODOP.PRINT_INIT(`订单打印:${item.omsOrder.orderNo}}`);
        //设置纸张大小（横向打印，宽0，高0，A4纸张）
        LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
        //新建页
        LODOP.NEWPAGE();
        //学生课表头
        //字体大小
        LODOP.SET_PRINT_STYLE("FontSize", 12);
        //是否粗体
        LODOP.SET_PRINT_STYLE("Bold", 1);

        //设置打印文本内容

        LODOP.ADD_PRINT_TEXT(10, 10, `100`, 25, "订单"); // 订单 O9MS12202154678
        LODOP.ADD_PRINT_TEXT(10, 60, `100%`, 25, item.omsOrder.orderNo); //  O9MS12202154678

        LODOP.ADD_PRINT_TEXT(35, 10, `100`, 25, "客户"); // 客户
        LODOP.ADD_PRINT_TEXT(
          35,
          60,
          `100%`,
          25,
          item.wmsUser.userName || "暂无"
        ); // 苏铭
        LODOP.ADD_PRINT_TEXT(
          60,
          60,
          `100%`,
          25,
          item.wmsUser.wxappPhone || "暂无"
        ); // 18895330778

        LODOP.ADD_PRINT_TEXT(85, 10, `100%`, 25, "产品"); // 产品
        LODOP.ADD_PRINT_TEXT(
          85,
          60,
          `100%`,
          25,
          item.serverName || "暂无服务名称"
        ); // 帽檐A001
        LODOP.ADD_PRINT_TEXT(
          105,
          60,
          `100%`,
          25,
          item.omsOrder.orderSpecification || "暂无规格"
        ); // 3X2cm
        LODOP.ADD_PRINT_TEXT(
          125,
          60,
          `100%`,
          25,
          `${item.omsOrder.orderQuantity || "暂无数量"} 打`
        ); // 4打
        LODOP.ADD_PRINT_TEXT(
          145,
          60,
          `100%`,
          25,
          item.omsOrder.orderColor || "暂无颜色"
        ); // 黄色,绿色

        LODOP.ADD_PRINT_TEXT(170, 10, `100%`, 25, "经理"); // 备注
        LODOP.ADD_PRINT_TEXT(
          170,
          60,
          `100%`,
          25,
          item.productionManager || "暂无"
        ); // 急,快

        LODOP.ADD_PRINT_TEXT(195, 10, `100%`, 25, "时间"); // 黄色,绿色
        LODOP.ADD_PRINT_TEXT(195, 60, `100%`, 25, item.printDateTime || "暂无"); // ,2020-03-01 12:15:15

        LODOP.ADD_PRINT_IMAGE(
          10,
          260,
          100,
          100,
          "<img border='0' src='https://juxiang-kylin.obs.cn-east-3.myhuaweicloud.com/images/2021/03/22/16163915582255596.jpg'width='100%' height='250'/>"
        );
        LODOP.SET_PRINT_STYLEA(0, "Stretch", 1); //(可变形)扩展缩放模式

        // LODOP.PREVIEW();
        LODOP.PRINT()
      });
    }
  }
};
</script>

<style scoped>
</style>