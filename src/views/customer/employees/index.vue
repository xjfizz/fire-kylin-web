<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :inline="true"
      :model="queryParams"
    >
      <el-form-item label="客户名称" prop="userName">
        <el-input
          v-model="queryParams.userName"
          clearable
          placeholder="请输入客户名称"
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="roleKey">
        <el-input
          v-model="queryParams.userPhone"
          clearable
          placeholder="请输入手机号码"
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
       <el-form-item label="关联销售" prop="userName">
        <el-input
          v-model="queryParams.salesUserName"
          clearable
          placeholder="请输入销售员名称"
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <br/>
      <el-form-item label="用户行业" prop="status">
        <el-select
          v-model="queryParams.userIndustry"
          clearable
          placeholder="请选择行业"
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in industryList"
            :key="dict.pkid"
            :label="dict.industryName"
            :value="dict.pkid"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          end-placeholder="结束日期"
          range-separator="-"
          size="small"
          start-placeholder="开始日期"
          style="width: 240px"
          type="daterange"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          icon="el-icon-search"
          size="mini"
          type="primary"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['wkp:customer:export']"
          icon="el-icon-download"
          plain
          size="mini"
          type="warning"
          @click="handleExport"
          >导出
        </el-button>
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="roleList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column fixed label="编号" prop="pkid" width="120" />
      <el-table-column
        fixed
        :show-overflow-tooltip="true"
        label="客户名称"
        prop="userName"
        width="150"
      />
      <!-- <el-table-column :show-overflow-tooltip="true" label="角色" prop="roleName" width="150"/> -->
      <el-table-column
        :show-overflow-tooltip="true"
        label="昵称"
        prop="wxappNickname"
        width="150"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        label="头像"
        prop="wxappAvatar"
        width="150"
      >
        <template width="100" slot-scope="scope">
          <img
            style="width: 50px; height: 50px; border: none"
            :src="scope.row.wxappAvatar"
          />
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        label="手机号码"
        prop="wxappPhone"
        width="150"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        label="关联销售员"
        prop="salesUserPkid"
        width="100"
      >
        <template width="100" slot-scope="scope">
          <span v-if="scope.row.salesUserName">{{
            scope.row.salesUserName
          }}</span>
          <span v-else>暂未关联</span>
        </template>
      </el-table-column>
      <el-table-column
        label="用户行业"
        align="center"
        prop="userIndustry"
        :formatter="supplierIndustryFormat"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        label="注册地区"
        prop="userAddress"
        width="250"
      />

      <el-table-column
        align="center"
        label="注册时间"
        prop="createTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.registrationTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        align="center"
        class-name="small-padding fixed-width"
        label="操作"
        width="200"
      >
        <template slot-scope="scope">
          <el-button v-hasPermi="['wkp:customer:edit']" size="mini" type="text" icon="el-icon-s-custom" @click="handleAssign(scope.row)">
            <span v-if="!scope.row.salesUserPkid">分配销售</span>
            <span v-else>重新分配</span>
          </el-button>

           <el-button  v-hasPermi="['wkp:customer:remove']"  v-if="scope.row.salesUserPkid" size="mini" type="text" icon="el-icon-delete-solid" @click="handleRemove(scope.row)">
            <span>移除销售</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :limit.sync="queryParams.pageSize"
      :page.sync="queryParams.pageNum"
      :total="total"
      @pagination="getList"
    />
    <!-- 对话框-start -->
    <div class="order-dialog">
      <!-- 销售员分配-dialog -->
      <el-dialog
        :visible.sync="salerVisible"
        center
        title="选择销售员"
        width="400px"
      >
        <div class="relationVisibleMain">
          <div class="relationVisibleMain-top">
            <el-input
              v-model="salerSearchKey"
              clearable
              placeholder="请输入工号/姓名"
               @keyup.enter.native="getsalerList"
            ></el-input>

            <el-button
              class="search-button"
              icon="el-icon-search"
              size="medium"
              type="primary"
              @click="getsalerList()"
              >查询</el-button
            >
          </div>
          <div v-if="salerList.length > 0" class="mid">
            <div v-for="(item, index) in salerList" :key="index" class="item">
              <div class="left">
                <el-radio
                  v-model="selelctSaler.selelctSalerId"
                  :label="item.userId"
                  @change="selectSaler(item)"
                >
                  <span class="left-value">
                    <span>{{ item.nickName }}</span>
                    <span v-if="item.jobNumber">/{{ item.jobNumber }}</span>
                  </span>
                </el-radio>
              </div>
            </div>
          </div>
          <div v-else class="mid mid-no">
            <span>暂无数据</span>
          </div>
          <div slot="footer" class="dialog-footer bottom">
            <el-button class="opt-button" size="medium" @click="cancelSaler()"
              >取消</el-button
            >
            <el-button
              class="opt-button"
              size="medium"
              type="primary"
              @click="confirmSaler()"
              >确认</el-button
            >
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  customerList,
  exportOrder,
  getSalerListApi,
  orderAssignSaler,
  removeSaler
} from "@/api/customer/employees/employees";
import { listAllIndustry } from "@/api/system/workshop/info/info";

export default {
  name: "Role",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      industryList: [],
      roleList: [],
      // 日期范围
      dateRange: [],

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        salesUserName:'',
        userName: undefined,
        userPhone: undefined,
        salesUserPkid:this.$store.state.user.roles.indexOf('SE') > -1 ? this.$store.state.user.userInfo.userId : '',
        userIndustry: undefined,
      },
      selectUserList: [],
      salerVisible: false,
      salerSearchKey: "",
      salerList: [],
      selelctSaler:{
        selelctSalerId: ""
      },
    };
  },
  created() {
    this.getList();
    this.getIndustryList();
    this.getDicts("sys_normal_disable").then((response) => {
      this.statusOptions = response.data;
    });
  },
   methods: {
    /** 查询客户列表 */
    getList() {
      this.loading = true;
      customerList(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.roleList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 查询平台行业列表 */
    getIndustryList() {
      this.loading = true;
      listAllIndustry().then((response) => {
        this.industryList = response.data;
        this.loading = false;
      });
    },
    // 行业状态字典翻译
    supplierIndustryFormat(row, column) {
      return this.formatSupplierIndustry(this.industryList, row.userIndustry);
    },

    formatSupplierIndustry(datas, value) {
      var actions = [];
      Object.keys(datas).some((key) => {
        if (datas[key].pkid == value) {
          actions.push(datas[key].industryName);
          return true;
        }
      });
      return actions.join("");
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      (this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        salesUserName:'',
        userName: undefined,
        userPhone: undefined,
        salesUserPkid:this.$store.state.user.roles.indexOf('SE') > -1 ? this.$store.state.user.userInfo.userId : '',
        userIndustry: undefined,
      }),
        this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.roleId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 分配给销售员
    handleAssign(e) {
      this.selectUserList = [e];
      this.salerVisible = true;
      this.getsalerList();
    },
    /** 获取销售员 */
    getsalerList() {
      // this.loading = true;
      let params = {
        userKey: this.salerSearchKey || "",
      };
      getSalerListApi(params).then((res) => {
        if (res.code == 200) {
          this.salerList = res.data;
        }
      });
    },
    // 选择销售员
    selectSaler(item) {
      this.selelctSaler = item
      this.selelctSaler.selelctSalerId = item.userId;
    },
    // 确认销售弹框
    confirmSaler() {
      if (!this.selelctSaler.selelctSalerId) {
        return this.$message({
          type: "warning",
          message: "请先选择销售员!",
        });
      }

      this.confirmSalerApi();
    },
    // 取消检测员对话框
    cancelSaler() {
      this.salerVisible = false;
    },
    // 分配销售员api
    confirmSalerApi() {
      console.log('this.selectUserList', this.selectUserList)
      let [selectUser] =  this.selectUserList
       let params = {
        customerPkid:selectUser.pkid,
        sellerPkid:this.selelctSaler.selelctSalerId,
        relationPkid:selectUser.relationPkid || '',
        sellerUserName:this.selelctSaler.nickName || '',
        assignStatus:!selectUser.salesUserPkid ? 1 : 2,
        workshopPkid: this.$store.state.user.userInfo.workshopId,
      };
       orderAssignSaler(params).then((res) => {
        if (res.code == 200) {
          this.salerVisible = false;
          this.salerSearchKey = ''
          this.selelctSaler.selelctSalerId = "";
          this.selectUserList = [];
          //this.handleQuery();
          this.getList();
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        }
      });
    },
    // 移除关联销售
    handleRemove(row) {
       this.$confirm(
        "是否确认移除编号为【" + row.pkid + "】的关联销售?",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(()=> {
           this.removeSaleApi(row);
        })
        .then(() => {
          
        });
    },
    removeSaleApi(row) {
     let params = {
       relationPkid:row.relationPkid
      };
      removeSaler(params).then((res) => {
        if (res.code == 200) {
          this.getList();
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        }
      });
    },

    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有客户数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportOrder(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss">
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
    .mid-no {
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
  .order-dialog-bth {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
}
.producting-content-main {
  height: 300px;
  padding: 20px;
  overflow: auto;
  // display: flex;
  // justify-content: center;
}
.producting-content-main-list {
}
.producting-content-main ul {
  padding-left: 0px;
}
.producting-content-main .el-card {
  color: #48aafd;
}
.no-data-product {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999999;
  margin-top: 100px;
}
.producting-content {
}
.producting-content-text {
  margin: 10px 0 10px 0;
}
.producting-content-step {
}
.producting-content-steps {
}
</style>
