<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="工场pkid" prop="workshopPkid">
        <el-input
          v-model="queryParams.workshopPkid"
          placeholder="请输入工场pkid"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工场账户pkid" prop="workshopAccountPkid">
        <el-input
          v-model="queryParams.workshopAccountPkid"
          placeholder="请输入工场账户pkid"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="变动时间" prop="modifyTime">
        <el-date-picker clearable size="small"
          v-model="queryParams.modifyTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择变动时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="变动流水编号" prop="modifyNo">
        <el-input
          v-model="queryParams.modifyNo"
          placeholder="请输入变动流水编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="交易类型" prop="transactionType">
        <el-select v-model="queryParams.transactionType" placeholder="请选择交易类型" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="交易支付类型" prop="transactionPayType">
        <el-select v-model="queryParams.transactionPayType" placeholder="请选择交易支付类型" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="变更金额" prop="modifyAmount">
        <el-input
          v-model="queryParams.modifyAmount"
          placeholder="请输入变更金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="变更前金额" prop="beforeModifyAmount">
        <el-input
          v-model="queryParams.beforeModifyAmount"
          placeholder="请输入变更前金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="变更金额类型" prop="modifyAmountType">
        <el-select v-model="queryParams.modifyAmountType" placeholder="请选择变更金额类型" clearable size="small">
          <el-option label="请选择字典生成" value="" />
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
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['reconciliation:record:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['reconciliation:record:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['reconciliation:record:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['reconciliation:record:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="recordList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="账户对账pkid" align="center" prop="pkid" />
      <el-table-column label="工场pkid" align="center" prop="workshopPkid" />
      <el-table-column label="工场账户pkid" align="center" prop="workshopAccountPkid" />
      <el-table-column label="变动时间" align="center" prop="modifyTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.modifyTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="变动流水编号" align="center" prop="modifyNo" />
      <el-table-column label="交易类型" align="center" prop="transactionType" />
      <el-table-column label="交易支付类型" align="center" prop="transactionPayType" />
      <el-table-column label="变更金额" align="center" prop="modifyAmount" />
      <el-table-column label="变更前金额" align="center" prop="beforeModifyAmount" />
      <el-table-column label="变更金额类型" align="center" prop="modifyAmountType" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['reconciliation:record:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['reconciliation:record:remove']"
          >删除</el-button>
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

    <!-- 添加或修改工场账户余额对账记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="工场pkid" prop="workshopPkid">
          <el-input v-model="form.workshopPkid" placeholder="请输入工场pkid" />
        </el-form-item>
        <el-form-item label="工场账户pkid" prop="workshopAccountPkid">
          <el-input v-model="form.workshopAccountPkid" placeholder="请输入工场账户pkid" />
        </el-form-item>
        <el-form-item label="变动时间" prop="modifyTime">
          <el-date-picker clearable size="small"
            v-model="form.modifyTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择变动时间">
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
import { listRecord, getRecord, delRecord, addRecord, updateRecord, exportRecord } from "@/api/asset/reconciliation/reconciliation";

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
        modifyTime: null,
        modifyNo: null,
        transactionType: null,
        transactionPayType: null,
        modifyAmount: null,
        beforeModifyAmount: null,
        modifyAmountType: null,
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
        modifyTime: [
          { required: true, message: "变动时间不能为空", trigger: "blur" }
        ],
        modifyNo: [
          { required: true, message: "变动流水编号不能为空", trigger: "blur" }
        ],
        transactionType: [
          { required: true, message: "交易类型不能为空", trigger: "change" }
        ],
        transactionPayType: [
          { required: true, message: "交易支付类型不能为空", trigger: "change" }
        ],
        modifyAmount: [
          { required: true, message: "变更金额不能为空", trigger: "blur" }
        ],
        beforeModifyAmount: [
          { required: true, message: "变更前金额不能为空", trigger: "blur" }
        ],
        modifyAmountType: [
          { required: true, message: "变更金额类型不能为空", trigger: "change" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询工场账户余额对账记录列表 */
    getList() {
      this.loading = true;
      listRecord(this.queryParams).then(response => {
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
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
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
