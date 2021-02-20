<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="68px">
      <el-form-item label="统计时间" prop="modifyTime">
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
          placeholder="请选择交易类型"
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
    <el-row v-if="statisticsInfo" style="margin-bottom: 10px">
      <el-card>
        <div slot="header">
          <el-tag effect="plain" type="warning">统计详情</el-tag>
        </div>
        <div class="el-table el-table--enable-row-hover el-table--medium">
          <table cellspacing="0" style="width: 100%;">
            <tbody>
            <tr>
              <td>
                <div class="cell">统计时间：</div>
              </td>
              <td>
                <div v-if="statisticsInfo" class="cell">
                  {{ statisticsInfo.startDate }} ~ {{ statisticsInfo.endDate }}
                </div>
              </td>
              <td>
                <div class="cell">变动金额：</div>
              </td>
              <td>
                <div v-if="statisticsInfo" class="cell">
                  <span v-if=" statisticsInfo.modifyAmount != null && statisticsInfo.modifyAmount < 0"
                        style="color: red">
                    ￥-{{ statisticsInfo.modifyAmount | money }} 元
                  </span>
                  <span v-else-if="statisticsInfo.modifyAmount == null "
                        style="color: gray">
                    ￥{{ statisticsInfo.modifyAmount | money }} 元
                  </span>
                  <span v-else style="color: green">
                      ￥{{ statisticsInfo.modifyAmount | money }} 元 ↑
                  </span>
                </div>
              </td>
              <td>
                <div class="cell">生产订单入账：</div>
              </td>
              <td>
                <div v-if="statisticsInfo" class="cell" style="color: green">
                  ￥+{{ statisticsInfo.produceOrderCreditAmount | money }} 元
                </div>
              </td>
              <td>
                <div class="cell">生产订单退款：</div>
              </td>
              <td>
                <div v-if="statisticsInfo" class="cell" style="color:red;">
                  ￥-{{ statisticsInfo.produceOrderRefundAmount | money }} 元
                </div>
              </td>
              <td>
                <div class="cell">提现申请中：</div>
              </td>
              <td>
                <div v-if="statisticsInfo" class="cell" style="color:red;">
                  ￥-{{ statisticsInfo.withdrawalProgressAmount | money }} 元
                </div>
              </td>
              <td>
                <div class="cell">提现完成：</div>
              </td>
              <td>
                <div v-if="statisticsInfo" class="cell" style="color:red;">
                  ￥-{{ statisticsInfo.completeWithdrawAmount  | money }} 元
                </div>
              </td>
              <td>
                <div class="cell">提现失败：</div>
              </td>
              <td>
                <div v-if="statisticsInfo" class="cell" style="color:green;">
                  ￥+{{ statisticsInfo.withdrawalFailedAmount | money }} 元
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </el-card>
    </el-row>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['reconciliation:record:export']"
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
      <el-table-column align="center" label="变动时间" prop="modifyTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.modifyTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="交易流水号" prop="modifyNo"/>
      <el-table-column :formatter="transactionTypeFormat" align="center" label="交易类型" prop="transactionType"/>
      <el-table-column :formatter="transactionPayTypeFormat" align="center" label="支付方式" prop="transactionPayType"/>
      <el-table-column align="center" label="变动金额" prop="modifyAmount">
        <template slot-scope="scope">
          <span
            v-if="scope.row.transactionType === '2' || scope.row.transactionType === '3' || scope.row.transactionType === '4'"
            style="color: red">
            ￥-{{ scope.row.modifyAmount | money }} ↓
          </span>
          <span v-else style="color:green">
            ￥+{{ scope.row.modifyAmount | money }} ↑
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="变动前金额" prop="beforeModifyAmount">
        <template slot-scope="scope">
           <span>
            ￥{{ scope.row.beforeModifyAmount | money }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" prop="remark"/>
    </el-table>

    <pagination
      v-show="total>0"
      :limit.sync="queryParams.pageSize"
      :page.sync="queryParams.pageNum"
      :total="total"
      @pagination="getList"
    />

    <!-- 添加或修改工场账户余额对账记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="工场pkid" prop="workshopPkid">
          <el-input v-model="form.workshopPkid" placeholder="请输入工场pkid"/>
        </el-form-item>
        <el-form-item label="工场账户pkid" prop="workshopAccountPkid">
          <el-input v-model="form.workshopAccountPkid" placeholder="请输入工场账户pkid"/>
        </el-form-item>
        <el-form-item label="变动时间" prop="modifyTime">
          <el-date-picker v-model="form.modifyTime" clearable
                          placeholder="选择变动时间"
                          size="small"
                          type="date"
                          value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="变动流水编号" prop="modifyNo">
          <el-input v-model="form.modifyNo" placeholder="请输入变动流水编号" />
        </el-form-item>
        <el-form-item label="交易类型" prop="transactionType">
          <el-select v-model="form.transactionType" placeholder="请选择交易类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="交易支付类型" prop="transactionPayType">
          <el-select v-model="form.transactionPayType" placeholder="请选择交易支付类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="变更金额" prop="modifyAmount">
          <el-input v-model="form.modifyAmount" placeholder="请输入变更金额" />
        </el-form-item>
        <el-form-item label="变更前金额" prop="beforeModifyAmount">
          <el-input v-model="form.beforeModifyAmount" placeholder="请输入变更前金额" />
        </el-form-item>
        <el-form-item label="变更金额类型" prop="modifyAmountType">
          <el-select v-model="form.modifyAmountType" placeholder="请选择变更金额类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入内容" type="textarea"/>
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
  addRecord,
  delRecord,
  exportRecord,
  getRecord,
  getStatistics,
  listRecord,
  updateRecord
} from "@/api/asset/reconciliation/reconciliation";

export default {
  name: "Record",
  components: {
  },
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
      // 工场账户余额对账记录表格数据
      recordList: [],
      // 交易类型字典数据
      transactionTypeOptions: [],
      // 交易支付方式字典数据
      transactionPayTypeOptions: [],
      // 日期范围
      dateRange: [],
      // 工场账户对账统计信息
      statisticsInfo: {},
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderByColumn: "modifyTime",
        isAsc: "desc",
        workshopPkid: null,
        workshopAccountPkid: null,
        modifyTime: null,
        modifyNo: null,
        transactionType: null,
        transactionPayType: null,
        modifyAmount: null,
        beforeModifyAmount: null,
        modifyAmountType: null,
      },
      // 统计查询参数
      statisticsQueryParams: {
        orderByColumn: "modifyTime",
        isAsc: "desc",
        transactionType: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    };
  },
  created() {
    this.getWkpStatistics();
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
    /** 查询工场账户余额对账记录列表 */
    getWkpStatistics() {
      this.loading = true;
      this.statisticsQueryParams.transactionType = this.queryParams.transactionType;
      getStatistics(this.addDateRange(this.statisticsQueryParams, this.dateRange)).then(response => {
        this.statisticsInfo = response.data;
        this.loading = false;
      });
    },
    /** 查询工场账户余额对账记录列表 */
    getList() {
      this.loading = true;
      listRecord(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.recordList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
        modifyTime: null,
        modifyNo: null,
        transactionType: null,
        transactionPayType: null,
        modifyAmount: null,
        beforeModifyAmount: null,
        modifyAmountType: null,
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
      this.getWkpStatistics();
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
      this.ids = selection.map(item => item.pkid)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加工场账户余额对账记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const pkid = row.pkid || this.ids
      getRecord(pkid).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改工场账户余额对账记录";
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
      this.$confirm('是否确认删除工场账户余额对账记录编号为"' + pkids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRecord(pkids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有工场账户余额对账记录数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportRecord(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
