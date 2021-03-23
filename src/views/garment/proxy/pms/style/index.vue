<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="68px">
      <el-form-item label="款式名称" prop="proxyStyleName">
        <el-input
          v-model="queryParams.proxyStyleName"
          clearable
          placeholder="请输入代裁款式名称"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="款式状态" prop="proxyStyleStatus">
        <el-select
          v-model="queryParams.proxyStyleStatus"
          clearable
          placeholder="请选择款式状态"
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
      <el-form-item label="含税状态" prop="proxyStyleRateStatus">
        <el-select
          v-model="queryParams.proxyStyleRateStatus"
          clearable
          placeholder="请选择款式含税状态"
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in serverTaxStatusOptions"
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
          v-hasPermi="['proxy:style:add']"
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
          v-hasPermi="['proxy:style:edit']"
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
          v-hasPermi="['proxy:style:remove']"
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
          v-hasPermi="['proxy:style:export']"
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

    <el-table v-loading="loading" :data="styleList" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55"/>
      <el-table-column align="center" label="款式ID" prop="pkid"/>
      <el-table-column align="center" label="款式名称" prop="proxyStyleName"/>
      <el-table-column align="center" label="款式单位" prop="proxyStyleUnit"/>
      <el-table-column align="center" label="款式顺序" prop="proxyStyleSort"/>
      <el-table-column align="center" label="款式税率(%)" prop="proxyStyleRate">
        <template slot-scope="scope">
          <span>{{ scope.row.proxyStyleRate }}%</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="含税状态" prop="proxyStyleRateStatus">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.proxyStyleRateStatus === '0'" type="success">
            {{ formatServerTaxStatus(scope.row.proxyStyleRateStatus) }}
          </el-tag>
          <el-tag v-else type="danger">{{ formatServerTaxStatus(scope.row.proxyStyleRateStatus) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column key="proxyStyleStatus" align="center" label="款式状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.proxyStyleStatus"
            active-value="0"
            inactive-value="1"
            @change="handleProxyStyleStatusChange(scope.row)"
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
            v-hasPermi="['proxy:style:edit']"
            icon="el-icon-edit"
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
            v-hasPermi="['proxy:style:remove']"
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

    <!-- 添加或修改代裁款式管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="500px">
      <el-card>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="款式名称" prop="proxyStyleName">
            <el-input v-model="form.proxyStyleName" placeholder="请输入代裁款式名称"/>
          </el-form-item>
          <el-form-item label="款式单位" prop="proxyStyleUnit">
            <el-input v-model="form.proxyStyleUnit" placeholder="请输入代裁款式单位"/>
          </el-form-item>
          <el-form-item label="款式顺序" prop="proxyStyleSort">
            <el-input-number v-model="form.proxyStyleSort" :min="0" controls-position="right" placeholder="请输入代裁款式顺序"/>
          </el-form-item>
          <el-form-item label="含税状态">
            <el-radio-group v-model="form.proxyStyleRateStatus" @change="changeServerTaxStatus">
              <el-radio
                v-for="dict in serverTaxStatusOptions"
                :key="dict.dictValue"
                :label="dict.dictValue"
              >{{ dict.dictLabel }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="款式税率" prop="proxyStyleRate">
            <el-input-number v-if="form.proxyStyleRateStatus === '0'" v-model="form.proxyStyleRate" :min="0"
                             controls-position="right"
                             disabled placeholder="请输入款式税率"/>
            <el-input-number v-else v-model="form.proxyStyleRate" :max="100" :min="0"
                             controls-position="right"
                             placeholder="请输入款式税率">
            </el-input-number>
            （%）
          </el-form-item>
          <el-form-item label="款式状态">
            <el-radio-group v-model="form.proxyStyleStatus">
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
  addStyle,
  changeProxyStyleStatus,
  delStyle,
  exportStyle,
  getStyle,
  listStyle,
  updateStyle
} from "@/api/garment/proxy/pms/style/style.js";

export default {
  name: "Style",
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
      // 代裁款式管理表格数据
      styleList: [],
      // 状态数据字典
      statusOptions: [],
      // 服务税率状态数据字典
      serverTaxStatusOptions: [],
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
        proxyStyleName: null,
        proxyStyleUnit: null,
        proxyStyleSort: null,
        proxyStyleRate: null,
        proxyStyleRateStatus: null,
        proxyStyleStatus: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        workshopPkid: [
          {required: true, message: "工场pkid不能为空", trigger: "blur"}
        ],
        proxyStyleName: [
          {required: true, message: "代裁款式名称不能为空", trigger: "blur"}
        ],
        proxyStyleUnit: [
          {required: true, message: "代裁款式单位不能为空", trigger: "blur"}
        ],
        proxyStyleSort: [
          {required: true, message: "代裁款式顺序不能为空", trigger: "blur"}
        ],
        proxyStyleRate: [
          {required: true, message: "代裁款式税率不能为空", trigger: "blur"}
        ],
        proxyStyleRateStatus: [
          {required: true, message: "代裁款式含税状态不能为空", trigger: "blur"}
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("pms_tax_status").then(response => {
      this.serverTaxStatusOptions = response.data;
    });
  },
  methods: {
    /** 查询代裁款式管理列表 */
    getList() {
      this.loading = true;
      listStyle(this.queryParams).then(response => {
        this.styleList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 订单支付类型格式化
    formatServerTaxStatus(value) {
      return this.selectDictLabel(this.serverTaxStatusOptions, value);
    },
    changeServerTaxStatus() {
      // 当不含税状态选中时：清空填写的服务税率
      if (this.form.proxyStyleRateStatus === '0') {
        this.form.proxyStyleRate = 0;
      }
    },
    // 服务分类状态修改
    handleProxyStyleStatusChange(row) {
      let text = row.proxyStyleStatus === "0" ? "启用" : "停用";
      this.$confirm('确认要【' + text + '】 #' + row.proxyStyleName + '# 款式吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return changeProxyStyleStatus(row.pkid, row.proxyStyleStatus);
      }).then(() => {
        this.msgSuccess("代裁款式" + text + "成功");
      }).catch(function () {
        row.proxyStyleStatus = row.proxyStyleStatus === "0" ? "1" : "0";
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
        proxyStyleName: null,
        proxyStyleUnit: null,
        proxyStyleSort: null,
        proxyStyleRate: null,
        proxyStyleRateStatus: "0",
        proxyStyleStatus: "0",
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
      this.title = "代裁款式-新增";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const pkid = row.pkid || this.ids
      getStyle(pkid).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "代裁款式-编辑";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.pkid != null) {
            updateStyle(this.form).then(response => {
              this.msgSuccess("代裁款式-编辑成功");
              this.open = false;
              this.getList();
            });
          } else {
            addStyle(this.form).then(response => {
              this.msgSuccess("代裁款式-新增成功");
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
      this.$confirm('是否确认删除代裁款式管理编号为"' + pkids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delStyle(pkids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有代裁款式管理数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportStyle(queryParams);
      }).then(response => {
        this.download(response.msg);
      })
    }
  }
};
</script>
