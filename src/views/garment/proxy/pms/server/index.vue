<template>
  <div class="server-main">
    <div
      class="content"
      v-loading="loading"
      element-loading-text="正在保存中"
      element-loading-spinner="el-icon-loading"
    >
      <div class="top">
        <div class="top-left">
          <div class="top-title">款式</div>
          <div class="top-content">
            <div
              v-if="styleList.length > 0"
              class="top-content-item"
              :class="styleListSelectedId == item.pkid ? 'top-content-item-selected' : '' "
              v-for="(item,index) in styleList"
              :index="index"
              @click="selectStyleItem(item)"
            >{{item.proxyStyleName}}</div>
            <div v-if="styleList.length == 0" class="top-content-item-noData">
              <span>暂无款式</span>
            </div>
          </div>
          <div v-if="false" class="top-add">点击添加</div>
        </div>
        <div class="top-right">
          <div class="top-open">
            <el-button type="primary" size="mini">展开</el-button>
          </div>
        </div>
      </div>
      <div class="mid">
        <div class="mid-title">材质</div>
        <div class="mid-content">
          <el-button
            v-if="materialList.length > 0 && item.showFlag == '0' ||  item.showFlag == 'null' "
            type="primary"
            plain
            size="mini"
            v-for="(item,index) in materialList"
            :index="index"
            @click="selectMaterial(item,index)"
          >{{item.proxyMaterialName}}</el-button>
          <div v-if="materialList.length == 0" class="mid-content-noData">暂无数据</div>
        </div>
        <div class="mid-add" v-if="false">点击添加</div>
      </div>
      <div class="bottom">
        <div class="bottom-top">
          <div class="bottom-top-title">
            <div class="title-item">材质名称</div>
            <div class="title-item">服务参数</div>
          </div>
          <div
            v-if="serverList.length > 0"
            class="bottom-content"
            v-for="(item,index) in serverList"
            :index="index"
          >
            <div class="bottom-content-left">
              <div class="content-left-title">{{item.materialName}}</div>
              <div class="content-left-btn">
                <el-button size="mini" @click="delSelectMaterial(item,index)">删除</el-button>
              </div>
            </div>
            <div class="bottom-content-right">
              <div class="content-right-item">
                <div class="item-left">
                  <div class="left-title">面布</div>
                  <div class="left-value">
                    <el-input
                      size="mini"
                      v-model="item.materialParameters[0].clothAmount"
                      style="width:80px"
                      placeholder="输入价格"
                    ></el-input>
                  </div>
                </div>
                <div class="item-right">
                  <div class="right-title">配色</div>
                  <div class="right-value">
                    <el-input
                      size="mini"
                      v-model="item.materialParameters[0].colorSchemeAmount"
                      style="width:80px"
                      placeholder="输入价格"
                    ></el-input>
                  </div>
                </div>
              </div>

              <div class="content-right-item">
                <div class="item-left">
                  <div class="left-title">长袖</div>
                  <!-- <div class="left-value">
                    <el-input
                      size="mini"
                      v-model="item.serverItem[0].sleeveAmount"
                      style="width:80px"
                      placeholder="输入价格"
                    ></el-input>
                  </div>-->
                </div>
                <div class="item-right">
                  <div class="right-title" style="width:120px;">
                    <el-radio v-model="item.materialParameters[0].sleeveStatus" label="0">有</el-radio>
                    <el-radio v-model="item.materialParameters[0].sleeveStatus" label="1">无</el-radio>
                  </div>
                  <div class="right-value">
                    <el-input
                      size="mini"
                      v-model="item.materialParameters[0].sleeveAmount"
                      style="width:80px"
                      placeholder="输入价格"
                    ></el-input>
                  </div>
                </div>
                <div class="right-add-remove" v-if="item.materialParameters.length == 1">
                  <i class="el-icon-circle-plus right-plus" @click="addParameterList(index)"></i>
                </div>
              </div>

            
                         <div
                v-if="item.materialParameters.length > 1"
                class="content-right-item"
                v-for="(item1,index1) in (item.materialParameters).slice(1)"
                :index="index1"
              >
                <div class="item-left">
                  <img
                    v-if="item1.proxyServerStatus == 0"
                    class="left-title-selected-img"
                    src="../../../../../assets/images/selected2.png"
                    @click="changeSlected(item1,'1')"
                  />
                  <img
                    v-if="item1.proxyServerStatus == 1"
                    class="left-title-selected-img"
                    src="../../../../../assets/images/un_selected2.png"
                    @click="changeSlected(item1,'0')"
                  />
                  <!-- <el-checkbox v-model="item1.proxyServerStatus == 0"></el-checkbox> -->
                  <div class="left-title">
                    <span
                      class="left-title-span"
                      :title="item1.clothName"
                      v-if="!item1.isEdit"
                    >{{item1.clothName}}</span>
                    <el-input
                      v-focus
                      v-if="item1.isEdit"
                      size="mini"
                      v-model="item1.clothName"
                      style="width:80px"
                      placeholder="输入价格"
                      @blur="editTitleEditBlur(item1)"
                      @focus="editTitleEditFocus(item1)"
                      @keyup.enter.native="$event.target.blur"
                    ></el-input>
                  </div>
                  <div v-if="!item1.isEdit" class="left-title-edit" @click="openEdit(item1)">
                    <i class="el-icon-edit-outline"></i>
                  </div>
                  <div class="left-value">
                    <el-input
                      size="mini"
                      v-model="item1.clothAmount"
                      style="width:80px"
                      placeholder="输入价格"
                    ></el-input>
                  </div>
                </div>
                <div class="item-right">
                  <div class="right-title">配色</div>
                  <div class="right-value">
                    <el-input
                      size="mini"
                      v-model="item1.colorSchemeAmount"
                      style="width:80px"
                      placeholder="输入价格"
                    ></el-input>
                  </div>
                  <div class="right-add-remove">
                    <i
                      class="el-icon-remove right-remove"
                      @click="removeParameterList(index,index1,item1)"
                    ></i>
                    <i
                      v-if="(item.materialParameters.length -2) == index1"
                      class="el-icon-circle-plus right-plus"
                      @click="addParameterList(index,index1)"
                    ></i>
                  </div>
                </div>
              </div>

 
            </div>
          </div>
          <div v-if="serverList.length  == 0" class="bottom-content-noData">
            <div>暂无数据</div>
          </div>
        </div>
      </div>
      <div class="save-btn">
        <el-button v-if="serverList.length > 0" type="success" size="small" @click="save">保存</el-button>
        <el-button v-else disabled type="success" size="small">保存</el-button>
      </div>
    </div>
    <div class="dialog">
      <el-dialog
        title="新增服务参数"
        :visible.sync="editDialogVisible"
        width="30%"
        :before-close="handleClose"
      >
        <el-form :model="titleForm" label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="参数名称">
                <el-input v-model="titleForm.key1" autocomplete="off" style="width:150px;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="参数值">
                <el-input v-model="titleForm.key2" autocomplete="off" style="width:150px;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="参数名称">
                <el-input disabled v-model="titleForm.key3" autocomplete="off" style="width:150px;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="配色单价">
                <el-input v-model="titleForm.key4" autocomplete="off" style="width:150px;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelEditTitle">取 消</el-button>
          <el-button type="primary" @click="saveEditTitle">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getStyleList,
  getMaterialList,
  getServerList,
  saveServerList,
  delServerList,
  delServerListParameter
} from "@/api/garment/proxy/pms/server/server.js";
export default {
  name: "Index",
  components: {},
  directives: {
    // 注册一个局部的自定义指令 v-focus
    focus: {
      // 指令的定义
      inserted: function(el) {
        // 聚焦元素
        el.querySelector("input").focus();
      }
    }
  },
  data() {
    return {
      editDialogVisible: false,
      loading: false,
      titleForm: {
        key1: "",
        key2: "",
        key3: "配色",
        key4: ""
      },
      styleList: [
        // 款式list
        { id: 1, value: "T恤" },
        { id: 2, value: "衬衣" },
        { id: 3, value: "外套" },
        { id: 4, value: "外套" }
      ],
      materialList: [
        // 材质list
        {
          id: 1,
          value: "皮革",
          parameterList: [
            { key1: "里布", value1: "", key2: "配色", value2: "" },
            { key1: "衬衣", value1: "", key2: "有", value2: "" }
          ]
        },
        { id: 2, value: "面布" },
        { id: 3, value: "牛仔" }
      ],
      styleListSelectedId: "",
      serverList: [], // 服务参数
      basicServer: [
        // 基本服务参数
        { key1: "面布", value1: "", key2: "配色", value2: "" },
        { key1: "长袖", value1: "", key2: "有", value2: "" }
      ],
      parameterList: [
        // 服务参数list
        { key1: "里布", value1: "", key2: "配色", value2: "" },
        { key1: "衬衣", value1: "", key2: "有", value2: "" }
      ],
      insertIndex: 0,
      insertIndex1: 0,
      isChangeCount: 1, // 是否改变
      leave: "", // 离开路径
    };
  },
  created() {
    this.init();
  },
  watch: {
    serverList: {
      handler: function(newVal) {
        console.log("watch", this.isChangeCount);
        this.isChangeCount += 1;
      },
      deep: true
    }
  },

  beforeRouteLeave(to, from, next) {
    // 判断数据是否修改，如果修改按这个执行，没修改，则直接执行离开此页面
    console.log("beforeRouteLeave", this.isChangeCount);
    if (this.isChangeCount > 1) {
      // 弹窗显示
      this.leaveTip(next);
    } else {
      next();
    }
  },

  methods: {
    // 初始化
    init() {
      this.getStyleListApi();
    },

    // 刷新
    refresh() {
      this.getMaterialListApi(this.styleListSelectedId)
    },
    // 缓存数据重置
    initData() {
      this.serverList = [];
      this.insertIndex = 0;
      this.insertIndex1 = 0;
    },
    /**  获取款式list */
    getStyleListApi() {
      let params = {
        workshopPkid: this.$store.state.user.userInfo.workshopId
      };
      getStyleList(params).then(res => {
        if (res.code == 200) {
          this.styleList = res.data;
          this.selectedInit();
        }
      });
    },
    /**  获取材质list */
    getMaterialListApi(pkid) {
      //this.loading = true;
      let params = {
        workshopPkid: this.$store.state.user.userInfo.workshopId,
        stylePkid: pkid
      };
      getMaterialList(params).then(res => {
        if (res.code == 200) {
          this.materialList = res.data.proxyMaterialResultInfo
          this.serverList =  res.data.proxyServerResultInfo
          
            this.isChangeCount = 0
         
          // this.loading = false;
        }
      });
    },
    /**  获取服务参数list */
    getServerListApi(item) {
      let params = {
        workshopPkid: this.$store.state.user.userInfo.workshopId,
        materialPkid: item.pkid,
        stylePkid: item.stylePkid
      };
      getServerList(params).then(res => {
        if (res.code == 200) {
            this.refresh()
          // this.serverList.push(item);
        }
      });
    },

    // 款式，材质list选择中状态初始化
    selectedInit() {
      if (this.styleList.length > 0) {
        this.styleListSelectedId = this.styleList[0].pkid;
        this.getMaterialListApi(this.styleListSelectedId);
      }
    },
    // 弹出编辑标题框
    openEdit(item1) {
      // this.editDialogVisible = true;
      item1.isEdit = !item1.isEdit;
      this.$forceUpdate(); //强制刷新
      console.log(item1, this.serverList);
    },
    // 标题编辑框聚焦事件
    editTitleEditBlur(item1) {
      item1.isEdit = !item1.isEdit;
      this.$forceUpdate(); //强制刷新
      console.log(item1, this.serverList);
    },
    // 标题编辑框聚焦事件
    editTitleEditFocus(item1) {
      //  item1.isEdit = !item1.isEdit
      // this.$forceUpdate() //强制刷新
    },
    // 保存编辑标题
    saveEditTitle() {
      this.addServerList();
      this.titleForm = {
        key1: "",
        key2: "",
        key3: "配色",
        key4: ""
      },
      this.editDialogVisible = false
    },
    // 取消新增
    cancelEditTitle() {
      (this.titleForm = {
        key1: "",
        key2: "",
        key3: "配色",
        key4: ""
      }),
        (this.editDialogVisible = false);
    },
    // 服务参数插入
    addServerList() {
      console.log(
        "parameterList",
        this.serverList,
        this.insertIndex,
        this.insertIndex1,
        this.titleForm
      );
      if (this.insertIndex1 == undefined) {
        this.serverList[this.insertIndex].materialParameters.push({
          clothName: this.titleForm.key1,
          clothAmount: this.titleForm.key2,
          colorSchemeAmount: this.titleForm.key4,
          proxyServerStatus: "0"
        });
      } else {
        this.serverList[this.insertIndex].materialParameters.push({
          clothName: this.titleForm.key1,
          clothAmount: this.titleForm.key2,
          colorSchemeAmount: this.titleForm.key4,
          proxyServerStatus: "0"
        });
      }
    },
    // 服务参数删除
    removeServerList(item1) {
      console.log("removeServerList", this.insertIndex, this.insertIndex1);
      let listLength = this.serverList[this.insertIndex].materialParameters.length - 1;
      this.serverList[this.insertIndex].materialParameters.splice(
        this.insertIndex1 + 1,
        1
      );
      //  listLength - this.insertIndex1,
      if (item1.pkid) {
        this.delServerListApi(item1);
      }
    },
    // 取消
    handleClose() {
      (this.titleForm = {
        key1: "",
        key2: "",
        key3: "配色",
        key4: ""
      }),
        (this.editDialogVisible = false);
    },
    // 选择款式
    selectStyleItem(item) {
      console.log("beforeRouteLeave", this.isChangeCount);
      if (this.isChangeCount > 1) {
        // 弹窗显示
        this.$confirm(`当前有未保存内容,是否继续离开?`, "提示", {
          confirmButtonText: "取消操作",
          cancelButtonText: "继续离开",
          type: "warning"
        })
          .then(() => {
          })
          .catch(() => {
              this.isChangeCount = 0
              this.selectStyleItemNext(item);
           });
      } else {
        this.isChangeCount = 0
        this.selectStyleItemNext(item);
      }
    },
    // 选择款式跳转
    selectStyleItemNext(item) {
      this.initData();
      this.styleListSelectedId = item.pkid;
      this.getMaterialListApi(item.pkid);
      // this.selectStyleItem()
    },
    // 选择材质
    selectMaterial(item, index) {
     // this.materialList.splice(index, 1);
      this.getServerListApi(item);
      this.materialListSelectedId = item.pkid;
      // this.serverList.push(item);
    },
    // 删除选择的材质
    delSelectMaterial(item, index) {
      // this.materialList.push(item.materialItem);
      // this.serverList.splice(index, 1);
      this.$confirm(`是否确认删除?`, "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delServerListApiParameter(item);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    // 新增服务参数
    addParameterList(index, index1) {
      this.editDialogVisible = true;
      this.insertIndex = index;
      this.insertIndex1 = index1;
    },
    // 删除服务参数
    removeParameterList(index, index1, item1) {
      this.insertIndex = index;
      this.insertIndex1 = index1;
      this.$confirm(`是否确认删除?`, "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.removeServerList(item1);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    // 提示是否离开页面
    leaveTip(next) {
      this.$confirm(`当前有未保存内容,是否继续离开?`, "提示", {
        confirmButtonText: "取消操作",
        cancelButtonText: "继续离开",
        type: "warning"
      })
        .then(() => {})
        .catch(() => {
          next();
        });
    },
    // 删除接口api
    delServerListApi(item1) {
      let params = {
        serverPkid: item1.pkid
      };
      delServerList(params).then(res => {
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        }
      });
    },
      // 删除接口api
    delServerListApiParameter(item1) {
      console.log('item1',item1)
      this.loading  = true
      let params = {
        workshopPkid: this.$store.state.user.userInfo.workshopId,
        stylePkid: this.styleListSelectedId,
        materialPkid:item1.proxyMaterialPkid
      };
      delServerListParameter(params).then(res => {
        if (res.code == 200) {
          this.loading  = false
          this.refresh()
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        }
      });
    },
    // 勾选处理
    changeSlected(item1, status) {
      item1.proxyServerStatus = status;
    },
    // 保存服务 saveServerList
    save() {
      this.loading = true;
      console.log("save", this.serverList);
      let parameterParamInfo = [];
      this.serverList.map((item, index) => {
        item.materialParameters.map((item1, index1) => {
          let res = {
            clothAmount: item1.clothAmount,
            clothName: item1.clothName,
            colorSchemeAmount: item1.colorSchemeAmount,
            materialPkid: item.proxyMaterialPkid,
            pkid: item1.pkid || null,
            sleeveAmount: item1.sleeveAmount,
            sleeveStatus: item1.sleeveStatus,
            proxyServerStatus: item1.proxyServerStatus
          };
          parameterParamInfo.push(res);
        });
      });
      console.log("parameterParamInfo", parameterParamInfo);
      let params = {
        parameterParamInfo,
        stylePkid: this.styleListSelectedId,
        workshopPkid: this.$store.state.user.userInfo.workshopId
      };
      saveServerList(params).then(res => {
        if (res.code == 200) {
          this.refresh()
          this.loading = false;
          this.$message({
            type: "success",
            message: "保存成功!"
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.server-main {
  padding: 20px;
}
.server-main .save-btn {
  position: fixed;
  right: 100px;
  bottom: 100px;
}
.server-main .top {
  // padding: 10px 0  10px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e5e5e5;
}
.server-main .top .top-left {
  display: flex;
  align-items: center;
  width: 100%;
}
.server-main .top-title {
  font-size: 15px;
  color: #999999;
  min-width: 30px;
}
.server-main .top-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  //  width: 100%;
}
.server-main .top-content-item {
  margin-left: 10px;
  background-color: #ffffff;
  font-size: 15px;
  color: #333333;
  padding: 6px 18px 6px 18px;
  border-radius: 5px 5px 0 0;
}
.server-main .top-content-item-noData {
  display: flex;
  margin-left: 20px;
  // justify-content: center;
  align-items: center;
  color: #999999;
  font-size: 15px;
  width: 100%;
}
.server-main .top-content-item-selected {
  background-color: #1890ff;
  color: #f1eded;
}
.server-main .top-content-item:hover {
  cursor: pointer;
  background-color: #1890ff;
  color: #f1eded;
}
.server-main .top-add {
}
.server-main .top-right {
}
.server-main top-open {
}
.mid {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.mid .mid-title {
  font-size: 15px;
  color: #999999;
  min-width: 30px;
}
.mid .mid-content {
  width: 80%;
  margin-left: 10px;
}
.mid .mid-content-noData {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999999;
}
.mid .mid-add {
}
.bottom {
  margin-top: 10px;
}
.bottom-top {
  // border-bottom: 1px solid #e5e5e5;
  padding: 5px 0 5px 0;
}
.bottom-top-title {
  display: flex;
  align-items: center;
  margin-left: 40px;
}
.title-item {
  font-size: 15px;
  color: #777575;
  margin-right: 50px;
}
.bottom-content {
  display: flex;
  padding: 10px;
  background-color: #f9f7f7;
  margin-top: 10px;
  margin-bottom: 20px;
  border-radius: 10px;
  min-height: 200px;
}
.bottom-content-noData {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 20px;
  border-radius: 10px;
  min-height: 300px;
  color: #999999;
}
.bottom-content-left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  margin-left: 20px;
}
.content-left-title {
  margin-top: 4px;
  font-size: 15px;
  color: #777575;
}
.content-left-btn {
  margin-top: 10px;
}
.bottom-content-right {
  margin-left: 62px;
}
.content-right-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}
.content-right-item .item-left {
  display: flex;
  align-items: center;
}
.item-left img:hover {
  cursor: pointer;
}
.content-right-item .left-title-selected-img {
  position: absolute;
  left: -30px;
}
.content-right-item .left-title-edit {
  position: absolute;
  left: 60px;
  display: flex;
  align-items: center;
}
.content-right-item .left-title-edit:hover {
  cursor: pointer;
}
.content-right-item .left-title {
  font-size: 15px;
  color: #666666;
  width: 60px;
}
.content-right-item .left-title-span {
  width: 60px;
  overflow: hidden; /*超出部分隐藏*/
  text-overflow: ellipsis; /*超出部分省略号表示*/
  white-space: nowrap; /*强制单行显示*/
  display: block;
}

.content-right-item .left-value {
  margin-left: 30px;
  min-width: 40px;
}
.content-right-item .item-right {
  display: flex;
  align-items: center;
  margin-left: 30px;
}
.content-right-item .right-title {
  font-size: 15px;
  color: #666666;
  min-width: 40px;
}
.content-right-item .right-value {
  margin-left: 20px;
  min-width: 40px;
}
// .el-input--mini .el-input__inner{
//   height: 20px!important;
//   line-height: 20px!important;
// }
.content-right-item .right-add-remove {
  margin-left: 10px;
}
.right-add-remove .right-remove {
  color: #1890ff;
}
.right-add-remove .right-remove:hover {
  cursor: pointer;
}
.right-add-remove .right-plus {
  color: #1890ff;
  margin-left: 10px;
}
.right-add-remove .right-plus:hover {
  cursor: pointer;
}
</style>
