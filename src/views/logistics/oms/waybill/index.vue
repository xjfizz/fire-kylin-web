<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="运单状态" prop="waybillStatus">
        <el-select
          v-model="queryParams.waybillStatus"
          placeholder="请选择运单状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in waybillStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="运单类型" prop="waybillType">
        <el-select
          v-model="queryParams.waybillType"
          placeholder="请选择运单类型"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in waybillTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="运单编号" prop="waybillNo">
        <el-input
          v-model="queryParams.waybillNo"
          placeholder="请输入运单编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单编号" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入订单编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <br>
      <el-form-item label="运单时间" prop="waybillCreateTime">
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
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['logistics:waybill:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['logistics:waybill:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="waybillList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="运单编号" align="center" prop="waybillNo" width="130"/>
      <el-table-column label="关联订单编号" align="center" prop="orderNo" width="230"/>
      <el-table-column label="商品名称" align="center" prop="pmsServer.serverName" />
      <el-table-column label="商品规格" align="center" prop="omsOrder.orderSpecification" />
      <el-table-column label="商品数量" align="center" prop="omsOrder.orderQuantity" />
      <el-table-column label="取料/送货地址" align="center"  prop="wmsUserReceiveAddress" width="200" style="text-align: left" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>联系方式：{{ scope.row.wmsUserReceiveAddress.receiveName }} / {{ scope.row.wmsUserReceiveAddress.receivePhone }}</span>
          <br>
          <span>详细地址：{{ scope.row.wmsUserReceiveAddress.province }}{{ scope.row.wmsUserReceiveAddress.city }}{{ scope.row.wmsUserReceiveAddress.region }}{{ scope.row.wmsUserReceiveAddress.detailAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column label="配送员工" align="center" prop="deliverySysUser.nickName" />
      <el-table-column label="运单类型" align="center" prop="waybillType" :formatter="waybillTypeFormat" width="100" />
      <el-table-column label="订单状态" align="center" prop="waybillStatus" :formatter="waybillStatusFormat" width="100" />
      <el-table-column label="创建时间" align="center" prop="waybillCreateTime" width="150">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.waybillCreateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
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
            v-hasPermi="['logistics:waybill:edit']"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            style="color: chocolate"
            icon="el-icon-setting"
            @click="distributionHandleUpdate(scope.row)"
            v-show="scope.row.waybillStatus === '1'"
            v-hasPermi="['logistics:waybill:remove']"
          >分配</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit-outline"
            style="color: #1ab394"
            @click="distributionHandleUpdate(scope.row)"
            v-show="scope.row.waybillStatus === '2'"
            v-hasPermi="['logistics:waybill:remove']"
          >编辑</el-button>
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

    <!-- 配送员分配和编辑弹框 -->
    <el-dialog :title="title" :visible.sync="distributionOpen"  append-to-body>
      <el-form ref="form" :model="distributionForm" :rules="rules" label-width="180px" v-loading="loading">
        <el-card>
          <el-row  style="margin-top: 10px">
            <el-card>
              <div slot="header"><span>配送员信息</span></div>
              <div class="el-table el-table--enable-row-hover el-table--medium">
                <table cellspacing="0" style="width: 100%;">
                  <tbody>
                    <tr>
                      <td><div class="cell">联系姓名：</div></td>
                      <td><div class="cell" v-if="distributionForm.deliverySysUser">{{ distributionForm.deliverySysUser.nickName }}</div></td>
                      <td><div class="cell">联系电话：</div></td>
                      <td><div class="cell" v-if="distributionForm.deliverySysUser">{{ distributionForm.deliverySysUser.phonenumber }}</div></td>
                      <td><div class="cell">分配时间：</div></td>
                      <td><div class="cell" v-if="distributionForm">{{ distributionForm.waybillDistributionTime }}</div></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </el-card>
          </el-row>
          <el-row style="margin-top: 10px">
            <el-card>
              <div slot="header"><span>设置配送员</span></div>
              <el-form-item label="配送员" prop="deliveryUserPkid">
                <el-select v-model="distributionForm.deliveryUserPkid" placeholder="请选择配送员">
                  <el-option
                    v-for="dict in deliveryUserOptions"
                    :key="dict.userId"
                    :label="dict.nickName"
                    :value="dict.userId"
                  />
                </el-select>
              </el-form-item>
            </el-card>
          </el-row>
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="distributionCancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改运单对话框 -->
    <el-dialog :title="title" :visible.sync="open"  append-to-body>
      <el-form ref="form" :model="form"  label-width="180px" v-loading="loading">
        <el-card>
          <div slot="header" style="padding-left:15px"><span>运单进度</span></div>
          <div class="detail-container">
            <div class="step-style" >
              <el-steps :active="formatStepStatus(form.waybillStatus)" finish-status="success" align-center>
                <el-step title="创建时间" :description="form.waybillCreateTime"></el-step>
                <el-step title="分配时间" :description="form.waybillDistributionTime"></el-step>
                <el-step title="开始时间" :description="form.waybillStartTime"></el-step>
                <el-step title="完成时间" :description="form.waybillCompleteTime"></el-step>
              </el-steps>
            </div>
          </div>
          <el-row  style="margin-top: 10px">
            <el-card>
              <div slot="header"><span>运单信息</span></div>
              <div class="el-table el-table--enable-row-hover el-table--medium">
                <table cellspacing="0" style="width: 100%;">
                  <tbody>
                  <tr>
                    <td><div class="cell">运单类型</div></td>
                    <td><div class="cell" v-if="form">{{ formatWaybillType(form.waybillType) }}</div></td>
                    <td><div class="cell">运单状态</div></td>
                    <td><div class="cell" v-if="form">{{ formatWaybillStatus(form.waybillStatus) }}</div></td>
                    <td><div class="cell">创建时间</div></td>
                    <td><div class="cell" v-if="form">{{ form.waybillCreateTime }}</div></td>
                  </tr>
                  <tr>
                    <td><div class="cell">运单编号</div></td>
                    <td><div class="cell" v-if="form">{{ form.waybillNo }}</div></td>
                    <td><div class="cell">关联订单</div></td>
                    <td colspan="3"><div class="cell" v-if="form">{{ form.orderNo }}</div></td>
                  </tr>
                  <tr>
                    <td><div class="cell">商品名称</div></td>
                    <td><div class="cell" v-if="form.pmsServer">{{ form.pmsServer.serverName }}</div></td>
                    <td><div class="cell">商品规格</div></td>
                    <td><div class="cell" v-if="form.omsOrder">{{ form.omsOrder.orderSpecification }}</div></td>
                    <td><div class="cell">商品数量</div></td>
                    <td><div class="cell" v-if="form.omsOrder">{{ form.omsOrder.orderQuantity }}</div></td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </el-card>
          </el-row>
          <el-row style="margin-top: 5px">
            <el-card>
              <div slot="header"><span>取料/送货地址信息</span></div>
              <div class="el-table el-table--enable-row-hover el-table--medium">
                <table cellspacing="0" style="width: 100%;">
                  <tbody>
                  <tr>
                    <td><div class="cell">联系姓名</div></td>
                    <td><div class="cell" v-if="form.wmsUserReceiveAddress">{{ form.wmsUserReceiveAddress.receiveName }}</div></td>
                    <td><div class="cell">联系电话</div></td>
                    <td><div class="cell" v-if="form.wmsUserReceiveAddress">{{ form.wmsUserReceiveAddress.receivePhone }}</div></td>
                  </tr>
                  <tr>
                    <td><div class="cell">详细地址</div></td>
                    <td colspan="3"><div class="cell" v-if="form.wmsUserReceiveAddress">{{ form.wmsUserReceiveAddress.province}}{{ form.wmsUserReceiveAddress.city}}{{ form.wmsUserReceiveAddress.region}}{{ form.wmsUserReceiveAddress.detailAddress}}</div></td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </el-card>
          </el-row>
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listWaybill, getWaybill, delWaybill, addWaybill, updateWaybill, exportWaybill, listDeliveryUser,settingDeliveryUser } from "@/api/logistics/oms/waybill/waybill";

export default {
  name: "Waybill",
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
      // 运单表格数据
      waybillList: [],
      // 运单状态
      waybillStatusOptions: [],
      // 运单类型
      waybillTypeOptions: [],
      // 服务分类数据字典
      deliveryUserOptions: [],
      // 日期范围
      dateRange: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层
      distributionOpen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'waybillCreateTime',
        isAsc: 'desc',
        waybillType: null,
        waybillStatus: null,
        orderNo: null,
        waybillNo: null,
        waybillCreateTime: null,
      },
      // 表单参数
      form: {},
      // 表单参数
      distributionForm: {},
      // 表单校验
      rules: {
        workshopPkid: [
          { required: true, message: "工场pkid不能为空", trigger: "blur" }
        ],
        userPkid: [
          { required: true, message: "下单用户pkid不能为空", trigger: "blur" }
        ],
        orderPkid: [
          { required: true, message: "订单pkid不能为空", trigger: "blur" }
        ],
        orderNo: [
          { required: true, message: "订单编号不能为空", trigger: "blur" }
        ],
        serverPkid: [
          { required: true, message: "服务pkid不能为空", trigger: "blur" }
        ],
        waybillNo: [
          { required: true, message: "运单编号不能为空", trigger: "blur" }
        ],
        waybillCreateTime: [
          { required: true, message: "运单创建时间不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("oms_waybill_status").then(response => {
      this.waybillStatusOptions = response.data;
    });
    this.getDicts("oms_waybill_type").then(response => {
      this.waybillTypeOptions = response.data;
    });
  },
  methods: {
    /** 查询运单列表 */
    getList() {
      this.loading = true;
      listWaybill(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.waybillList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 运单类型字典翻译
    waybillTypeFormat(row, column) {
      return this.selectDictLabel(this.waybillTypeOptions, row.waybillType);
    },
    // 运单状态字典翻译
    waybillStatusFormat(row, column) {
      return this.selectDictLabel(this.waybillStatusOptions, row.waybillStatus);
    },
    // 运单状态格式化
    formatWaybillStatus(value){
      return this.selectDictLabel(this.waybillStatusOptions, value);
    },
    // 运单类型格式化
    formatWaybillType(value){
      return this.selectDictLabel(this.waybillTypeOptions, value);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 取消按钮
    distributionCancel() {
      this.distributionOpen = false;
      this.distributionReset();
    },
    // 表单重置
    reset() {
      this.form = {
        pkid: null,
        workshopPkid: null,
        userPkid: null,
        orderPkid: null,
        orderNo: null,
        serverPkid: null,
        waybillNo: null,
        waybillType: null,
        waybillStatus: "0",
        waybillCreateTime: null,
        deliveryUserPkid: null,
        receiveAddressPkid: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.resetForm("form");
    },
    // 表单重置
    distributionReset() {
      this.distributionForm = {
        pkid: null,
        sysUserName: null,
        deliveryUserPkid: null,
        waybillDistributionTime: null
      };
      this.resetForm("distributionForm");
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

    // 步骤条状态激活
    formatStepStatus(value) {
      if (value === '2') {
        // 运单待开始
        return 2;
      }else if (value === '3') {
        // 运单工作中
        return 3;
      } else if (value === '4') {
        // 运单已完成
        return 4;
      } else {
        // 其他
        return 1;
      }
    },
    /** 新增按钮操作 【无】*/
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const pkid = row.pkid || this.ids
      getWaybill(pkid).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "【运单详情】";
      });
    },
    /** 分配编辑按钮操作 */
    distributionHandleUpdate(row) {
      this.distributionReset();
      const pkid = row.pkid || this.ids
      listDeliveryUser().then(response => {
        this.deliveryUserOptions = response.data;
      })
      getWaybill(pkid).then(response => {
        this.distributionForm = response.data;
        this.distributionOpen = true;
        this.title = "【设置配送员】";
      });
    },
    /** 提交按钮 */
    submitForm() {
      console.log(this.distributionForm);
      if (this.distributionForm.pkid != null) {
        settingDeliveryUser(this.distributionForm).then(response => {
          this.msgSuccess("修改成功");
          this.distributionOpen = false;
          this.getList();
        });
      }
      // this.$refs["distributionForm"].validate(valid => {
      //   if (valid) {
      //     if (this.distributionForm.pkid != null) {
      //       settingDeliveryUser(this.distributionForm).then(response => {
      //         this.msgSuccess("修改成功");
      //         this.distributionOpen = false;
      //         this.getList();
      //       });
      //     } else {
      //       addWaybill(this.form).then(response => {
      //         this.msgSuccess("新增成功");
      //         this.open = false;
      //         this.getList();
      //       });
      //     }
      //   }
      // });
    },
    /** 删除按钮操作 【无】 */
    handleDelete(row) {
      const pkids = row.pkid || this.ids;
      this.$confirm('是否确认删除运单编号为"' + pkids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delWaybill(pkids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有运单数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportWaybill(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
