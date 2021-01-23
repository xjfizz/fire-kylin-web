<template>
  <div class="main">
    <div class="content-item">
      <!--  :class="[(item.deviceStatus == 0 ? 'item-stop' : ''), (item.id == selectItemId ? 'item-select' : '')]" -->
      <div
        class="item"
        :class="item.deviceStatus == 0 ? 'item-stop' : '' "
        v-for="(item,index) in deviceList"
        :key="index"
        @click="selectItem(item)"
      >
         <!-- <el-radio v-model="item.isSelected" label="true"></el-radio> -->
         <!-- <el-image class="item-selected-img" src="../../../../../../assets/images/selected.png"></el-image> -->
        <img v-if="item.isSelected"  class="item-selected-img" src="../../../../../../assets/images/selected.png" />
        <div class="item-top">{{item.deviceCode}}</div>
        <div class="item-mid">{{item.deviceName}}</div>
        <div
          class="item-bottom"
        >{{item.productInfo[0].producer}}/{{item.productInfo[0].productCode}}</div>
      </div>
    </div>
    <div class="content-bottom">
      <div class="left">
        <el-checkbox v-model="allSelected" @change="allSelect()">全选</el-checkbox>
        <el-button
          class="opt-button"
          type="success"
          icon="el-icon-folder-add"
          size="medium"
           @click="allSelect()"
        >关联人员</el-button>
        <el-button
          class="opt-button"
          type="warning"
          icon="el-icon-folder-remove"
          size="medium"
          @click="openOptions()"
        >移除人员</el-button>
        <el-button
          class="opt-button"
          type="danger"
          icon="el-icon-folder-delete"
          size="medium"
          @click="openOptions()"
        >停止设备</el-button>
      </div>
      <div class="right">
        <el-button
          class="opt-button"
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
                v-if="deviceDetailForm.deviceStatus == 0"
                type="danger"
                effect="dark"
                size="medium"
              >异常</el-tag>
              <el-tag
                v-if="deviceDetailForm.deviceStatus == 1"
                type="success"
                effect="dark"
                size="medium"
              >正常</el-tag>
            </div>
          </div>
          <div
            class="item-history-people"
            v-for="(item,index) in (deviceDetailForm.productInfo)"
            :key="index"
            v-if="index < 2"
          >
            <div class="left">关联人员</div>
            <div class="right">
              <div class="right-top">{{item.producer}}/{{item.productCode}}</div>
              <div class="right-bottom">始 {{item.createTime}}</div>
            </div>
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
      deviceDetailVisible: false,
      deviceDetailForm: {},
      allSelected:false,
      selectList:[],
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
         item.isSelected = !item.isSelected
         this.$forceUpdate()
         if( item.isSelected) {
            this.selectList.push(item.id)
         } else {
              this.selectList.map((res,index) => {
                  if(res == item.id) {
                       this.selectList.splice(index,1)
                  }
              })
         }
         console.log('item',item,  this.selectList)
    //   this.deviceDetailForm = item;
    //   this.deviceDetailVisible = true;
    },
    // 全选
    allSelect(value) {
        this.allSelected = !this.allSelected
        this.selectList = []
        if(this.allSelected) {
             this.deviceList.map(item => {
                item.isSelected = true
                 this.$forceUpdate()
                this.selectList.push(item.id)
            })
        } else {
            this.deviceList.map(item => {
                item.isSelected = false
                 this.$forceUpdate()
                this.selectList = []
            })
        }
       
      console.log(this.selectList, this.deviceList)
    },
   
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.main {
  .content-item {
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
      .item-selected-img{
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
      background: #f56c6c;
      color: #ffffff;
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
      .opt-button{
          margin-left: 20px;
      }
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
      padding: 10px 25px 30px;
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
      .item-history-people:last-child {
        color: #c0c1bf;
      }
    }
  }
}
</style>