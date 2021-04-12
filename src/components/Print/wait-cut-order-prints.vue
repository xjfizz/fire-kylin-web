<template>
  <div class="order-dialog" v-if="visible">
    <!-- 检测是否已分配取料员 -->
    <el-dialog :title="title" :visible.sync="visible" width="100">
        <div class="prints-main"
         v-loading="loading"
        element-loading-text="正在加载打印列表..."
        element-loading-spinner="el-icon-loading">
            <div class="print-item" v-for="(item,index) of tableData" :key="index" 
                :id="'printDiv' + index" style="page-break-after:always; margin-top:5px">
                 <div class="print-item-content" style="font-size: 13px;">
                    <div class="item-row" style="display:flex; align-items: center; margin-top:5px">
                        <div class="item-row-left">订单</div>
                        <div class="item-row-right" style="margin-left:10px">{{item.omsProxyOrder.orderNo}}</div>
                    </div>
                     <div class="item-row" style="display:flex; margin-top:5px">
                        <div class="item-row-left">客户</div>
                        <div class="item-row-right" style="margin-left:10px">
                            <div class="row-right-item">{{item.wmsUser.userName || '暂无'}}</div>
                            <div class="row-right-item">{{ phoneHide(item.wmsUser.wxappPhone) || '暂无'}}</div>
                        </div>
                    </div>
                     <div class="item-row" style="display:flex; margin-top:5px">
                        <div class="item-row-left">服务</div>
                        <div class="item-row-right" style="margin-left:10px">
                            <div class="row-right-item"  >{{item.omsProxyOrder.proxyStyleName || '暂无款式名称'}} {{item.omsProxyOrder.proxyMaterialName || '暂无材质名称'}}</div>
                            <div class="row-right-item" style=" margin-top:5px;width:220px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{item.omsProxyOrder.orderDescribe || '暂无参数名称'}}</div>
                            <div class="row-right-item" style="margin-top:5px">{{item.omsProxyOrder.orderSpecification || '暂无规格'}}</div>
                            <div class="row-right-item" style="margin-top:5px">{{item.omsProxyOrder.orderQuantity || '暂无数量'}}件</div>
                            <div class="row-right-item" style="margin-top:5px">{{item.omsProxyOrder.orderColor || '暂无颜色'}}</div>
                        </div>
                    </div>
                     <!-- <div class="item-row" style="display:flex; align-items: center;">
                        <div class="item-row-left">数量</div>
                        <div class="item-row-right" style="margin-left:10px">12打</div>
                    </div> -->
                      <!-- <div class="item-row" style="display:flex; align-items: center;">
                        <div class="item-row-left">颜色</div>
                        <div class="item-row-right" >黄色，绿色，蓝色</div>
                    </div> -->
                     <!-- <div class="item-row" style="display:flex; align-items: center; margin-top:5px">
                        <div class="item-row-left">经理</div>
                        <div class="item-row-right" style="margin-left:10px"> {{item.productionManager || '暂无'}}</div>
                    </div> -->
                     <div class="item-row" style="display:flex; align-items: center;margin-top:5px">
                        <div class="item-row-left">备注</div>
                        <div class="item-row-right" style="margin-left:10px;width:220px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{item.omsProxyOrder.orderNote || '暂无备注'}}</div>
                    </div>
                      <div class="item-row-bottom" style="display:flex;  align-items: center;">
                          <div class="row-left" style="display:flex;  align-items: center; margin-top:5px">
                               <div class="row-left-title">时间</div>
                              <div class="row-left-value" style="margin-left:10px"> {{item.printDateTime || '暂无'}}</div>
                          </div>
                          <div class="row-right">
                               <div class="item-row-img" style="margin-top:-195px;margin-left:40px">
                                   <img width="70" height="70" :src="item.orderQrcode"></img>
                               </div>
                          </div>
                       
                    </div>
                   
                </div>
            </div>
        </div>
      
        <div class="prints-main-bottom-btn">
        <div class="prints-main-bottom-btn-text">共{{tableData.length || 0}}条</div>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="handlePrint">打印</el-button>
       </div>
    </el-dialog>
  </div>
</template>

<script>
import { orderPrints } from "@/api/garment/proxy/oms/order/order.js";
export default {
  name: "orderPrints",
  props: {
    value: {
      type: String,
      default: ""
    },
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
      },
       tableData: []
            
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
      console.log(e)
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
          this.tableData = res.data
         
          setTimeout(()=> {
              this.handlePrint()
              this.loading = false;
          },500)
        }
      });
    },

    // 取消
    cancel() {
      this.visible = false;
    },
    phoneHide(phone) {
      let reg = /^(.{3}).*(.{4})$/
      return phone.replace(reg,'$1****$2')
    },
     handlePrint() {
                var newWin = window.open(""); //新打开一个空窗口
                for (var i = 0; i < this.tableData.length; i++) {
                    var imageToPrint = document.getElementById("printDiv" + i); //获取需要打印的内容
                    newWin.document.write(imageToPrint.outerHTML); //将需要打印的内容添加进新的窗口
                }
                newWin.document.close(); //在IE浏览器中使用必须添加这一句
                newWin.focus(); //在IE浏览器中使用必须添加这一句
                setTimeout(function() {
                   newWin.print(); //打印
                   newWin.close(); //关闭窗口
                }, 100);
            }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.prints-main{
    height: 30vh;
    overflow: auto;
    padding-left: 20px;
    padding-right: 20px;
}
.prints-main .print-item{
    margin-bottom: 20px;
    border: 1px solid #e5e5e5;
    padding: 10px;
}
.prints-main .print-item-content{
    // font-size: 18px;
    font-size: 15px;

}
 .prints-main .item-row{
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    margin-top: 5px;
}
.prints-main .item-row-bottom{
    display: flex;
    align-items: center;
    justify-content: space-between;
    // margin-top: 1px;
}
.prints-main .item-row-left{
    
}
.prints-main .item-row-right{}
.prints-main .row-right-item{}
.prints-main .row-left{}
.prints-main .row-left-title{}
.prints-main .row-left-value{}
.prints-main .row-right{}
.prints-main .item-row-img{}
.prints-main .item-row-img img{
    width: 120px;
    height: 120px;
}

 .prints-main-bottom-btn {
    margin: 20px 20px 0px 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
 .prints-main-bottom-btn-text{
   margin-right: auto;
   font-size: 16px;
   color: #999999;
  }

</style>