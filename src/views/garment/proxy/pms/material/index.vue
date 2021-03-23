<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="68px">
      <el-form-item label="材质名称" prop="proxyMaterialName">
        <el-input
          v-model="queryParams.proxyMaterialName"
          clearable
          placeholder="请输入代裁材质名称"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="材质状态" prop="proxyMaterialStatus">
        <el-select
          v-model="queryParams.proxyMaterialStatus"
          clearable
          placeholder="请选择代裁材质状态"
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
          v-hasPermi="['proxy:material:add']"
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
          v-hasPermi="['proxy:material:edit']"
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
          v-hasPermi="['proxy:material:remove']"
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
          v-hasPermi="['proxy:material:export']"
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

    <el-table v-loading="loading" :data="materialList" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55"/>
      <el-table-column align="center" label="材质ID" prop="pkid"/>
      <el-table-column align="center" label="材质名称" prop="proxyMaterialName"/>
      <el-table-column align="center" label="材质顺序" prop="proxyMaterialSort"/>
      <el-table-column key="proxyMaterialStatus" align="center" label="材质状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.proxyMaterialStatus"
            active-value="0"
            inactive-value="1"
            @change="handleProxyMaterialStatusChange(scope.row)"
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
            v-hasPermi="['proxy:material:edit']"
            icon="el-icon-edit"
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
            v-hasPermi="['proxy:material:remove']"
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

    <!-- 添加或修改代裁材质管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="500px">
      <el-card>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="材质名称" prop="proxyMaterialName">
            <el-input v-model="form.proxyMaterialName" placeholder="请输入代裁材质名称"/>
          </el-form-item>
          <el-form-item label="材质顺序" prop="proxyMaterialSort">
            <el-input v-model="form.proxyMaterialSort" placeholder="请输入代裁材质顺序"/>
          </el-form-item>
          <el-form-item label="材质状态">
            <el-radio-group v-model="form.proxyMaterialStatus">
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
  addMaterial,
  changeProxyMaterialStatus,
  delMaterial,
  exportMaterial,
  getMaterial,
  listMaterial,
  updateMaterial
} from "@/api/garment/proxy/pms/material/material.js";

export default {
  name: "Material",
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
      // 代裁材质管理表格数据
      materialList: [],
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
        proxyMaterialName: null,
        proxyMaterialSort: null,
        proxyMaterialStatus: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        proxyMaterialName: [
          {required: true, message: "代裁材质名称不能为空", trigger: "blur"}
        ],
        proxyMaterialSort: [
          {required: true, message: "代裁材质顺序不能为空", trigger: "blur"}
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
    /** 查询代裁材质管理列表 */
    getList() {
      this.loading = true;
      listMaterial(this.queryParams).then(response => {
        this.materialList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 订单支付类型格式化
    formatProxyMaterialStatus(value) {
      return this.selectDictLabel(this.statusOptions, value);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 代理材质状态修改
    handleProxyMaterialStatusChange(row) {
      let text = row.proxyMaterialStatus === "0" ? "启用" : "停用";
      this.$confirm('确认要【' + text + '】 #' + row.proxyMaterialName + '# 材质吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return changeProxyMaterialStatus(row.pkid, row.proxyMaterialStatus);
      }).then(() => {
        this.msgSuccess("代裁材质" + text + "成功");
      }).catch(function () {
        row.proxyMaterialStatus = row.proxyMaterialStatus === "0" ? "1" : "0";
      });
    },
    // 表单重置
    reset() {
      this.form = {
        pkid: null,
        workshopPkid: null,
        proxyMaterialName: null,
        proxyMaterialSort: null,
        proxyMaterialStatus: "0",
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
      this.title = "代裁材质-新增";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const pkid = row.pkid || this.ids
      getMaterial(pkid).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "代裁材质-编辑";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.pkid != null) {
            updateMaterial(this.form).then(response => {
              this.msgSuccess("代裁材质-编辑成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMaterial(this.form).then(response => {
              this.msgSuccess("代裁材质-新增成功");
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
      this.$confirm('是否确认删除代裁材质管理编号为"' + pkids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delMaterial(pkids);
      }).then(() => {
        this.getList();
        this.msgSuccess("代裁材质-删除成功");
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有代裁材质管理数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportMaterial(queryParams);
      }).then(response => {
        this.download(response.msg);
      })
    }
  }
};
</script>
