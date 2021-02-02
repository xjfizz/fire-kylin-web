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
      <el-form-item label="提现创建时间" prop="withdrawCreateTime">
        <el-date-picker clearable size="small"
          v-model="queryParams.withdrawCreateTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择提现创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="提现完成时间" prop="withdrawCompleteTime">
        <el-date-picker clearable size="small"
          v-model="queryParams.withdrawCompleteTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择提现完成时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="提现流水编号" prop="withdrawNo">
        <el-input
          v-model="queryParams.withdrawNo"
          placeholder="请输入提现流水编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="提现类型" prop="withdrawType">
        <el-select v-model="queryParams.withdrawType" placeholder="请选择提现类型" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="提现支付类型" prop="withdrawPayType">
        <el-select v-model="queryParams.withdrawPayType" placeholder="请选择提现支付类型" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="提现状态" prop="withdrawStatus">
        <el-select v-model="queryParams.withdrawStatus" placeholder="请选择提现状态" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="提现金额" prop="withdrawAmount">
        <el-input
          v-model="queryParams.withdrawAmount"
          placeholder="请输入提现金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['withdraw:record:add']"
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
          v-hasPermi="['withdraw:record:edit']"
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
          v-hasPermi="['withdraw:record:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['withdraw:record:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="recordList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="账户pkid" align="center" prop="pkid" />
      <el-table-column label="工场pkid" align="center" prop="workshopPkid" />
      <el-table-column label="工场账户pkid" align="center" prop="workshopAccountPkid" />
      <el-table-column label="提现创建时间" align="center" prop="withdrawCreateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.withdrawCreateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提现完成时间" align="center" prop="withdrawCompleteTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.withdrawCompleteTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提现流水编号" align="center" prop="withdrawNo" />
      <el-table-column label="提现类型" align="center" prop="withdrawType" />
      <el-table-column label="提现支付类型" align="center" prop="withdrawPayType" />
      <el-table-column label="提现状态" align="center" prop="withdrawStatus" />
      <el-table-column label="提现金额" align="center" prop="withdrawAmount" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['withdraw:record:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['withdraw:record:remove']"
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

    <!-- 添加或修改工场账户提现记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="工场pkid" prop="workshopPkid">
          <el-input v-model="form.workshopPkid" placeholder="请输入工场pkid" />
        </el-form-item>
        <el-form-item label="工场账户pkid" prop="workshopAccountPkid">
          <el-input v-model="form.workshopAccountPkid" placeholder="请输入工场账户pkid" />
        </el-form-item>
        <el-form-item label="提现创建时间" prop="withdrawCreateTime">
          <el-date-picker clearable size="small"
            v-model="form.withdrawCreateTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择提现创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="提现完成时间" prop="withdrawCompleteTime">
          <el-date-picker clearable size="small"
            v-model="form.withdrawCompleteTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择提现完成时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="提现流水编号" prop="withdrawNo">
          <el-input v-model="form.withdrawNo" placeholder="请输入提现流水编号" />
        </el-form-item>
        <el-form-item label="提现类型" prop="withdrawType">
          <el-select v-model="form.withdrawType" placeholder="请选择提现类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="提现支付类型" prop="withdrawPayType">
          <el-select v-model="form.withdrawPayType" placeholder="请选择提现支付类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="提现状态">
          <el-radio-group v-model="form.withdrawStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="提现金额" prop="withdrawAmount">
          <el-input v-model="form.withdrawAmount" placeholder="请输入提现金额" />
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
import { listRecord, getRecord, delRecord, addRecord, updateRecord, exportRecord } from "@/api/asset/withdraw/withdraw";

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
      // 工场账户提现记录表格数据
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
        withdrawCreateTime: null,
        withdrawCompleteTime: null,
        withdrawNo: null,
        withdrawType: null,
        withdrawPayType: null,
        withdrawStatus: null,
        withdrawAmount: null,
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
        withdrawCreateTime: [
          { required: true, message: "提现创建时间不能为空", trigger: "blur" }
        ],
        withdrawNo: [
          { required: true, message: "提现流水编号不能为空", trigger: "blur" }
        ],
        withdrawType: [
          { required: true, message: "提现类型不能为空", trigger: "change" }
        ],
        withdrawPayType: [
          { required: true, message: "提现支付类型不能为空", trigger: "change" }
        ],
        withdrawStatus: [
          { required: true, message: "提现状态不能为空", trigger: "blur" }
        ],
        withdrawAmount: [
          { required: true, message: "提现金额不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询工场账户提现记录列表 */
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
        withdrawCreateTime: null,
        withdrawCompleteTime: null,
        withdrawNo: null,
        withdrawType: null,
        withdrawPayType: null,
        withdrawStatus: "0",
        withdrawAmount: null,
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
      this.title = "添加工场账户提现记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const pkid = row.pkid || this.ids
      getRecord(pkid).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改工场账户提现记录";
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
      this.$confirm('是否确认删除工场账户提现记录编号为"' + pkids + '"的数据项?', "警告", {
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
      this.$confirm('是否确认导出所有工场账户提现记录数据项?', "警告", {
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
