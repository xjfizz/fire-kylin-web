<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="订单状态" prop="orderStatus">
        <el-select
          v-model="queryParams.orderStatus"
          placeholder="请选择运单状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in orderStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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
      <el-form-item label="用户名称" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="wxappPhone">
        <el-input
          v-model="queryParams.wxappPhone"
          placeholder="请输入手机号码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="orderCreateTime">
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
          icon="el-icon-s-help"
          size="mini"
          @click=""
          v-hasPermi="['oms:order:export']"
        >合并取料</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-s-goods"
          size="mini"
          @click=""
          v-hasPermi="['oms:order:export']"
        >合并配送</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-s-check"
          size="mini"
          @click=""
          v-hasPermi="['oms:order:export']"
        >确认接单</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['oms:order:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="orderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="订单编号" align="center" prop="orderNo" width="230"/>
      <el-table-column label="用户名称" align="center" prop="wmsUser.userName" />
      <el-table-column label="手机号码" align="center" prop="wmsUser.wxappPhone" />
      <el-table-column label="商品名称" align="center" prop="pmsServer.serverName" />
      <el-table-column label="商品数量" align="center" prop="orderQuantity" />
      <el-table-column label="商品规格" align="center" prop="orderSpecification" />
      <el-table-column label="订单价格" align="center" prop="orderAmount" >
        <template slot-scope="scope">
          <span>￥{{ scope.row.orderAmount | money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="配送方式" align="center" prop="orderDeliveryType" :formatter="orderDeliveryTypeFormat" width="100"/>
      <el-table-column label="订单状态" align="center" prop="orderStatus" :formatter="orderStatusFormat" width="100" />
      <el-table-column label="订单创建时间" align="center" prop="orderCreateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.orderCreateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['oms:order:edit']"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            style="color: #008489"
            icon="el-icon-s-help"
            @click="handleDelete(scope.row)"
            v-show="scope.row.orderStatus === '2'"
            v-hasPermi="['oms:order:remove']"
          >取料</el-button>
          <el-button
            size="mini"
            type="text"
            style="color: #787be8"
            icon="el-icon-s-check"
            @click="handleDelete(scope.row)"
            v-show="scope.row.orderStatus === '4'"
            v-hasPermi="['oms:order:remove']"
          >确认</el-button>
          <el-button
            size="mini"
            type="text"
            style="color: #C03639"
            icon="el-icon-s-open"
            @click="handleDelete(scope.row)"
            v-show="scope.row.orderStatus === '4'"
            v-hasPermi="['oms:order:remove']"
          >取消</el-button>
          <el-button
            size="mini"
            type="text"
            style="color: #f8ac59"
            icon="el-icon-s-operation"
            @click="handleDelete(scope.row)"
            v-show="scope.row.orderStatus === '5'"
            v-hasPermi="['oms:order:remove']"
          >排班</el-button>
          <el-button
            size="mini"
            type="text"
            style="color: indianred"
            icon="el-icon-s-promotion"
            @click="handleDelete(scope.row)"
            v-show="scope.row.orderStatus === '9'"
            v-hasPermi="['oms:order:remove']"
          >配送</el-button>
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

    <!-- 添加或修改wxapp端订单对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form"  label-width="180px" v-loading="loading">
        <el-card>
          <div slot="header" style="padding-left:15px"><span>订单进度</span></div>
          <div class="detail-container">
            <div class="step-style" >
              <el-steps :active="formatStepStatus(form.orderStatus)" finish-status="success" align-center>
                <el-step title="创建时间" :description="form.orderCreateTime"></el-step>
                <el-step title="支付时间" :description="form.orderPayTime"></el-step>
                <el-step title="加工时间" :description="form.productionStartTime"></el-step>
                <el-step title="完成时间" :description="form.confirmReceiptTime"></el-step>
              </el-steps>
            </div>
          </div>
<!--          <el-row  style="margin-top: 10px">-->
<!--            <el-card>-->
<!--              <div slot="header"><span>服务信息</span></div>-->
<!--              <div class="el-table el-table&#45;&#45;enable-row-hover el-table&#45;&#45;medium">-->
<!--                <table cellspacing="0" style="width: 100%;">-->
<!--                  <tbody>-->
<!--                  <tr>-->
<!--                    <td><div class="cell">运单类型</div></td>-->
<!--                    <td><div class="cell" v-if="form">{{ formatWaybillType(form.waybillType) }}</div></td>-->
<!--                    <td><div class="cell">运单状态</div></td>-->
<!--                    <td><div class="cell" v-if="form">{{ formatWaybillStatus(form.waybillStatus) }}</div></td>-->
<!--                    <td><div class="cell">创建时间</div></td>-->
<!--                    <td><div class="cell" v-if="form">{{ form.waybillCreateTime }}</div></td>-->
<!--                  </tr>-->
<!--                  <tr>-->
<!--                    <td><div class="cell">运单编号</div></td>-->
<!--                    <td><div class="cell" v-if="form">{{ form.waybillNo }}</div></td>-->
<!--                    <td><div class="cell">关联订单</div></td>-->
<!--                    <td colspan="3"><div class="cell" v-if="form">{{ form.orderNo }}</div></td>-->
<!--                  </tr>-->
<!--                  <tr>-->
<!--                    <td><div class="cell">商品名称</div></td>-->
<!--                    <td><div class="cell" v-if="form.pmsServer">{{ form.pmsServer.serverName }}</div></td>-->
<!--                    <td><div class="cell">商品规格</div></td>-->
<!--                    <td><div class="cell" v-if="form.omsOrder">{{ form.omsOrder.orderSpecification }}</div></td>-->
<!--                    <td><div class="cell">商品数量</div></td>-->
<!--                    <td><div class="cell" v-if="form.omsOrder">{{ form.omsOrder.orderQuantity }}</div></td>-->
<!--                  </tr>-->
<!--                  </tbody>-->
<!--                </table>-->
<!--              </div>-->
<!--            </el-card>-->
<!--          </el-row>-->
<!--          <el-row style="margin-top: 5px">-->
<!--            <el-card>-->
<!--              <div slot="header"><span>取料/送货地址信息</span></div>-->
<!--              <div class="el-table el-table&#45;&#45;enable-row-hover el-table&#45;&#45;medium">-->
<!--                <table cellspacing="0" style="width: 100%;">-->
<!--                  <tbody>-->
<!--                  <tr>-->
<!--                    <td><div class="cell">联系姓名</div></td>-->
<!--                    <td><div class="cell" v-if="form.wmsUserReceiveAddress">{{ form.wmsUserReceiveAddress.receiveName }}</div></td>-->
<!--                    <td><div class="cell">联系电话</div></td>-->
<!--                    <td><div class="cell" v-if="form.wmsUserReceiveAddress">{{ form.wmsUserReceiveAddress.receivePhone }}</div></td>-->
<!--                  </tr>-->
<!--                  <tr>-->
<!--                    <td><div class="cell">详细地址</div></td>-->
<!--                    <td colspan="3"><div class="cell" v-if="form.wmsUserReceiveAddress">{{ form.wmsUserReceiveAddress.province}}{{ form.wmsUserReceiveAddress.city}}{{ form.wmsUserReceiveAddress.region}}{{ form.wmsUserReceiveAddress.detailAddress}}</div></td>-->
<!--                  </tr>-->
<!--                  </tbody>-->
<!--                </table>-->
<!--              </div>-->
<!--            </el-card>-->
<!--          </el-row>-->
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
import { listOrder, getOrder, delOrder, addOrder, updateOrder, exportOrder } from "@/api/module/production/oms/order/order";

export default {
  name: "Order",
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
      // 订单表格数据
      orderList: [],
      // 订单状态字典数据
      orderStatusOptions: [],
      // 订单配送方式字典数据
      orderDeliveryOptions: [],
      // 日期范围
      dateRange: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'orderCreateTime',
        isAsc: 'desc',
        orderStatus: null,
        orderNo: null,
        userName: null,
        wxappPhone: null,
        orderCreateTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        workshopPkid: [
          { required: true, message: "工场pkid不能为空", trigger: "blur" }
        ],
        userPkid: [
          { required: true, message: "下单用户pkid不能为空", trigger: "blur" }
        ],
        serverParentPkid: [
          { required: true, message: "服务父分类id不能为空", trigger: "blur" }
        ],
        serverClassificationPkid: [
          { required: true, message: "服务分类id不能为空", trigger: "blur" }
        ],
        orderNo: [
          { required: true, message: "订单编号不能为空", trigger: "blur" }
        ],
        orderCreateTime: [
          { required: true, message: "订单创建时间不能为空", trigger: "blur" }
        ],
        orderAmount: [
          { required: true, message: "订单金额不能为空", trigger: "blur" }
        ],
        orderQuantity: [
          { required: true, message: "订单数量不能为空", trigger: "blur" }
        ],
        orderDeliveryType: [
          { required: true, message: "订单配送方式：1->自送自取；2->上门取料不能为空", trigger: "change" }
        ],
        orderExpectTime: [
          { required: true, message: "订单期望时间不能为空", trigger: "blur" }
        ],
        orderPayAmount: [
          { required: true, message: "订单支付金额不能为空", trigger: "blur" }
        ],
        orderProcessAmount: [
          { required: true, message: "加工金额不能为空", trigger: "blur" }
        ],
        orderTaxAmount: [
          { required: true, message: "税费金额不能为空", trigger: "blur" }
        ],
        orderFreightAmount: [
          { required: true, message: "运费金额不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("oms_order_status").then(response => {
      this.orderStatusOptions = response.data;
    });
    this.getDicts("oms_delivery_type").then(response => {
      this.orderDeliveryOptions = response.data;
    });
  },
  // 订单金额过滤器
  filters: {
    money(value) {
      if (!value) return "0.00";
      const intPart = Number(value).toFixed(0); //获取整数部分
      const intPartFormat = intPart.toString()
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
    /** 查询wxapp端订单列表 */
    getList() {
      this.loading = true;
      listOrder(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.orderList = response.rows;
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
        serverParentPkid: null,
        serverClassificationPkid: null,
        orderNo: null,
        orderCreateTime: null,
        orderAmount: null,
        orderStatus: "0",
        orderQuantity: null,
        orderSpecification: null,
        orderLineQuantity: null,
        orderColor: null,
        orderNote: null,
        orderAnnexImageUrl: null,
        orderDeliveryType: null,
        orderExpectTime: null,
        receiveAddressPkid: null,
        orderPayType: null,
        orderPayStatus: "0",
        orderPayTime: null,
        orderPayAmount: null,
        orderProcessAmount: null,
        orderTaxAmount: null,
        orderFreightAmount: null,
        orderCancelTime: null,
        orderAcceptTime: null,
        orderInspectionTime: null,
        reclaimingStartTime: null,
        reclaimingCompletionTime: null,
        productionStartTime: null,
        productionCompletionTime: null,
        deliveryStartTime: null,
        deliveryCompletionTime: null,
        confirmReceiptTime: null,
        modifyTime: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.resetForm("form");
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
    // 订单状态字典翻译
    orderStatusFormat(row, column) {
      return this.selectDictLabel(this.orderStatusOptions, row.orderStatus);
    },
    // 订单配送方式字典翻译
    orderDeliveryTypeFormat(row, column) {
      return this.selectDictLabel(this.orderDeliveryOptions, row.orderDeliveryType);
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
      this.title = "添加wxapp端订单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const pkid = row.pkid || this.ids
      getOrder(pkid).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改wxapp端订单";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.pkid != null) {
            updateOrder(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOrder(this.form).then(response => {
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
      this.$confirm('是否确认删除wxapp端订单编号为"' + pkids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delOrder(pkids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有wxapp端订单数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportOrder(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
