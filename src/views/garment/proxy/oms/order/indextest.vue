<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="订单状态" prop="orderStatus">
        <el-select v-model="queryParams.orderStatus" placeholder="请选择订单状态" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="配送方式" prop="orderDeliveryType">
        <el-select v-model="queryParams.orderDeliveryType" placeholder="请选择配送方式" clearable size="small">
          <el-option label="请选择字典生成" value="" />
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
      <el-form-item label="创建时间" prop="orderCreateTime">
        <el-date-picker clearable size="small"
                        v-model="queryParams.orderCreateTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择订单创建时间">
        </el-date-picker>
      </el-form-item>
      <br>
      <el-form-item label="支付方式" prop="orderPayType">
        <el-select v-model="queryParams.orderPayType" placeholder="请选择支付方式" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="支付状态" prop="orderPayStatus">
        <el-select v-model="queryParams.orderPayStatus" placeholder="请选择支付状态" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="支付时间" prop="orderPayTime">
        <el-date-picker clearable size="small"
                        v-model="queryParams.orderPayTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择订单支付时间">
        </el-date-picker>
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
          v-hasPermi="['proxy:order:add']"
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
          v-hasPermi="['proxy:order:edit']"
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
          v-hasPermi="['proxy:order:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['proxy:order:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="orderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="订单编号" align="center" prop="orderNo" width="160" />
      <el-table-column label="用户名称" align="center" prop="userName" />
      <el-table-column label="款式名称" align="center" prop="proxyStyleName" />
      <el-table-column label="材质名称" align="center" prop="proxyMaterialName" />
      <el-table-column label="订单描述" align="center" prop="orderDescribe" show-overflow-tooltip />
      <el-table-column label="订单数量(件)" align="center" prop="orderQuantity" />
      <el-table-column label="订单规格" align="center" prop="orderSpecification" />
      <el-table-column label="订单颜色" align="center" prop="orderColor" />
      <el-table-column label="订单金额(元)" align="center" prop="orderAmount" />
      <el-table-column label="订单状态" align="center" prop="orderStatus" />
      <el-table-column label="创建时间" align="center" prop="orderCreateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.orderCreateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单备注" align="center" prop="orderNote" show-overflow-tooltip />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['proxy:order:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['proxy:order:remove']"
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

    <!-- 添加或修改代裁订单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="工场pkid" prop="workshopPkid">
          <el-input v-model="form.workshopPkid" placeholder="请输入工场pkid" />
        </el-form-item>
        <el-form-item label="工场名称" prop="workshopName">
          <el-input v-model="form.workshopName" placeholder="请输入工场名称" />
        </el-form-item>
        <el-form-item label="下单用户pkid" prop="userPkid">
          <el-input v-model="form.userPkid" placeholder="请输入下单用户pkid" />
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="代裁款式pkid" prop="proxyStylePkid">
          <el-input v-model="form.proxyStylePkid" placeholder="请输入代裁款式pkid" />
        </el-form-item>
        <el-form-item label="代裁款式名称" prop="proxyStyleName">
          <el-input v-model="form.proxyStyleName" placeholder="请输入代裁款式名称" />
        </el-form-item>
        <el-form-item label="代裁材质pkid" prop="proxyMaterialPkid">
          <el-input v-model="form.proxyMaterialPkid" placeholder="请输入代裁材质pkid" />
        </el-form-item>
        <el-form-item label="代裁材质名称" prop="proxyMaterialName">
          <el-input v-model="form.proxyMaterialName" placeholder="请输入代裁材质名称" />
        </el-form-item>
        <el-form-item label="订单编号" prop="orderNo">
          <el-input v-model="form.orderNo" placeholder="请输入订单编号" />
        </el-form-item>
        <el-form-item label="订单描述" prop="orderDescribe">
          <el-input v-model="form.orderDescribe" placeholder="请输入订单描述" />
        </el-form-item>
        <el-form-item label="订单创建时间" prop="orderCreateTime">
          <el-date-picker clearable size="small"
                          v-model="form.orderCreateTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择订单创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="订单金额" prop="orderAmount">
          <el-input v-model="form.orderAmount" placeholder="请输入订单金额" />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-radio-group v-model="form.orderStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="订单数量" prop="orderQuantity">
          <el-input v-model="form.orderQuantity" placeholder="请输入订单数量" />
        </el-form-item>
        <el-form-item label="订单规格" prop="orderSpecification">
          <el-input v-model="form.orderSpecification" placeholder="请输入订单规格" />
        </el-form-item>
        <el-form-item label="订单颜色" prop="orderColor">
          <el-input v-model="form.orderColor" placeholder="请输入订单颜色" />
        </el-form-item>
        <el-form-item label="订单备注" prop="orderNote">
          <el-input v-model="form.orderNote" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="订单附件图片URL" prop="orderAnnexImageUrl">
          <el-input v-model="form.orderAnnexImageUrl" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="订单配送方式" prop="orderDeliveryType">
          <el-select v-model="form.orderDeliveryType" placeholder="请选择订单配送方式">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单期望时间" prop="orderExpectTime">
          <el-date-picker clearable size="small"
                          v-model="form.orderExpectTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择订单期望时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="配送信息pkid" prop="receiveAddressPkid">
          <el-input v-model="form.receiveAddressPkid" placeholder="请输入配送信息pkid" />
        </el-form-item>
        <el-form-item label="支付方式" prop="orderPayType">
          <el-select v-model="form.orderPayType" placeholder="请选择支付方式">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="支付状态">
          <el-radio-group v-model="form.orderPayStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="订单支付时间" prop="orderPayTime">
          <el-date-picker clearable size="small"
                          v-model="form.orderPayTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择订单支付时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="订单支付金额" prop="orderPayAmount">
          <el-input v-model="form.orderPayAmount" placeholder="请输入订单支付金额" />
        </el-form-item>
        <el-form-item label="加工金额" prop="orderProcessAmount">
          <el-input v-model="form.orderProcessAmount" placeholder="请输入加工金额" />
        </el-form-item>
        <el-form-item label="税费金额" prop="orderTaxAmount">
          <el-input v-model="form.orderTaxAmount" placeholder="请输入税费金额" />
        </el-form-item>
        <el-form-item label="运费金额" prop="orderFreightAmount">
          <el-input v-model="form.orderFreightAmount" placeholder="请输入运费金额" />
        </el-form-item>
        <el-form-item label="订单取消时间" prop="orderCancelTime">
          <el-date-picker clearable size="small"
                          v-model="form.orderCancelTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择订单取消时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="订单接单时间" prop="orderAcceptTime">
          <el-date-picker clearable size="small"
                          v-model="form.orderAcceptTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择订单接单时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="订单检测时间" prop="orderInspectionTime">
          <el-date-picker clearable size="small"
                          v-model="form.orderInspectionTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择订单检测时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="安排取料时间" prop="reclaimingStartTime">
          <el-date-picker clearable size="small"
                          v-model="form.reclaimingStartTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择安排取料时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="取料完成时间" prop="reclaimingCompletionTime">
          <el-date-picker clearable size="small"
                          v-model="form.reclaimingCompletionTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择取料完成时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="安排生产时间" prop="productionStartTime">
          <el-date-picker clearable size="small"
                          v-model="form.productionStartTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择安排生产时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="生产完成时间" prop="productionCompletionTime">
          <el-date-picker clearable size="small"
                          v-model="form.productionCompletionTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择生产完成时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="安排配送时间" prop="deliveryStartTime">
          <el-date-picker clearable size="small"
                          v-model="form.deliveryStartTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择安排配送时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="配送完成时间" prop="deliveryCompletionTime">
          <el-date-picker clearable size="small"
                          v-model="form.deliveryCompletionTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择配送完成时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="确认收货时间" prop="confirmReceiptTime">
          <el-date-picker clearable size="small"
                          v-model="form.confirmReceiptTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择确认收货时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="分配生产标志" prop="assignProduceFlag">
          <el-input v-model="form.assignProduceFlag" placeholder="请输入分配生产标志" />
        </el-form-item>
        <el-form-item label="分配检测标志" prop="assignInspectionFlag">
          <el-input v-model="form.assignInspectionFlag" placeholder="请输入分配检测标志" />
        </el-form-item>
        <el-form-item label="备注11" prop="remark">
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
import { listOrder, getOrder, delOrder, addOrder, updateOrder, exportOrder } from "@/api/garment/proxy/oms/order/order.js";

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
      // 代裁订单表格数据
      orderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        orderByColumn: "orderCreateTime",
        isAsc: "desc",
        pageNum: 1,
        pageSize: 10,
        workshopPkid: null,
        workshopName: null,
        userPkid: null,
        userName: null,
        proxyStylePkid: null,
        proxyStyleName: null,
        proxyMaterialPkid: null,
        proxyMaterialName: null,
        orderNo: null,
        orderDescribe: null,
        orderCreateTime: null,
        orderAmount: null,
        orderStatus: null,
        orderQuantity: null,
        orderSpecification: null,
        orderColor: null,
        orderNote: null,
        orderAnnexImageUrl: null,
        orderDeliveryType: null,
        orderExpectTime: null,
        receiveAddressPkid: null,
        orderPayType: null,
        orderPayStatus: null,
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
        assignProduceFlag: null,
        assignInspectionFlag: null,
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
        proxyStylePkid: [
          { required: true, message: "代裁款式pkid不能为空", trigger: "blur" }
        ],
        proxyStyleName: [
          { required: true, message: "代裁款式名称不能为空", trigger: "blur" }
        ],
        proxyMaterialPkid: [
          { required: true, message: "代裁材质pkid不能为空", trigger: "blur" }
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
          { required: true, message: "订单配送方式不能为空", trigger: "change" }
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
  },
  methods: {
    /** 查询代裁订单列表 */
    getList() {
      this.loading = true;
      listOrder(this.queryParams).then(response => {
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
        workshopName: null,
        userPkid: null,
        userName: null,
        proxyStylePkid: null,
        proxyStyleName: null,
        proxyMaterialPkid: null,
        proxyMaterialName: null,
        orderNo: null,
        orderDescribe: null,
        orderCreateTime: null,
        orderAmount: null,
        orderStatus: "0",
        orderQuantity: null,
        orderSpecification: null,
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
        assignProduceFlag: null,
        assignInspectionFlag: null,
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
      this.title = "添加代裁订单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const pkid = row.pkid || this.ids
      getOrder(pkid).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改代裁订单";
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
      this.$confirm('是否确认删除代裁订单编号为"' + pkids + '"的数据项?', "警告", {
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
      this.$confirm('是否确认导出所有代裁订单数据项?', "警告", {
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
