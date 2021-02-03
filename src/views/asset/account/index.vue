<template>
  <div class="app-container">
    <div class="account-top">
      <el-card style="margin-bottom: 15px">
        <div class="account-top-top">
          <div class="left">
            <div class="left-title"><span>可提现余额:</span></div>
            <div class="left-value">￥{{ wkpAccount.balanceAmount | money }} 元</div>
            <div class="left-btn">
              <el-button size="mini" type="primary">提现</el-button>
            </div>
          </div>
          <div class="right">
            <div class="right-title"><span>提现账户:</span></div>
            <div class="right-value">【交通银行】 62231554444145511</div>
            <div class="right-btn">
              <el-button size="mini" type="warning">管理</el-button>
            </div>
          </div>
        </div>
        <div class="account-top-bottom">
          <div class="left">
            <div class="left-title"><span>未入账金额:</span></div>
            <div class="left-value">￥{{ wkpAccount.unrecordedAmount | money }} 元</div>
          </div>
          <div class="mid">
            <div class="mid-title"><span>提现中:</span></div>
            <div class="mid-value">￥{{ wkpAccount.withdrawProgressAmount | money }} 元</div>
            <div class="mid-btn" @click="goWithdrawList">
              提现明细
              <!-- <el-button  type="text">提现明细</el-button> -->
            </div>
          </div>
          <div class="right">
            <div class="right-title"><span>已提金额:</span></div>
            <div class="right-value">￥{{ wkpAccount.completeWithdrawAmount | money }} 元</div>
          </div>
        </div>
      </el-card>
    </div>
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :inline="true"
      :model="queryParams"
      label-width="80px"
    >
      <el-form-item label="订单编号" prop="relationOrderNo">
        <el-input
          v-model="queryParams.relationOrderNo"
          clearable
          placeholder="请输入关联订单编号"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="流水编号" prop="transactionNo">
        <el-input
          v-model="queryParams.transactionNo"
          clearable
          placeholder="请输入交易流水编号"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="transactionCreateTime">
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
      <el-form-item label="交易类型" prop="transactionType">
        <el-select
          v-model="queryParams.transactionType"
          clearable
          placeholder="请选择配送方式"
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in transactionTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['wkp:record:export']"
          icon="el-icon-download"
          plain
          size="mini"
          type="warning"
          @click="handleExport"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="recordList" @selection-change="handleSelectionChange">
      <el-table-column align="center" label="创建交易时间" prop="transactionCreateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.transactionCreateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="关联订单号" prop="relationOrderNo"/>
      <el-table-column align="center" label="交易流水号" prop="transactionNo"/>
      <el-table-column
        :formatter="transactionTypeFormat"
        align="center"
        label="交易类型"
        prop="transactionType"
      />
      <el-table-column
        :formatter="transactionPayTypeFormat"
        align="center"
        label="支付方式"
        prop="transactionPayType"
      />
      <el-table-column align="center" label="交易金额" prop="transactionAmount">
        <template slot-scope="scope">
          <span v-if="scope.row.transactionType === '2' || scope.row.transactionType === '3'" style="color: red">
            ￥-{{ scope.row.transactionAmount | money }}
          </span>
          <span v-else>
            ￥{{ scope.row.transactionAmount | money }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="完成交易时间" prop="transactionCompleteTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.transactionCompleteTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" prop="remark" show-overflow-tooltip/>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作">
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['wkp:record:edit']"
            icon="el-icon-edit"
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
          >查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :limit.sync="queryParams.pageSize"
      :page.sync="queryParams.pageNum"
      :total="total"
      @pagination="getList"
    />

    <!-- 添加或修改工场账户记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-card>
          <div slot="header" style="padding-left:15px">
            <el-tag effect="plain" type="danger">交易时间轴</el-tag>
          </div>
          <div class="detail-container">
            <div class="step-style">
              <el-steps
                :active="formatStepStatus(form)"
                align-center
                finish-status="success"
              >
                <el-step :description="form.transactionCreateTime" title="创建交易时间"></el-step>
                <el-step :description="form.transactionCompleteTime" title="完成交易时间"></el-step>
              </el-steps>
            </div>
          </div>
          <el-row v-if="form" style="margin-top: 10px">
            <el-card>
              <div slot="header">
                <el-tag effect="plain" type="warning">交易详情</el-tag>
              </div>
              <div class="el-table el-table--enable-row-hover el-table--medium">
                <table cellspacing="0" style="width: 100%;">
                  <tbody>
                  <tr>
                    <td>
                      <div class="cell">创建交易时间：</div>
                    </td>
                    <td>
                      <div v-if="form" class="cell">{{ form.transactionCreateTime }}</div>
                    </td>
                    <td>
                      <div class="cell">完成交易时间：</div>
                    </td>
                    <td>
                      <div v-if="form" class="cell">{{ form.transactionCompleteTime }}</div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="cell">关联单号：</div>
                    </td>
                    <td>
                      <div v-if="form" class="cell">{{ form.relationOrderNo }}</div>
                    </td>
                    <td>
                      <div class="cell">交易流水号：</div>
                    </td>
                    <td>
                      <div v-if="form" class="cell">{{ form.transactionNo }}</div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="cell">交易类型：</div>
                    </td>
                    <td>
                      <div
                        v-if="form"
                        class="cell"
                      >{{ formatTransactionType(form.transactionType) }}
                      </div>
                    </td>
                    <td>
                      <div class="cell">支付方式：</div>
                    </td>
                    <td>
                      <div
                        v-if="form"
                        class="cell"
                      >{{ formatTransactionPayType(form.transactionPayType) }}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="cell">交易金额：</div>
                    </td>
                    <td colspan="3">
                      <div
                        v-if="form.transactionType === '2' || form.transactionType === '3'"
                        class="cell"
                        style="color:red;"
                      >￥-{{ form.transactionAmount | money }}
                      </div>
                      <div v-else class="cell">
                        ￥{{ form.transactionAmount | money }}
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </el-card>
          </el-row>
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addRecord,
  delRecord,
  exportRecord,
  getAccount,
  getRecord,
  listRecord,
  updateRecord
} from "@/api/asset/account/record/record";

export default {
  name: "Record",
  components: {},
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
      // 工场账户对象
      wkpAccount: {},
      // 工场账户记录表格数据
      recordList: [],
      // 日期范围
      dateRange: [],
      // 交易类型字典数据
      transactionTypeOptions: [],
      // 交易支付方式字典数据
      transactionPayTypeOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        workshopPkid: null,
        workshopAccountPkid: null,
        transactionCreateTime: null,
        transactionCompleteTime: null,
        relationOrderPkid: null,
        relationOrderNo: null,
        transactionNo: null,
        transactionType: null,
        transactionPayType: null,
        transactionAmount: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        workshopPkid: [
          { required: true, message: "工场pkid不能为空", trigger: "blur" }
        ],
        workshopAccountPkid: [
          { required: true, message: "工场账户pkid不能为空", trigger: "blur" }
        ],
        transactionCreateTime: [
          { required: true, message: "交易创建时间不能为空", trigger: "blur" }
        ],
        transactionNo: [
          { required: true, message: "交易流水编号不能为空", trigger: "blur" }
        ],
        transactionType: [
          { required: true, message: "交易类型不能为空", trigger: "change" }
        ],
        transactionPayType: [
          { required: true, message: "交易支付类型不能为空", trigger: "change" }
        ],
        transactionAmount: [
          { required: true, message: "交易金额不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getWorkshopAccount();
    this.getList();
    // 从字典数据获取交易类型
    this.getDicts("wkp_transaction_type").then(response => {
      this.transactionTypeOptions = response.data;
    });
    // 从字典数据获取交易支付类型
    this.getDicts("wkp_transaction_pay_type").then(response => {
      this.transactionPayTypeOptions = response.data;
    });
  },
  // 订单金额过滤器
  filters: {
    money(value) {
      if (!value) return "0.00";
      const intPart = Number(value).toFixed(0); //获取整数部分
      const intPartFormat = intPart
        .toString()
        .replace(/(\d)(?=(?:\d{3})+$)/g, "$1,"); //将整数部分逢三一断
      let floatPart = ".00"; //预定义小数部分
      const value2Array = value.toString().split(".");
      //=2表示数据有小数位
      if (value2Array.length === 2) {
        floatPart = value2Array[1].toString(); //拿到小数部分
        if (floatPart.length === 1) {
          //补0,
          return intPartFormat + "." + floatPart + "0";
        } else {
          return intPartFormat + "." + floatPart;
        }
      } else {
        return intPartFormat + floatPart;
      }
    }
  },
  methods: {
    /** 查询工场账户信息 */
    getWorkshopAccount() {
      getAccount().then(response => {
        this.wkpAccount = response.data;
      })
    },
    /** 查询工场账户记录列表 */
    getList() {
      this.loading = true;
      listRecord(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.recordList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        pkid: null,
        workshopPkid: null,
        workshopAccountPkid: null,
        transactionCreateTime: null,
        transactionCompleteTime: null,
        relationOrderPkid: null,
        relationOrderNo: null,
        transactionNo: null,
        transactionType: null,
        transactionPayType: null,
        transactionAmount: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.resetForm("form");
    },
    // 交易类型
    formatTransactionType(value) {
      return this.selectDictLabel(this.transactionTypeOptions, value);
    },
    // 交易支付类型
    formatTransactionPayType(value) {
      return this.selectDictLabel(this.transactionPayTypeOptions, value);
    },
    // 步骤条状态激活
    formatStepStatus(value) {
      if (this.form.transactionCreateTime !== '' && this.form.transactionCompleteTime !== '') {
        return 2;
      } else {
        return 1;
      }
    },
    // 交易类型字典翻译
    transactionTypeFormat(row, column) {
      return this.selectDictLabel(
        this.transactionTypeOptions,
        row.transactionType
      );
    },
    // 交易支付方式字典翻译
    transactionPayTypeFormat(row, column) {
      return this.selectDictLabel(
        this.transactionPayTypeOptions,
        row.transactionPayType
      );
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.pkid);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加工场账户记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const pkid = row.pkid || this.ids;
      getRecord(pkid).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "工场账户记录-详情";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.pkid != null) {
            updateRecord(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRecord(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const pkids = row.pkid || this.ids;
      this.$confirm(
        '是否确认删除工场账户记录编号为"' + pkids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delRecord(pkids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有工场账户记录数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportRecord(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        });
    },
    // 跳转提现明细
    goWithdrawList() {
      this.$router.push({ path: "withdraw" });
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.app-container {
  .account-top {
    font-size: 16px;
    color: #606266;
    padding: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #e5e5e5;

    .account-top-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left {
        display: flex;
        align-items: center;
        flex: 2;
        .left-title {
        }
        .left-value {
          margin-left: 10px;
        }
        .left-btn {
          margin-left: 10px;
        }
      }
      .right {
        display: flex;
        align-items: center;
        flex: 1;

        .right-title {
        }
        .right-value {
          margin-left: 10px;
        }
        .right-btn {
          margin-left: 10px;
        }
      }
    }
    .account-top-bottom {
      margin-top: 10px;

      display: flex;
      align-items: center;
      justify-content: space-between;
      .left {
        display: flex;
        align-items: center;
        flex: 1;
        .left-title {
        }
        .left-value {
          margin-left: 10px;
        }
      }
      .mid {
        display: flex;
        align-items: center;
        flex: 1;

        .mid-title {
          display: flex;
          align-items: center;
        }
        .mid-value {
          display: flex;
          align-items: center;
          margin-left: 10px;
        }
        .mid-btn:hover {
          cursor: pointer;
        }
        .mid-btn {
          margin-left: 10px;
          display: flex;
          align-items: center;
          color: #6044ff;
        }
      }
      .right {
        display: flex;
        align-items: center;
        flex: 1;

        .right-title {
        }
        .right-value {
          margin-left: 10px;
        }
      }
    }
  }
}
</style>

