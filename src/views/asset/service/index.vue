<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="98px">
      <el-form-item label="回收用户名称" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入回收用户名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="回收联系方式" prop="wxappPhone">
        <el-input
          v-model="queryParams.wxappPhone"
          placeholder="请输入回收联系方式"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="交易流水编号" prop="transactionNo">
        <el-input
          v-model="queryParams.transactionNo"
          placeholder="请输入交易流水编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="交易支付类型" prop="transactionPayType">
        <el-select
          v-model="queryParams.transactionPayType"
          clearable
          placeholder="请选择交易支付类型"
          size="small"
        >
          <el-option
            v-for="dict in transactionPayTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="交易支付状态" prop="transactionPayStatus">
        <el-select
          v-model="queryParams.transactionPayStatus"
          clearable
          placeholder="请选择交易支付状态"
          size="small"
        >
          <el-option
            v-for="dict in transactionPayStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="交易类型" prop="transactionType">
        <el-select
          v-model="queryParams.transactionType"
          clearable
          placeholder="请选择交易类型"
          size="small"
        >
          <el-option
            v-for="dict in transactionTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="交易支付时间" prop="transactionPayTime">
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
          v-hasPermi="['asset:service:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="recordList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="工场名称" align="center" prop="workshopName" width="150" fixed show-overflow-tooltip />
      <el-table-column label="用户名称(回收)" align="center" prop="userName" width="130" fixed />
      <el-table-column label="联系方式(回收)" align="center" prop="wxappPhone" width="130" fixed />
      <el-table-column label="交易时间(回收)" align="center" prop="transactionTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.transactionTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易支付时间" align="center" prop="transactionPayTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.transactionPayTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易流水编号" align="center" prop="transactionNo" width="230" />
      <el-table-column label="微信流水编号" align="center" prop="wechatSerialNo" width="190" />
      <el-table-column label="交易重量" align="center" prop="transactionWeight" width="130" >
        <template slot-scope="scope">
          <span>{{ scope.row.transactionWeight}}(kg)</span>
        </template>
      </el-table-column>
      <el-table-column label="交易金额" align="center" prop="transactionAmount" width="130" >
        <template slot-scope="scope">
          <span>￥{{ scope.row.transactionAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易服务名称" align="center" prop="transactionServiceName" width="130" show-overflow-tooltip />
      <el-table-column label="交易服务说明" align="center" prop="transactionDescription" width="130" show-overflow-tooltip/>
      <el-table-column label="交易支付类型" align="center" prop="transactionPayType" :formatter="transactionPayTypeFormat" width="130" />
      <el-table-column label="交易支付状态" align="center" prop="transactionPayStatus" :formatter="transactionPayStatusFormat" width="130" />
      <el-table-column label="交易类型" align="center" prop="transactionType" :formatter="transactionTypeFormat" />
      <el-table-column label="备注" align="center" prop="remark" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改工场服务费用记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="工场pkid" prop="workshopPkid">
          <el-input v-model="form.workshopPkid" placeholder="请输入工场pkid" />
        </el-form-item>
        <el-form-item label="用户pkid" prop="userPkid">
          <el-input v-model="form.userPkid" placeholder="请输入用户pkid" />
        </el-form-item>
        <el-form-item label="交易时间" prop="transactionTime">
          <el-date-picker clearable size="small"
            v-model="form.transactionTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择交易时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="交易流水编号" prop="transactionNo">
          <el-input v-model="form.transactionNo" placeholder="请输入交易流水编号" />
        </el-form-item>
        <el-form-item label="交易重量" prop="transactionWeight">
          <el-input v-model="form.transactionWeight" placeholder="请输入交易重量" />
        </el-form-item>
        <el-form-item label="交易金额" prop="transactionAmount">
          <el-input v-model="form.transactionAmount" placeholder="请输入交易金额" />
        </el-form-item>
        <el-form-item label="交易服务名称" prop="transactionServiceName">
          <el-input v-model="form.transactionServiceName" placeholder="请输入交易服务名称" />
        </el-form-item>
        <el-form-item label="交易说明" prop="transactionDescription">
          <el-input v-model="form.transactionDescription" placeholder="请输入交易说明" />
        </el-form-item>
        <el-form-item label="微信流水号" prop="wechatSerialNo">
          <el-input v-model="form.wechatSerialNo" placeholder="请输入微信流水号" />
        </el-form-item>
        <el-form-item label="交易支付时间" prop="transactionPayTime">
          <el-date-picker clearable size="small"
            v-model="form.transactionPayTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择交易支付时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="交易支付类型" prop="transactionPayType">
          <el-select v-model="form.transactionPayType" placeholder="请选择交易支付类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="交易支付状态">
          <el-radio-group v-model="form.transactionPayStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="交易类型" prop="transactionType">
          <el-select v-model="form.transactionType" placeholder="请选择交易类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
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
import { listRecord, getRecord, delRecord, addRecord, updateRecord, exportRecord } from "@/api/asset/service/service";

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
      // 工场服务费用记录表格数据
      recordList: [],
      // 日期范围
      dateRange: [],
      // 交易支付类型数据字典
      transactionPayTypeOptions: [],
      // 交易支付状态数据字典
      transactionPayStatusOptions: [],
      // 交易类型数据字典
      transactionTypeOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: null,
        wxappPhone: null,
        transactionNo: null,
        transactionPayTime: null,
        transactionPayType: null,
        transactionPayStatus: null,
        transactionType: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    };
  },
  created() {
    this.getList();
    this.getDicts("transaction_pay_type").then(response => {
      this.transactionPayTypeOptions = response.data;
    });
    this.getDicts("transaction_pay_status").then(response => {
      this.transactionPayStatusOptions = response.data;
    });
    this.getDicts("transaction_type").then(response => {
      this.transactionTypeOptions = response.data;
    });
  },
  methods: {
    /** 查询工场服务费用记录列表 */
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
        userPkid: null,
        transactionTime: null,
        transactionNo: null,
        transactionWeight: null,
        transactionAmount: null,
        transactionServiceName: null,
        transactionDescription: null,
        wechatSerialNo: null,
        transactionPayTime: null,
        transactionPayType: null,
        transactionPayStatus: "0",
        transactionType: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.resetForm("form");
    },
    // 交易支付类型字典翻译
    transactionPayTypeFormat(row, column) {
      return this.selectDictLabel(this.transactionPayTypeOptions, row.transactionPayType);
    },
    // 交易支付状态字典翻译
    transactionPayStatusFormat(row, column) {
      return this.selectDictLabel(this.transactionPayStatusOptions, row.transactionPayStatus);
    },
    // 交易类型字典翻译
    transactionTypeFormat(row, column) {
      return this.selectDictLabel(this.transactionTypeOptions, row.transactionType);
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
      this.ids = selection.map(item => item.pkid)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加工场服务费用记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const pkid = row.pkid || this.ids
      getRecord(pkid).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改工场服务费用记录";
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
      this.$confirm('是否确认删除工场服务费用记录编号为"' + pkids + '"的数据项?', "警告", {
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
      this.$confirm('是否确认导出所有工场服务费用记录数据项?', "警告", {
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
