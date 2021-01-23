<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="服务分类" prop="serverCategoryPkid">
        <el-select
          v-model="queryParams.serverCategoryPkid"
          placeholder="请选择服务分类"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in serverCategoryOptions"
            :key="dict.pkid"
            :label="dict.categoryName"
            :value="dict.pkid"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="服务名称" prop="serverName">
        <el-input
          v-model="queryParams.serverName"
          placeholder="请输入服务名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="服务状态" prop="serverStatus">
        <el-select
          v-model="queryParams.serverStatus"
          placeholder="请选择服务状态"
          clearable
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
          v-hasPermi="['module-production:server:add']"
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
          v-hasPermi="['module-production:server:edit']"
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
          v-hasPermi="['module-production:server:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['module-production:server:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="serverList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="服务分类ID" align="center" prop="serverCategoryPkid" />
      <el-table-column label="服务分类名称" align="center" prop="pmsServerCategory.categoryName" />
      <el-table-column label="服务ID" align="center" prop="pkid" />
      <el-table-column label="服务名称" align="center" prop="serverName" />
      <el-table-column prop="serverImageUrl" label="服务图像" header-align="center" align="center">
        <template slot-scope="scope">
          <el-popover placement="top-start" title="" trigger="hover">
            <img :src="scope.row.serverImageUrl" alt="图片预览" style="width: 200px;height: 200px">
            <img slot="reference" :src="scope.row.serverImageUrl" style="width: 50px;height: 50px" :onerror="errorimg">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="服务金额" align="center" prop="serverAmount" />
      <el-table-column label="服务单位" align="center" prop="serverUnit" />
      <el-table-column label="服务顺序" align="center" prop="serverSort" />
      <el-table-column label="服务状态" align="center" key="serverStatus" v-if="columns[4].visible">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.serverStatus"
            active-value="0"
            inactive-value="1"
            @change="handleServerStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns[5].visible" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['module-production:server:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['module-production:server:remove']"
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

    <!-- 添加或修改web端服务对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-card>
          <el-form-item label="服务分类" prop="serverCategoryPkid">
            <el-select v-model="form.serverCategoryPkid" placeholder="请选择">
              <el-option
                v-for="dict in serverCategoryOptions"
                :key="dict.pkid"
                :label="dict.categoryName"
                :value="dict.pkid"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="服务名称" prop="serverName">
            <el-input v-model="form.serverName" placeholder="请输入服务名称" />
          </el-form-item>
          <el-form-item label="服务单价" prop="serverAmount">
            <el-input-number v-model="form.serverAmount" controls-position="right" placeholder="请输入服务单价" :min="0" />（元）
          </el-form-item>
          <el-form-item label="服务单位" prop="serverUnit">
            <el-input v-model="form.serverUnit" placeholder="请输入服务单位" />
          </el-form-item>
          <el-form-item label="服务排序" prop="serverSort">
            <el-input-number v-model="form.serverSort" controls-position="right" placeholder="请输入服务排序" :min="0" />
          </el-form-item>
          <el-form-item label="服务税率" prop="serverTaxRate">
            <el-input-number v-model="form.serverTaxRate" controls-position="right"  placeholder="请输入服务税率" :min="0" />（%）
          </el-form-item>
          <el-row>
            <el-form-item label="服务图像" :label-width="formLabelWidth" prop="serverImageUrl" style="margin-bottom:0px">
              <el-upload
                ref="upload"
                :action="upload.url"
                :headers="upload.headers"
                :limit=upload.limitNum
                accept="image/png,image/gif,image/jpg,image/jpeg"
                list-type="picture-card"
                :auto-upload="false"
                :on-success="handleAvatarSuccess"
                :on-exceed="handleExceed"
                :before-upload="handleBeforeUpload"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :file-list="fileListShow">
                <i class="el-icon-plus"></i>
              </el-upload>
              <!--图片预览的dialog-->
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
              <p style="color: #999;">图片上传限制： 1.最多1张； 2.最大不超过2M</p>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="uploadFile">立即上传</el-button>
              <el-button size="small">取消</el-button>
            </el-form-item>
          </el-row>
          <el-form-item label="服务状态">
            <el-radio-group v-model="form.serverStatus">
              <el-radio
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictValue"
              >{{dict.dictLabel}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
          </el-form-item>
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listServer, getServer, delServer, addServer, updateServer, exportServer, changeServerStatus, listServerCategory } from "@/api/module/production/pms/server/server";
import {getToken} from "@/utils/auth";

export default {
  name: "Server",
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
      // web端服务表格数据
      serverList: [],
      // 状态数据字典
      statusOptions: [],
      // 服务分类数据字典
      serverCategoryOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 加载默认头像图片
      errorimg:'this.src="'+require('../../../../../assets/images/user_profile.jpg')+'"',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'createTime',
        isAsc: 'desc',
        serverCategoryPkid: null,
        serverName: null,
        serverStatus: null,
      },
      // 列信息npm
      columns: [
        { key: 0, label: `服务分类ID`, visible: true },
        { key: 1, label: `工场管理ID`, visible: true },
        { key: 2, label: `分类名称`, visible: true },
        { key: 3, label: `分类顺序`, visible: true },
        { key: 4, label: `服务状态`, visible: true },
        { key: 5, label: `创建时间`, visible: true }
      ],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        serverName: [
          { required: true, message: "服务名称不能为空", trigger: "blur" }
        ],
        serverAmount: [
          { required: true, message: "服务金额不能为空", trigger: "blur" }
        ],
        serverUnit: [
          { required: true, message: "服务单位不能为空", trigger: "blur" }
        ],
        serverSort: [
          { required: true, message: "服务顺序不能为空", trigger: "blur" }
        ],
        serverTaxRate: [
          { required: true, message: "服务税率不能为空", trigger: "blur" }
        ],
      },
      //图片上传判断是否有相同图片
      isCommonName: true,
      //修改时此属性用于接收数据库中图片存储list，图片才能正常显示
      fileListShow: [],
      //页面上存的暂时图片地址List
      fileListPut: [],
      dialogImageUrl: '',
      dialogVisible: false,
      formLabelWidth: '100px',
      // 上传参数
      upload: {
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/module/production/server/uploadServerImage",
        // 上传图片数量限制
        limitNum: 1,
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
    // 获取工场服务分类集合
    this.getServerCategoryList();
  },
  methods: {
    /** 查询web端服务分类列表 */
    getServerCategoryList(){
      listServerCategory().then(response => {
        this.serverCategoryOptions = response.rows;
      });
    },
    /** 查询web端服务列表 */
    getList() {
      this.loading = true;
      listServer(this.queryParams).then(response => {
        this.serverList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 服务分类状态修改
    handleServerStatusChange(row) {
      let text = row.serverStatus === "0" ? "启用" : "停用";
      this.$confirm('确认要【' + text + '】 #' + row.serverName + '# 服务吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return changeServerStatus(row.pkid, row.serverStatus);
      }).then(() => {
        this.msgSuccess(text + "成功");
      }).catch(function() {
        row.serverStatus = row.serverStatus === "0" ? "1" : "0";
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
        serverCategoryPkid: null,
        serverName: null,
        serverImageUrl: null,
        serverAmount: null,
        serverUnit: null,
        serverTaxRate: null,
        serverSort: null,
        serverStatus: "0",
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
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "工场服务-新增";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const pkid = row.pkid || this.ids
      getServer(pkid).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "工场服务-修改";
        let avatarUrl = this.form.serverImageUrl;
        let pictureList = [avatarUrl];
        if(pictureList.length > 0) {
          this.fileListShow = pictureList.map(item => {
            return {
              name: item,
              url: item
            }
          });
          this.fileListPut = pictureList.map(item => {
            return {
              name: item,
              url: item
            }
          });
        }
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.pkid != null) {
            updateServer(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addServer(this.form).then(response => {
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
      this.$confirm('是否确认删除服务ID为【' + pkids + '】的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delServer(pkids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有服务数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportServer(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    },
    // 上传文件之前的钩子
    handleBeforeUpload(file){
      //每次进来初始化 isCommonName 为true
      this.isCommonName = true;
      const isJPG = file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/jpg' || file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      //判断是否有相同的图片，如何有即提示并添加失败
      if(this.fileListPut.length > 0){
        this.fileListPut.forEach((item,index)=>{
          if(item.name === file.name){
            this.$notify.warning({
              title: '警告',
              message: '已存在相同的图片！'
            })
            this.isCommonName = false;
          }
        })
      }
      if(!isJPG) {
        this.$notify.warning({
          title: '警告',
          message: '请上传格式为image/png, image/gif, image/jpg, image/jpeg的图片！'
        })
      }
      if(!isLt2M) {
        this.$notify.warning({
          title: '警告',
          message: '图片大小必须小于2MB！'
        })
      }
    },
    // 文件超出个数限制时的钩子
    handleExceed(files, fileList) {

    },
    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      //根据传进来删除的file里图片，同时删除保存在fileListPut的相同图片
      if(this.fileListPut.length > 0){
        this.fileListPut = this.fileListPut.filter((item, index)=>{
          return item.name !== file.name;
        })
      }
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePictureCardPreview(file) {
      console.log(file);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    uploadFile() {
      this.$refs.upload.submit()
    },
    // 上传成功后回调
    handleAvatarSuccess (response, file) {
      let self = this;
      let resp = response.data;
      if (resp.status==="done" && resp.response === "success") {
        this.form.serverImageUrl = resp.name;
        this.$notify.success({
          title: '上传成功',
          message: '服务图像上传成功！'
        })
        //往此数组中保存当前图片对象
        this.fileListPut.push(resp.name);
      } else {
        //清空表单
        self.$refs.upload.clearFiles()
      }
    },
    // 关闭dialog 清除上传图片
    handleClose(){
      this.fileListShow=[];
    }
  }
};
</script>
