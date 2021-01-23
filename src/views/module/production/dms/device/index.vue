<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="设备状态" prop="deviceStatus">
        <el-select
          v-model="queryParams.deviceStatus"
          placeholder="请选择设备状态"
          clearable
          size="small"
          style="width: 215px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备编号" prop="deviceCode">
        <el-input
          v-model="queryParams.deviceCode"
          placeholder="请输入设备编号"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备名称" prop="deviceName">
        <el-input
          v-model="queryParams.deviceName"
          placeholder="请输入设备名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备型号" prop="deviceModel">
        <el-input
          v-model="queryParams.deviceModel"
          placeholder="请输入设备型号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <br>
      <el-form-item label="用户名称" prop="relationUserName">
        <el-input
          v-model="queryParams.relationUserName"
          placeholder="请输入用户名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="关联时间" prop="relationTime">
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
          v-hasPermi="['dms:device:add']"
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
          v-hasPermi="['dms:device:edit']"
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
          v-hasPermi="['dms:device:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['dms:device:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="deviceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="设备编号" align="center" prop="deviceCode" />
      <el-table-column label="设备名称" align="center" prop="deviceName" />
      <el-table-column label="设备型号" align="center" prop="deviceModel" />
      <el-table-column label="设备二维码" align="center" prop="deviceQrCode" >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
            v-hasPermi="['dms:device:edit']"
          >查看</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-download"
            @click="handleDelete(scope.row)"
            v-hasPermi="['dms:device:edit']"
          >下载</el-button>
        </template>
      </el-table-column>
      <el-table-column label="设备状态" align="center" prop="deviceStatus" :formatter="deviceStatusFormat" width="100" >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.deviceStatus"
            active-value="0"
            inactive-value="1"
            @change="handleDeviceStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="关联人员" align="center" prop="relationUserJobNumber" >
        <template slot-scope="scope">
          <span v-if="scope.row.relationSysUser">{{ scope.row.relationSysUser.nickName }}-{{  scope.row.relationSysUser.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联时间" align="center" prop="relationTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.relationTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后编辑时间" align="center" prop="updateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['dms:device:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['dms:device:remove']"
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

    <!-- 添加或修改设备对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
       <el-card>
         <el-form-item label="设备编号" prop="deviceCode">
           <el-input v-model="form.deviceCode" placeholder="请输入设备编号" />
         </el-form-item>
         <el-form-item label="设备名称" prop="deviceName">
           <el-input v-model="form.deviceName" placeholder="请输入设备名称" />
         </el-form-item>
         <el-form-item label="设备型号" prop="deviceModel">
           <el-input v-model="form.deviceModel" placeholder="请输入设备型号" />
         </el-form-item>
         <el-form-item label="设备状态" prop="deviceStatus">
           <el-radio-group v-model="form.deviceStatus">
             <el-radio
               v-for="dict in statusOptions"
               :key="dict.dictValue"
               :label="dict.dictValue"
             >{{dict.dictLabel}}</el-radio>
           </el-radio-group>
         </el-form-item>
         <el-form-item label="关联人员" prop="relationUserPkid">
           <el-select v-model="form.relationUserPkid" placeholder="请选择" clearable>
             <el-option
               v-for="dict in workshopPwUserList"
               :key="dict.userId"
               :label="dict.nickName"
               :value="dict.userId"
             />
           </el-select>
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

    <!-- 设备二维码对话框 -->
    <el-dialog :title="viewTitle" :visible.sync="viewOpen" width="400px" append-to-body>
      <el-form ref="viewForm" :model="viewForm" label-width="80px">
        <el-card>
          <div slot="header"><el-tag type="danger" effect="plain">【{{ viewForm.deviceCode }}】设备二维码</el-tag></div>
          <el-form-item label="" prop="deviceQrCode" >
            <template v-if="viewForm.deviceQrCode">
              <el-popover placement="top-start" title="" trigger="hover">
                <img  :src="viewForm.deviceQrCode" alt="图片预览" style="width: 200px;height: 200px">
                <img  slot="reference" :src="viewForm.deviceQrCode" style="width: 150px;height: 150px">
                <el-button type="primary" @click="downs()">下载图片</el-button>
              </el-popover>
            </template>
            <template v-else>
              <el-tag type="info" effect="plain">暂无设备二维码</el-tag>
            </template>
          </el-form-item>
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listDevice, getDevice, delDevice, addDevice, updateDevice, exportDevice, listWorkshopPwUser, changeDeviceStatus } from "@/api/module/production/dms/device/device";
import {changeServerStatus} from "@/api/module/production/pms/server/server";
import domtoimage from 'dom-to-image';

export default {
  name: "Device",
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
      // 设备表格数据
      deviceList: [],
      // 设备表格数据
      workshopPwUserList: [],
      // 状态数据字典
      statusOptions: [],
      // 日期范围
      dateRange: [],
      // 弹出层标题
      title: "",
      // 工场设备二维码弹出层标题
      viewTitle: "",
      // 是否显示弹出层
      open: false,
      // 是否显示查看弹出层
      viewOpen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        workshopPkid: null,
        deviceCode: null,
        deviceName: null,
        deviceModel: null,
        deviceQrCode: null,
        deviceStatus: null,
        relationUserPkid: null,
        relationUserJobNumber: null,
        relationUserName: null,
        relationTime: null,
      },
      // 表单参数
      form: {},
      // 查看表单参数
      viewForm: {},
      // 表单校验
      rules: {
        workshopPkid: [
          { required: true, message: "工场pkid不能为空", trigger: "blur" }
        ],
        deviceCode: [
          { required: true, message: "设备编号不能为空", trigger: "blur" }
        ],
        deviceName: [
          { required: true, message: "设备名称不能为空", trigger: "blur" }
        ],
        deviceModel: [
          { required: true, message: "设备型号不能为空", trigger: "blur" }
        ],
        deviceQrCode: [
          { required: true, message: "设备二维码不能为空", trigger: "blur" }
        ],
        deviceStatus: [
          { required: true, message: "设备状态不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.listWorkshopPwUser();
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    listWorkshopPwUser(){
      listWorkshopPwUser().then(response => {
        this.workshopPwUserList = response.data;
      })
    },
    /** 查询设备列表 */
    getList() {
      this.loading = true;
      listDevice(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.deviceList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 取消按钮
    viewCancel() {
      this.viewOpen = false;
      this.viewReset();
    },
    downloadIamge(imgsrc, name) {//下载图片地址和图片名
      var image = new Image();
      // 解决跨域 Canvas 污染问题
      image.setAttribute("crossOrigin", "anonymous");
      image.onload = function() {
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据

        var a = document.createElement("a"); // 生成一个a元素
        var event = new MouseEvent("click"); // 创建一个单击事件
        a.download = name || "photo"; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
      };
      image.src = imgsrc;
    },
    downs(){
      console.log(this.viewForm.deviceQrCode)
      this.downloadIamge(this.viewForm.deviceQrCode, 'pic')
      // domtoimage.toPng(document.getElementById('sss'))
      //   .then(function (dataUrl) {
      //     var img = new Image();
      //     img.src = dataUrl;
      //     document.body.appendChild(img);
      //     var a=document.createElement('a')
      //     a.setAttribute('href',dataUrl)
      //     a.setAttribute('download',"1.png")
      //     a.click()
      //   })
      //   .catch(function (error) {
      //     console.error('转图片失败!', error);
      //   });
    },
    handleDown(){
      let link = document.createElement('a')
      let url =  this.viewForm.img
      // 这里是将url转成blob地址，
      fetch(url).then(res => res.blob()).then(blob => { // 将链接地址字符内容转变成blob地址
        link.href = URL.createObjectURL(blob)
        link.download = 'pic'
        document.body.appendChild(link)
        link.click()
      })
    },
    // 表单重置
    reset() {
      this.form = {
        pkid: null,
        workshopPkid: null,
        deviceCode: null,
        deviceName: null,
        deviceModel: null,
        deviceQrCode: null,
        deviceStatus: "0",
        relationUserPkid: null,
        relationUserJobNumber: null,
        relationUserName: null,
        relationTime: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.resetForm("form");
    },
    // 表单重置
    viewReset() {
      this.viewForm = {
        pkid: null,
        workshopPkid: null,
        deviceCode: null,
        deviceName: null,
        deviceModel: null,
        deviceQrCode: null,
        deviceStatus: "0",
        relationUserPkid: null,
        relationUserJobNumber: null,
        relationUserName: null,
        relationTime: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.resetForm("viewForm");
    },
    // 订单状态字典翻译
    deviceStatusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.deviceStatus);
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
      this.title = "工场设备-新增";
    },
    /** 查看按钮操作 */
    handleView(row) {
      this.viewReset();
      const pkid = row.pkid || this.ids
      getDevice(pkid).then(response => {
        this.viewForm = response.data;
        this.viewOpen = true;
        this.viewTitle = "工场设备二维码";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const pkid = row.pkid || this.ids
      getDevice(pkid).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "工场设备-修改";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.pkid != null) {
            updateDevice(this.form).then(response => {
              this.msgSuccess("工场设备修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDevice(this.form).then(response => {
              this.msgSuccess("工场设备新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    // 服务分类状态修改
    handleDeviceStatusChange(row) {
      let text = row.deviceStatus === "0" ? "启用" : "停用";
      this.$confirm('确认要【' + text + '】 #' + row.deviceName + '# 设备吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return changeDeviceStatus(row.pkid, row.deviceStatus);
      }).then(() => {
        this.getList();
        this.msgSuccess(text + "成功");
      }).catch(function() {
        row.deviceStatus = row.deviceStatus === "0" ? "1" : "0";
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const pkids = row.pkid || this.ids;
      this.$confirm('是否确认删除工场设备编号为【' + pkids + '】的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delDevice(pkids);
        }).then(() => {
          this.getList();
          this.msgSuccess("工场设备删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有工场设备数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportDevice(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
