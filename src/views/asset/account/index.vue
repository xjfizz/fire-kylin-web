<template>
  <div class="app-container">
    <div class="account-top">
      <div class="account-top-top">
        <div class="left">
          <div class="left-title">可提现余额:</div>
          <div class="left-value">8000元</div>
          <div class="left-btn">
            <el-button size="mini" type="primary">提现</el-button>
          </div>
        </div>
        <div class="right">
          <div class="right-title">提现账户:</div>
          <div class="right-value">【交通银行】 62231554444145511</div>
          <div class="right-btn">
            <el-button size="mini" type="success">管理</el-button>
          </div>
        </div>
      </div>
      <div class="account-top-bottom">
        <div class="left">
          <div class="left-title">未入账:</div>
          <div class="left-value">8000.00元</div>
        </div>
        <div class="mid">
          <div class="mid-title">提现中:</div>
          <div class="mid-value">80000元</div>
          <div class="mid-btn" @click="goWithdrawList">
            提现明细
            <!-- <el-button  type="text">提现明细</el-button> -->
          </div>
        </div>
        <div class="right">
          <div class="right-title">已提现</div>
          <div class="right-value">30元</div>
        </div>
      </div>
    </div>
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="80px"
    >
      <el-form-item label="订单编号" prop="relationOrderNo">
        <el-input
          v-model="queryParams.relationOrderNo"
          placeholder="请输入关联订单编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="流水编号" prop="transactionNo">
        <el-input
          v-model="queryParams.transactionNo"
          placeholder="请输入交易流水编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="transactionCreateTime">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="交易类型" prop="transactionType">
        <el-select
          v-model="queryParams.transactionType"
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
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['wkp:record:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="recordList" @selection-change="handleSelectionChange">
      <el-table-column label="创建交易时间" align="center" prop="transactionCreateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.transactionCreateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联订单号" align="center" prop="relationOrderNo" />
      <el-table-column label="交易流水号" align="center" prop="transactionNo" />
      <el-table-column
        label="交易类型"
        align="center"
        prop="transactionType"
        :formatter="transactionTypeFormat"
      />
      <el-table-column
        label="支付方式"
        align="center"
        prop="transactionPayType"
        :formatter="transactionPayTypeFormat"
      />
      <el-table-column label="交易金额" align="center" prop="transactionAmount" />
      <el-table-column label="完成交易时间" align="center" prop="transactionCompleteTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.transactionCompleteTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['wkp:record:edit']"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改工场账户记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="工场pkid" prop="workshopPkid">
          <el-input v-model="form.workshopPkid" placeholder="请输入工场pkid" />
        </el-form-item>
        <el-form-item label="工场账户pkid" prop="workshopAccountPkid">
          <el-input v-model="form.workshopAccountPkid" placeholder="请输入工场账户pkid" />
        </el-form-item>
        <el-form-item label="交易创建时间" prop="transactionCreateTime">
          <el-date-picker
            clearable
            size="small"
            v-model="form.transactionCreateTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择交易创建时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="交易完成时间" prop="transactionCompleteTime">
          <el-date-picker
            clearable
            size="small"
            v-model="form.transactionCompleteTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择交易完成时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="关联订单pkid" prop="relationOrderPkid">
          <el-input v-model="form.relationOrderPkid" placeholder="请输入关联订单pkid" />
        </el-form-item>
        <el-form-item label="关联订单编号" prop="relationOrderNo">
          <el-input v-model="form.relationOrderNo" placeholder="请输入关联订单编号" />
        </el-form-item>
        <el-form-item label="交易流水编号" prop="transactionNo">
          <el-input v-model="form.transactionNo" placeholder="请输入交易流水编号" />
        </el-form-item>
        <el-form-item label="交易类型" prop="transactionType">
          <el-select v-model="form.transactionType" placeholder="请选择交易类型">
            <el-option label="请选择字典生成" value />
          </el-select>
        </el-form-item>
        <el-form-item label="交易支付类型" prop="transactionPayType">
          <el-select v-model="form.transactionPayType" placeholder="请选择交易支付类型">
            <el-option label="请选择字典生成" value />
          </el-select>
        </el-form-item>
        <el-form-item label="交易金额" prop="transactionAmount">
          <el-input v-model="form.transactionAmount" placeholder="请输入交易金额" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listRecord,
  getRecord,
  delRecord,
  addRecord,
  updateRecord,
  exportRecord
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
  methods: {
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
        row.transactionType
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
        this.title = "修改工场账户记录";
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

<style rel="stylesheet/scss" lang="scss">
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

