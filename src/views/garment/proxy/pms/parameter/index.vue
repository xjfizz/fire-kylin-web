<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="68px">
      <el-form-item label="参数名称" prop="proxyParameterName">
        <el-input
          v-model="queryParams.proxyParameterName"
          clearable
          placeholder="请输入代裁参数名称"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="参数状态" prop="proxyParameterStatus">
        <el-select
          v-model="queryParams.proxyParameterStatus"
          clearable
          placeholder="请选择代裁参数状态"
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in statusOptions"
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
          v-hasPermi="['proxy:parameter:add']"
          icon="el-icon-plus"
          plain
          size="mini"
          type="primary"
          @click="handleAdd"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['proxy:parameter:edit']"
          :disabled="single"
          icon="el-icon-edit"
          plain
          size="mini"
          type="success"
          @click="handleUpdate"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['proxy:parameter:remove']"
          :disabled="multiple"
          icon="el-icon-delete"
          plain
          size="mini"
          type="danger"
          @click="handleDelete"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['proxy:parameter:export']"
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

    <el-table v-loading="loading" :data="parameterList" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55"/>
      <el-table-column align="center" label="参数ID" prop="pkid"/>
      <el-table-column align="center" label="参数名称" prop="proxyParameterName"/>
      <el-table-column align="center" label="参数顺序" prop="proxyParameterSort"/>
      <el-table-column key="proxyParameterStatus" align="center" label="参数状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.proxyParameterStatus"
            active-value="0"
            inactive-value="1"
            @change="handleProxyParameterStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作">
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['proxy:parameter:edit']"
            icon="el-icon-edit"
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
            v-hasPermi="['proxy:parameter:remove']"
            icon="el-icon-delete"
            size="mini"
            type="text"
            @click="handleDelete(scope.row)"
          >删除
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

    <!-- 添加或修改代裁参数管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="500px">
      <el-card>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="参数名称" prop="proxyParameterName">
            <el-input v-model="form.proxyParameterName" placeholder="请输入代裁参数名称"/>
          </el-form-item>
          <el-form-item label="参数顺序" prop="proxyParameterSort">
            <el-input v-model="form.proxyParameterSort" placeholder="请输入代裁参数顺序"/>
          </el-form-item>
          <el-form-item label="参数状态">
            <el-radio-group v-model="form.proxyParameterStatus">
              <el-radio
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictValue"
              >{{ dict.dictLabel }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" placeholder="请输入内容" type="textarea"/>
          </el-form-item>
        </el-form>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addParameter,
  changeProxyParameterStatus,
  delParameter,
  exportParameter,
  getParameter,
  listParameter,
  updateParameter
} from "@/api/garment/proxy/pms/parameter/parameter.js";

export default {
  name: "Parameter",
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
      // 代裁参数管理表格数据
      parameterList: [],
      // 状态数据字典
      statusOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'createTime',
        isAsc: 'desc',
        workshopPkid: null,
        proxyParameterName: null,
        proxyParameterSort: null,
        proxyParameterStatus: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        proxyParameterName: [
          {required: true, message: "代裁参数名称不能为空", trigger: "blur"}
        ],
        proxyParameterSort: [
          {required: true, message: "代裁参数顺序不能为空", trigger: "blur"}
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询代裁参数管理列表 */
    getList() {
      this.loading = true;
      listParameter(this.queryParams).then(response => {
        this.parameterList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 代理材质状态修改
    handleProxyParameterStatusChange(row) {
      let text = row.proxyParameterStatus === "0" ? "启用" : "停用";
      this.$confirm('确认要【' + text + '】 #' + row.proxyParameterName + '# 参数吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return changeProxyParameterStatus(row.pkid, row.proxyParameterStatus);
      }).then(() => {
        this.msgSuccess("代裁参数" + text + "成功");
      }).catch(function () {
        row.proxyParameterStatus = row.proxyParameterStatus === "0" ? "1" : "0";
      });
    },
    // 表单重置
    reset() {
      this.form = {
        pkid: null,
        workshopPkid: null,
        proxyParameterName: null,
        proxyParameterSort: null,
        proxyParameterStatus: "0",
        delFlag: null,
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
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "代裁参数-新增";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const pkid = row.pkid || this.ids
      getParameter(pkid).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "代裁参数-编辑";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.pkid != null) {
            updateParameter(this.form).then(response => {
              this.msgSuccess("代裁参数-编辑成功");
              this.open = false;
              this.getList();
            });
          } else {
            addParameter(this.form).then(response => {
              this.msgSuccess("代裁参数-新增成功");
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
      this.$confirm('是否确认删除代裁参数管理编号为"' + pkids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delParameter(pkids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有代裁参数管理数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportParameter(queryParams);
      }).then(response => {
        this.download(response.msg);
      })
    }
  }
};
</script>
