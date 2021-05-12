<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :inline="true"
      :model="queryParams"
      label-width="68px"
    >
      <el-form-item label="订单状态" prop="orderStatus">
        <el-select
          v-model="queryParams.orderStatus"
          clearable
          placeholder="请选择订单状态"
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in orderStatusOptions"
            :key="dict.dictValue"
            :label="
              queryParams.orderDeliveryType == 1
                ? dict.dictValue == 12
                  ? '待取货'
                  : dict.dictLabel
                : dict.dictLabel
            "
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="配送方式" prop="orderDeliveryType">
        <el-select
          v-model="queryParams.orderDeliveryType"
          placeholder="请选择配送方式"
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in orderDeliveryOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="订单编号" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          clearable
          placeholder="请输入订单编号"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户名称" prop="userName">
        <el-input
          v-model="queryParams.userName"
          clearable
          placeholder="请输入用户名称"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="wxappPhone">
        <el-input
          v-model="queryParams.wxappPhone"
          clearable
          placeholder="请输入手机号码"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="orderCreateTime">
        <el-date-picker
          v-model="dateRange"
          end-placeholder="结束日期"
          range-separator="-"
          size="small"
          start-placeholder="开始日期"
          style="width: 240px"
          type="daterange"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          icon="el-icon-search"
          size="mini"
          type="primary"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          icon="el-icon-s-help"
          plain
          size="mini"
          type="primary"
          @click="mergeOrders()"
          >合并取料</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          icon="el-icon-s-goods"
          plain
          size="mini"
          type="success"
          @click="sendOrders()"
          >合并配送</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          icon="el-icon-s-check"
          plain
          size="mini"
          type="primary"
          @click="confirmOrders"
          >确认接单</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          icon="el-icon-printer"
          plain
          size="mini"
          type="info"
          @click="printOrders"
          >批量打印</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
       <lodopPrint ref="lodopPrint" :icon="`el-icon-printer`" :size="`mini`"  :type="`info`"  :value="`确认并打印`" v-show="false"></lodopPrint>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          icon="el-icon-s-operation"
          plain
          size="mini"
          type="success"
          @click="rosterOrders"
          >批量分配</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['proxy:order:export']"
          icon="el-icon-download"
          plain
          size="mini"
          type="warning"
          @click="handleExport"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      ref="dataTable"
      v-loading="loading"
      :data="orderList"
      @selection-change="handleSelectionChange"
      :row-key="getRowKeys"
    >
      <el-table-column
        align="center"
        type="selection"
        width="55"
        :reserve-selection="true"
      />
      <el-table-column
        fixed
        align="center"
        label="订单编号"
        prop="orderNo"
        width="170"
      />
      <el-table-column fixed align="center" label="用户名称" prop="userName" />
      <el-table-column fixed align="center" label="手机号码" prop="wmsUser.wxappPhone" width="150" />
      <el-table-column
        align="center"
        label="商品款式"
        prop="proxyStyleName"
        width="80"
      />
      <el-table-column
        align="center"
        label="商品材质"
        prop="proxyMaterialName"
        width="80"
      />
      <el-table-column
        align="center"
        label="商品参数"
        prop="orderDescribe"
        show-overflow-tooltip
      />
      <el-table-column align="center" label="商品数量" prop="orderQuantity" />
      <el-table-column
        align="center"
        label="商品颜色"
        prop="orderColor"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">{{ row.orderColor || "暂无" }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="商品规格"
        prop="orderSpecification"
      >
        <template slot-scope="{ row }">{{
          row.orderSpecification || "暂无"
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="订单价格" prop="orderAmount">
        <template slot-scope="scope">
          <span>￥{{ scope.row.orderAmount | money }}</span>
        </template>
      </el-table-column>
      <!-- 图片 -->
      <el-table-column
        align="center"
        header-align="center"
        label="上传图片"
        prop="omsProxyOrderAnnexes"
      >
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.omsProxyOrderAnnexes"
            style="width: 50px; height: 50px"
            :src="scope.row.omsProxyOrderAnnexes[0].orderAnnexImageUrl"
            :preview-src-list="previewList(scope.row.omsProxyOrderAnnexes)"
          ></el-image>

          <span v-else>暂无图片</span>
        </template>
      </el-table-column>
      <el-table-column
        :formatter="orderDeliveryTypeFormat"
        align="center"
        label="配送方式"
        prop="orderDeliveryType"
        width="100"
      />
      <el-table-column
        :formatter="orderStatusFormat"
        align="center"
        label="订单状态"
        prop="orderStatus"
        width="100"
      />
             <el-table-column
        align="left"
        label="版式文件"
        prop="orderStyleAnnexImageUrl"
        width="150"
      >
        <template slot-scope="scope">
          <div style="display: flex; align-items: center">
            <i v-if="scope.row.orderStyleAnnexImageUrl" class="el-icon-folder-opened" style="font-size: 20px; color: #1890ff"></i>
            <i v-if="!scope.row.orderStyleAnnexImageUrl" class="el-icon-folder-opened" style="font-size: 20px; color: #b5b0ae"></i>
             <el-upload
             v-if="!scope.row.orderStyleAnnexImageUrl"
            class="upload-demo inline-block"
            action="/dev-api/oms/proxy/order/uploadProxyOrderAnnex"
            multiple
            :limit="3"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="bsHandleChange"
            style="margin-left: 10px;margin-right:10px"
          >
            <el-button
              size="mini"
              type="text"
              @click="selectLocalRow(scope.row,2)"
              >上传</el-button
            >
          </el-upload>
            <el-button  style="margin-left: 10px;" v-if="scope.row.orderStyleAnnexImageUrl"  size="mini" type="text" @click="downFile(scope.row,2)">下载</el-button>
            <el-button  v-if="scope.row.orderStyleAnnexImageUrl" size="mini" type="text" @click="delFile(scope.row,2)">删除</el-button>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        align="left"
        label="排版文件"
        prop="orderAnnexImageUrl"
        width="150"
      >
        <template slot-scope="scope">
       <div style="display: flex; align-items: center">
           <i v-if="scope.row.orderAnnexImageUrl" class="el-icon-folder-opened" style="font-size: 20px; color: #1890ff"></i>
            <i v-if="!scope.row.orderAnnexImageUrl" class="el-icon-folder-opened" style="font-size: 20px; color: #b5b0ae"></i>
            
             <el-upload
             v-if="!scope.row.orderAnnexImageUrl"
            class="upload-demo inline-block"
            action="/dev-api/oms/proxy/order/uploadProxyOrderAnnex"
            multiple
            :limit="3"
            :on-exceed="bsHandleExceed"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="bsHandleChange"
            style="margin-left: 10px;margin-right:10px"
          >
            <el-button
              size="mini"
              type="text"
              @click="selectLocalRow(scope.row,1)"
              >上传</el-button
            >
          </el-upload>
            <el-button  style="margin-left: 10px;" v-if="scope.row.orderAnnexImageUrl"  size="mini" type="text" @click="downFile(scope.row,1)">下载</el-button>
            <el-button  v-if="scope.row.orderAnnexImageUrl" size="mini" type="text" @click="delFile(scope.row,1)">删除</el-button>
          </div>
        </template>
      </el-table-column>



      <el-table-column
        align="center"
        label="订单创建时间"
        prop="orderCreateTime"
        width="200"
      >
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.orderCreateTime, "{y}-{m}-{d} {h}:{i}:{s}")
          }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="备注"
        prop="orderNote"
        show-overflow-tooltip
      />
      <el-table-column
        fixed="right"
        align="left"
        class-name="small-padding fixed-width"
        label="操作"
        width="340"
      >
        <template slot-scope="scope">
          <el-button
            icon="el-icon-printer"
            size="mini"
            type="text"
            @click="printOrder(scope.row)"
            >打印</el-button
          >
          <el-button
            v-hasPermi="['proxy:order:edit']"
            icon="el-icon-edit"
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
            >详情</el-button
          >
          <el-button
            v-show="scope.row.orderStatus === '2'"
            v-hasPermi="['proxy:order:remove']"
            icon="el-icon-s-help"
            size="mini"
            style="color: #008489"
            type="text"
            @click="pickOrder(scope.row)"
            >取料</el-button
          >
          <el-button
            v-show="scope.row.orderStatus === '4'"
            icon="el-icon-s-check"
            size="mini"
            style="color: #787be8"
            type="text"
            @click="confirmOrderSingle(scope.row)"
            >确认</el-button
          >
          <!-- <lodopPrint :lodopPrintStyle="lodopPrintStyle" v-show="scope.row.orderStatus === '4'"  @click="confirmOrderSingle(scope.row)></lodopPrint> -->
          <el-button
            v-show="
              [1, 2, 3, 4, 5, 6].indexOf(Number(scope.row.orderStatus)) > -1
            "
            v-hasPermi="['proxy:order:remove']"
            icon="el-icon-s-open"
            size="mini"
            style="color: #c03639"
            type="text"
            @click="handleDelete(scope.row)"
            >取消</el-button
          >
          <el-button
            v-show="scope.row.orderStatus === '5'"
            icon="el-icon-s-operation"
            size="mini"
            style="color: #f8ac59"
            type="text"
            @click="rosterOrder(scope.row, 1)"
            >分配生产</el-button
          >
          <el-button
            v-show="
              scope.row.orderStatus === '6' && scope.row.assignProduceFlag == 1
            "
            icon="el-icon-s-operation"
            size="mini"
            style="color: #f8ac59"
            type="text"
            @click="rosterOrder(scope.row, 2)"
            >重新分配</el-button
          >
          <el-button
            v-show="scope.row.orderStatus === '8'"
            icon="el-icon-search"
            size="mini"
            style="color: #f8ac59"
            type="text"
            @click="checkOrder(scope.row)"
            >检测</el-button
          >
          <el-button
            v-show="
              scope.row.orderStatus === '12' && scope.row.orderDeliveryType == 1
            "
            icon="el-icon-truck"
            size="mini"
            style="color: #f8ac59"
            type="text"
            @click="pickedGoods(scope.row)"
            >确认已取货</el-button
          >
          <el-button
            v-show="
              scope.row.orderStatus === '10' && scope.row.orderDeliveryType == 2
            "
            icon="el-icon-s-promotion"
            size="mini"
            style="color: indianred"
            type="text"
            @click="sendOrder(scope.row)"
            >配送</el-button
          >
          <!-- <el-upload
            class="upload-demo inline-block"
            action="/dev-api/oms/proxy/order/uploadProxyOrderAnnex"
            multiple
            :limit="3"
            :on-exceed="bsHandleExceed"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="bsHandleChange"
            style="margin-left: 10px"
          >
            <el-button
              icon="el-icon-upload2"
              size="mini"
              style="color: indianred"
              type="text"
              @click="selectLocalRow(scope.row)"
              >上传</el-button
            >
          </el-upload> -->
          <!-- <el-button
             v-if="scope.row.orderAnnexImageUrl"
            icon="el-icon-download"
            size="mini"
            style="color: indianred"
            type="text"
            @click="downFile(scope.row)"
           >下载</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :limit.sync="queryParams.pageSize"
      :page.sync="queryParams.pageNum"
      :total="total"
      @pagination="getList"
    />

    <!-- 添加或修改wxapp端订单对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      append-to-body
      @closed="handleClose"
    >
      <el-form ref="form" v-loading="loading" :model="form" label-width="180px">
        <el-card>
          <div slot="header" style="padding-left: 15px">
            <span>订单进度</span>
          </div>
          <div class="detail-container">
            <div
              class="step-style"
              v-if="form.omsProxyOrder && form.omsProxyOrder.orderStatus != 0"
            >
              <el-steps
                :active="formatStepStatus(form.omsProxyOrder.orderStatus)"
                align-center
                finish-status="success"
              >
                <el-step
                  :description="form.omsProxyOrder.orderCreateTime"
                  title="创建时间"
                ></el-step>
                <el-step
                  :description="form.omsProxyOrder.orderPayTime"
                  title="支付时间"
                ></el-step>
                <el-step
                  :description="form.omsProxyOrder.productionStartTime"
                  title="加工时间"
                ></el-step>
                <el-step
                  :description="form.omsProxyOrder.confirmReceiptTime"
                  title="完成时间"
                ></el-step>
              </el-steps>
            </div>
            <div
              class="step-style"
              v-if="
                form.omsProxyOrder &&
                form.omsProxyOrder.orderStatus == 0 &&
                !form.omsProxyOrder.orderPayTime
              "
            >
              <el-steps
                :active="formatStepStatus(form.omsProxyOrder.orderStatus)"
                align-center
                finish-status="success"
              >
                <el-step
                  :description="form.omsProxyOrder.orderCreateTime"
                  title="创建时间"
                ></el-step>
                <el-step
                  :description="form.omsProxyOrder.orderCancelTime"
                  title="取消时间"
                ></el-step>
              </el-steps>
            </div>

            <div
              class="step-style"
              v-if="
                form.omsProxyOrder &&
                form.omsProxyOrder.orderStatus == 0 &&
                form.omsProxyOrder.orderPayTime
              "
            >
              <el-steps
                :active="formatStepStatus(form.omsProxyOrder.orderStatus)"
                align-center
                finish-status="success"
              >
                <el-step
                  :description="form.omsProxyOrder.orderCreateTime"
                  title="创建时间"
                ></el-step>
                <el-step
                  :description="form.omsProxyOrder.orderPayTime"
                  title="支付时间"
                ></el-step>
                <el-step
                  :description="form.omsProxyOrder.orderCancelTime"
                  title="取消时间"
                ></el-step>
              </el-steps>
            </div>
          </div>
          <el-row style="margin-top: 10px">
            <el-card>
              <div slot="header">
                <el-tag effect="plain" type="danger">商品信息</el-tag>
              </div>
              <div class="el-table el-table--enable-row-hover el-table--medium">
                <table cellspacing="0" style="width: 100%">
                  <tbody>
                    <tr>
                      <td>
                        <div class="cell">商品款式：</div>
                      </td>
                      <td>
                        <div v-if="form.omsProxyOrder" class="cell">
                          {{ form.omsProxyOrder.proxyStyleName }}
                        </div>
                      </td>
                      <td>
                        <div class="cell">商品材质：</div>
                      </td>
                      <td>
                        <div v-if="form.omsProxyOrder" class="cell">
                          {{ form.omsProxyOrder.proxyMaterialName }}
                        </div>
                      </td>
                      <td>
                        <div class="cell">商品参数：</div>
                      </td>
                      <td>
                        <div v-if="form.omsProxyOrder" class="cell">
                          {{ form.omsProxyOrder.orderDescribe }}
                        </div>
                      </td>
                    </tr>
                    <!-- <tr>
                      <td>
                        <div class="cell">商品规格：</div>
                      </td>
                      <td>
                        <div v-if="form" class="cell">{{ form.orderSpecification }}</div>
                      </td>
                      <td>
                        <div class="cell">商品价格：</div>
                      </td>
                      <td>
                        <div v-if="form" class="cell">￥{{ form.orderAmount | money}}</div>
                      </td>
                      <td>
                        <div class="cell">商品数量：</div>
                      </td>
                      <td>
                        <div v-if="form" class="cell">{{ form.orderQuantity || 0 }}件</div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="cell">备注信息：</div>
                      </td>
                      <td colspan="7">
                        <div v-if="form" class="cell">{{ form.orderNote || '暂无备注'}}</div>
                      </td>
                    </tr> -->
                  </tbody>
                </table>
              </div>
            </el-card>
          </el-row>
          <el-row style="margin-top: 10px">
            <el-card>
              <div slot="header">
                <el-tag effect="plain" type="danger">订单信息</el-tag>
              </div>
              <el-tabs v-model="activeName" @tab-click>
                <el-tab-pane label="订单信息" name="order">
                  <div
                    class="el-table el-table--enable-row-hover el-table--medium"
                  >
                    <table cellspacing="0" style="width: 100%">
                      <tbody>
                        <tr>
                          <td>
                            <div class="cell">客户名称：</div>
                          </td>
                          <td colspan="3">
                            <div v-if="form.omsProxyOrder" class="cell">
                              {{ form.omsProxyOrder.userName }}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div class="cell">工场名称：</div>
                          </td>
                          <td colspan="3">
                            <div v-if="form.omsProxyOrder" class="cell">
                              {{ form.omsProxyOrder.workshopName }}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div class="cell">订单编号：</div>
                          </td>
                          <td>
                            <div v-if="form.omsProxyOrder" class="cell">
                              {{ form.omsProxyOrder.orderNo }}
                            </div>
                          </td>
                          <td>
                            <div class="cell">订单状态：</div>
                          </td>
                          <td>
                            <div v-if="form.omsProxyOrder" class="cell">
                              {{
                                formatOrderStatus(
                                  form.omsProxyOrder.orderStatus
                                )
                              }}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div class="cell">商品规格：</div>
                          </td>
                          <td>
                            <div v-if="form.omsProxyOrder" class="cell">
                              {{
                                form.omsProxyOrder.orderSpecification ||
                                "暂无规格"
                              }}
                            </div>
                          </td>
                          <td>
                            <div class="cell">商品颜色：</div>
                          </td>
                          <td>
                            <div v-if="form.omsProxyOrder" class="cell">
                              {{ form.omsProxyOrder.orderColor || "暂无颜色" }}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div class="cell">商品数量：</div>
                          </td>
                          <td>
                            <div v-if="form.omsProxyOrder" class="cell">
                              {{ form.omsProxyOrder.orderQuantity || "0" }}件
                            </div>
                          </td>
                          <td>
                            <div class="cell">配送方式</div>
                          </td>
                          <td>
                            <div v-if="form.omsProxyOrder" class="cell">
                              <span
                                v-if="form.omsProxyOrder.orderDeliveryType == 1"
                                >自送自取</span
                              >
                              <span
                                v-if="form.omsProxyOrder.orderDeliveryType == 2"
                                >上门取料</span
                              >
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div class="cell">订单备注：</div>
                          </td>
                          <td colspan="3">
                            <div v-if="form.omsProxyOrder" class="cell">
                              {{ form.omsProxyOrder.orderNote || "暂无备注" }}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div class="cell">加工费用：</div>
                          </td>
                          <td>
                            <div v-if="form.omsProxyOrder" class="cell">
                              ￥{{
                                form.omsProxyOrder.orderProcessAmount | money
                              }}
                            </div>
                          </td>
                          <td>
                            <div class="cell">加工税费：</div>
                          </td>
                          <td>
                            <div v-if="form.omsProxyOrder" class="cell">
                              ￥{{
                                form.omsProxyOrder.orderTaxAmount | money
                              }}（税率{{ form.omsProxyOrder.serverTaxRate }}%）
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div class="cell">物流费用：</div>
                          </td>
                          <td>
                            <div v-if="form.omsProxyOrder" class="cell">
                              ￥{{
                                form.omsProxyOrder.orderFreightAmount | money
                              }}
                            </div>
                          </td>
                          <td>
                            <div class="cell">实付金额：</div>
                          </td>
                          <td>
                            <div v-if="form.omsProxyOrder" class="cell">
                              ￥{{ form.omsProxyOrder.orderPayAmount | money }}
                            </div>
                          </td>
                        </tr>
                        <tr v-if="form.fixRecord">
                          <td>
                            <div class="cell">实际数量：</div>
                          </td>
                          <td>
                            <div v-if="form.fixRecord" class="cell">
                              {{
                                form.fixRecord.orderActualProduceQuantity ||
                                "0"
                              }}件
                            </div>
                          </td>
                          <td v-if="form.omsProxyOrder">
                            <div
                              class="cell"
                              v-if="form.fixRecord.orderOperateType == 1"
                            >
                              已退差额
                            </div>
                            <div
                              class="cell"
                              v-if="
                                form.fixRecord.orderOperateType == 2 &&
                                form.fixRecord.orderOperateStatus == 2
                              "
                            >
                              待补差额
                            </div>
                            <div
                              class="cell"
                              v-if="
                                form.fixRecord.orderOperateType == 2 &&
                                form.fixRecord.orderOperateStatus == 1
                              "
                            >
                              已付差额
                            </div>
                          </td>
                          <td>
                            <div v-if="form.fixRecord" class="cell">
                              ￥{{ form.fixRecord.orderOperateAmount || "0" }}
                            </div>
                          </td>
                        </tr>
                        <tr
                          v-if="
                            form.fixRecord &&
                            form.fixRecord.orderOperateType == 1
                          "
                        >
                          <td>
                            <div class="cell">退款类型：</div>
                          </td>
                          <td>
                            <div v-if="form.wmsUserWalletRecord" class="cell">
                              {{ form.wmsUserWalletRecord.recordName || "" }}
                            </div>
                          </td>
                          <td v-if="form.fixRecord">
                            <div class="cell" v-if="form.fixRecord">
                              退款时间
                            </div>
                          </td>
                          <td>
                            <div v-if="form.fixRecord" class="cell">
                              {{ form.fixRecord.createTime || "" }}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div class="cell">支付方式：</div>
                          </td>
                          <td>
                            <div v-if="form.omsProxyOrder" class="cell">
                              {{
                                formatOrderPayType(
                                  form.omsProxyOrder.orderPayType
                                ) || "暂未支付"
                              }}
                            </div>
                          </td>
                          <td>
                            <div class="cell">期望时间：</div>
                          </td>
                          <td>
                            <div v-if="form.omsProxyOrder" class="cell">
                              {{
                                parseTime(
                                  form.omsProxyOrder.orderExpectTime,
                                  "{y}-{m}-{d}"
                                )
                              }}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </el-tab-pane>
                <el-tab-pane
                  v-if="
                    form.omsProxyOrder &&
                    form.omsProxyOrder.orderDeliveryType == 2
                  "
                  label="取送信息"
                  name="pickup"
                >
                  <el-row style="margin-top: 10px">
                    <el-card>
                      <div slot="header">
                        <el-tag effect="plain">取料</el-tag>
                      </div>
                      <div
                        class="el-table el-table--enable-row-hover el-table--medium"
                      >
                        <table cellspacing="0" style="width: 100%">
                          <tbody>
                            <tr>
                              <td>
                                <div class="cell">运单编号：</div>
                              </td>
                              <td>
                                <div v-if="form" class="cell">
                                  {{ form.reclaimerOmsWaybill.waybillNo }}
                                </div>
                              </td>
                              <td>
                                <div class="cell">取料方式：</div>
                              </td>
                              <td>
                                <div v-if="form" class="cell">上门取料</div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div class="cell">客户名称：</div>
                              </td>
                              <td>
                                <div v-if="form.wmsUser" class="cell">
                                  {{ form.omsProxyOrder.userName }}（{{
                                    form.omsProxyOrder.wxappPhone
                                  }})
                                </div>
                              </td>
                              <td>
                                <div class="cell">取料时间：</div>
                              </td>
                              <td>
                                <div v-if="form" class="cell">
                                  {{
                                    parseTime(
                                      form.reclaimerOmsWaybill
                                        .waybillCompleteTime,
                                      "{y}-{m}-{d} {h}:{i}:{s}"
                                    )
                                  }}
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div class="cell">取料信息：</div>
                              </td>
                              <td colspan="3">
                                <div
                                  v-if="form.wmsUserReceiveAddress"
                                  class="cell"
                                >
                                  {{ form.wmsUserReceiveAddress.receiveName }}，
                                  {{
                                    form.wmsUserReceiveAddress.receivePhone
                                  }}，{{
                                    form.wmsUserReceiveAddress.province
                                  }}，{{ form.wmsUserReceiveAddress.city }}，
                                  {{ form.wmsUserReceiveAddress.region }}，{{
                                    form.wmsUserReceiveAddress.detailAddress
                                  }}
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div class="cell">取料人员：</div>
                              </td>
                              <td colspan="3">
                                <div v-if="form.reclaimerUserInfo" class="cell">
                                  {{ form.reclaimerUserInfo.nickName }}，{{
                                    form.reclaimerUserInfo.phonenumber ||
                                    "暂无手机号"
                                  }}
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </el-card>
                  </el-row>
                  <el-row
                    v-if="form.deliveryOmsWaybill"
                    style="margin-top: 10px"
                  >
                    <el-card>
                      <div slot="header">
                        <el-tag effect="plain" type="success">配送</el-tag>
                      </div>
                      <div
                        class="el-table el-table--enable-row-hover el-table--medium"
                      >
                        <table cellspacing="0" style="width: 100%">
                          <tbody>
                            <tr>
                              <td>
                                <div class="cell">运单编号：</div>
                              </td>
                              <td>
                                <div v-if="form" class="cell">
                                  {{ form.deliveryOmsWaybill.waybillNo }}
                                </div>
                              </td>
                              <td>
                                <div class="cell">配送方式：</div>
                              </td>
                              <td>
                                <div v-if="form" class="cell">配送上门</div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div class="cell">客户名称：</div>
                              </td>
                              <td>
                                <div v-if="form.wmsUser" class="cell">
                                  {{ form.wmsUser.nickName }}（{{
                                    form.wmsUser.wxappPhone
                                  }}）
                                </div>
                              </td>
                              <td>
                                <div class="cell">配送时间：</div>
                              </td>
                              <td>
                                <div v-if="form" class="cell">
                                  {{
                                    parseTime(
                                      form.deliveryOmsWaybill
                                        .waybillCompleteTime,
                                      "{y}-{m}-{d} {h}:{i}:{s}"
                                    )
                                  }}
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div class="cell">配送信息：</div>
                              </td>
                              <td colspan="3">
                                <div
                                  v-if="form.wmsUserReceiveAddress"
                                  class="cell"
                                >
                                  {{ form.wmsUserReceiveAddress.receiveName }}，
                                  {{
                                    form.wmsUserReceiveAddress.receivePhone
                                  }}，{{
                                    form.wmsUserReceiveAddress.province
                                  }}，{{ form.wmsUserReceiveAddress.city }}，
                                  {{ form.wmsUserReceiveAddress.region }}，{{
                                    form.wmsUserReceiveAddress.detailAddress
                                  }}
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div class="cell">配送人员：</div>
                              </td>
                              <td colspan="3">
                                <div v-if="form.wmsUser" class="cell">
                                  {{ form.deliveryUserInfo.nickName }}，{{
                                    form.deliveryUserInfo.phonenumber ||
                                    "暂无手机号"
                                  }}
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </el-card>
                  </el-row>
                </el-tab-pane>
                <el-tab-pane label="开票信息" name="Invoicing">
                  <div
                    class="el-table el-table--enable-row-hover el-table--medium"
                  >
                    <table cellspacing="0" style="width: 100%">
                      <tbody>
                        <tr>
                          <td width="125">
                            <div class="cell">开票抬头：</div>
                          </td>
                          <td>
                            <div v-if="form.omsProxyOrder" class="cell">
                              {{
                                formatOrderPayType(
                                  form.omsProxyOrder.orderPayType
                                )
                              }}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td width="125">
                            <div class="cell">开票税号：</div>
                          </td>
                          <td>
                            <div v-if="form.omsProxyOrder" class="cell">
                              {{
                                parseTime(
                                  form.omsProxyOrder.orderExpectTime,
                                  "{y}-{m}-{d}"
                                )
                              }}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="生产信息" name="producing">
                  <div class="producting-content-main">
                    <div class="producting-content-main-list">
                      <div
                        v-if="form.orderAssignTime"
                        style="
                          color: #888888;
                          margin-bottom: 30px;
                          font-size: 15px;
                        "
                      >
                        <span style
                          >指派:
                          {{
                            dataFormatSecond(new Date(form.orderAssignTime))
                          }}</span
                        >
                        <span style="margin-left: 30px"
                          >设备: {{ form.deviceAssignCode }}</span
                        >
                      </div>
                      <div
                        style="
                          color: #888888;
                          margin-bottom: 30px;
                          font-size: 15px;
                          display: flex;
                          justify-content: center;
                        "
                        v-else
                      >
                        <span>暂无指派信息</span>
                      </div>

                      <!-- <el-timeline v-if="form.produceRecordInfo && form.produceRecordInfo.length > 0">
                        <el-timeline-item v-for="(item,index) in form.produceRecordInfo" :key="index"  :color="index == 0 ? '#48aafd' : ''" :timestamp="item.orderOperateTime" placement="top">
                          <el-card>
                            <h4>{{productStatus[item.orderOperateStatus-1].value}}</h4>
                          <div>
                              <span>生产员{{item.assignProduceUserName}}在设备编号为</span>
                              <span style="color:#ff5400;font-weight:600;">{{item.deviceCode}}</span>
                              <span>的设备上</span>
                              <span>{{productStatus[item.orderOperateStatus-1].value}}</span>
                            </div>
                          </el-card>
                        </el-timeline-item>
                      </el-timeline>-->
                      <el-timeline
                        v-if="
                          form.produceRecordInfo &&
                          form.produceRecordInfo.length > 0
                        "
                      >
                        <el-timeline-item
                          v-for="(item, index) in form.produceRecordInfo"
                          :key="index"
                        >
                          <span style="color: #888888; font-weight: 600">{{
                            productStatus[item.orderOperateStatus - 1].value
                          }}</span>
                          <span style="color: #999999; margin-left: 20px">{{
                            item.assignProduceUserName
                          }}</span>
                          <span style="color: #999999; margin-left: 20px">{{
                            item.orderOperateTime
                          }}</span>
                        </el-timeline-item>
                      </el-timeline>
                      <div v-else class="no-data-product">暂无生产信息</div>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-card>
          </el-row>
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 对话框-start -->
    <div class="order-dialog">
      <!-- 取料分配配送员-dialog -->
      <el-dialog
        :visible.sync="pickerVisible"
        center
        title="选择配送员"
        width="400px"
      >
        <div class="relationVisibleMain">
          <div class="relationVisibleMain-top">
            <el-input
              v-model="pickerSearchKey"
              clearable
              placeholder="请输入工号/姓名"
            ></el-input>

            <el-button
              class="search-button"
              icon="el-icon-search"
              size="medium"
              type="primary"
              @click="getPickerList()"
              >查询</el-button
            >
          </div>
          <div v-if="pickerList.length > 0" class="mid">
            <div v-for="(item, index) in pickerList" :key="index" class="item">
              <div class="left">
                <el-radio
                  v-model="selelctPickerId"
                  :label="item.userId"
                  @change="selectPicker(item)"
                >
                  <span class="left-value">
                    <span>{{ item.nickName }}</span>
                    <span v-if="item.jobNumber">/{{ item.jobNumber }}</span>
                  </span>
                </el-radio>
              </div>
            </div>
          </div>
          <div v-else class="mid mid-no">
            <span>暂无数据</span>
          </div>
          <div slot="footer" class="dialog-footer bottom">
            <el-button class="opt-button" size="medium" @click="cancelPicker()"
              >取消</el-button
            >
            <el-button
              class="opt-button"
              size="medium"
              type="primary"
              @click="confirmPicker()"
              >确认</el-button
            >
          </div>
        </div>
      </el-dialog>

      <!-- 生产员设备分配-dialog -->
      <el-dialog
        :visible.sync="producterVisible"
        center
        title="选择设备"
        width="400px"
      >
        <div class="relationVisibleMain">
          <div class="relationVisibleMain-top">
            <el-input
              v-model="deviceSearchKey"
              clearable
              placeholder="请输入设备编号/名称/员工姓名"
            ></el-input>

            <el-button
              class="search-button"
              icon="el-icon-search"
              size="medium"
              type="primary"
              @click="getListRosterDevice()"
              >查询</el-button
            >
          </div>
          <div v-if="devicerList.length > 0" class="mid">
            <div v-for="(item, index) in devicerList" :key="index" class="item">
              <div class="left">
                <el-radio
                  v-model="selelctDeviceId"
                  :label="item.devicePkid"
                  @change="selectDevicer(item)"
                >
                  <span class="left-value">
                    <span>{{ item.deviceName }}</span>
                    <span>-{{ item.deviceCode }}</span>
                    <span>-生产员{{ item.rosterUserName }}</span>
                    <!-- <span v-if="item.jobNumber">/{{item.jobNumber}}</span> -->
                  </span>
                </el-radio>
              </div>
            </div>
          </div>
          <div v-else class="mid mid-no">
            <span>暂无数据</span>
          </div>
          <div slot="footer" class="dialog-footer bottom">
            <el-button
              class="opt-button"
              size="medium"
              @click="cancelProducter()"
              >取消</el-button
            >
            <el-button
              class="opt-button"
              size="medium"
              type="primary"
              @click="confirmProducter()"
              >确认</el-button
            >
          </div>
        </div>
      </el-dialog>

      <!-- 检测员分配-dialog -->
      <el-dialog
        :visible.sync="checkerVisible"
        center
        title="选择检测员"
        width="400px"
      >
        <div class="relationVisibleMain">
          <div class="relationVisibleMain-top">
            <el-input
              v-model="checkerSearchKey"
              clearable
              placeholder="请输入工号/姓名"
            ></el-input>

            <el-button
              class="search-button"
              icon="el-icon-search"
              size="medium"
              type="primary"
              @click="getCheckerList()"
              >查询</el-button
            >
          </div>
          <div v-if="checkerList.length > 0" class="mid">
            <div v-for="(item, index) in checkerList" :key="index" class="item">
              <div class="left">
                <el-radio
                  v-model="selelctCheckerId"
                  :label="item.userId"
                  @change="selectChecker(item)"
                >
                  <span class="left-value">
                    <span>{{ item.nickName }}</span>
                    <span v-if="item.jobNumber">/{{ item.jobNumber }}</span>
                  </span>
                </el-radio>
              </div>
            </div>
          </div>
          <div v-else class="mid mid-no">
            <span>暂无数据</span>
          </div>
          <div slot="footer" class="dialog-footer bottom">
            <el-button class="opt-button" size="medium" @click="cancelChecker()"
              >取消</el-button
            >
            <el-button
              class="opt-button"
              size="medium"
              type="primary"
              @click="confirmChecker()"
              >确认</el-button
            >
          </div>
        </div>
      </el-dialog>

      <!-- 订单是否取料检测组件 -->
      <isPickDialog
        ref="isPickDialogRef"
        :isPickList="isPickList"
        :title="dialogTitle"
        :visible="isPickVisible"
      ></isPickDialog>

      <!-- 打印组件 -->
      <!-- <orderPrint ref="orderPrintRef" :title="printDialogTitle"></orderPrint> -->
      <orderPrints ref="orderPrintRefs" :title="printDialogTitle"></orderPrints>
    </div>
    <!-- 对话框-end -->
  </div>
</template>

<script>
import {
  listOrder,
  getOrder,
  delOrder,
  addOrder,
  updateOrder,
  cancelOrder,
  exportOrder,
  confirmOrder,
  listRoster,
  listRosterDevice,
  orderAssignDevice,
  orderAssignDeviceAgain,
  mergeOrder,
  orderAssignSender,
  orderAssignChecker,
  getPickers,
  getCheckerListApi,
  orderPicked,
  uploadFile,
  orderEdit,
} from "@/api/garment/proxy/oms/order/order.js";
import isPickDialog from "./components/isPickDialog";
import orderPrint from "@/components/Print/order-print";
import orderPrints from "@/components/Print/wait-cut-order-prints"; // 批量打印
// import lodopPrint from "@/components/Print/lodop/lodopPrint"; // 自动打印

export default {
  name: "Order",
  components: {
    isPickDialog,
    orderPrint,
    orderPrints,
    // lodopPrint
  },
  data() {
    return {
      lodopPrintStyle: {
        // lodop样式
        icon: "el-icon-printer",
        size: "mini",
        type: "info",
        value: "确认并打印",
      },
      dialogTitle: "",
      printDialogTitle: "订单打印", //订单打印
      printDialogTitles: "批量打印", //订单打印
      isSingle: false, // 是否单选
      pickerVisible: false, // 取料对话框
      producterVisible: false, // 生产员对话框
      checkerVisible: false, // 检测员对话框
      orderPrintVisible: false, // 打印弹框
      pickerList: [], // 取料员list
      checkerList: [], // 检测员list
      pickerSearchKey: "", //取料查询关键字
      deviceSearchKey: "", //排班设备查询关键字
      checkerSearchKey: "", //检测查询关键字
      producterSearchKey: "", // 生产员关键字查询
      producterList: [], // 生产员list
      devicerList: [], // 排班设备list
      selelctPickerId: "", // 选择的配送员ID
      selelctProducterId: "", // 选择生产员ID
      selelctDeviceId: "", // 选择排班设备ID
      selelctCheckerId: "", // 选择检测员ID
      isPickVisible: false, // 检测是否已取料
      isPickList: [
        {
          date: "123",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "234",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "567",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2345",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
      ],
      // 订单详细初始激活标签
      activeName: "order",
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      selectOrderList: [], // 选中的订单数组
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
      // 订单支付方式
      orderPayTypeOptions: [],
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
        orderByColumn: "pkid",
        isAsc: "desc",
        orderStatus: null,
        orderDeliveryType: "1", // 自送自取 1  上门取料2
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
          { required: true, message: "工场pkid不能为空", trigger: "blur" },
        ],
        userPkid: [
          { required: true, message: "下单用户pkid不能为空", trigger: "blur" },
        ],
        serverParentPkid: [
          { required: true, message: "服务父分类id不能为空", trigger: "blur" },
        ],
        serverClassificationPkid: [
          { required: true, message: "服务分类id不能为空", trigger: "blur" },
        ],
        orderNo: [
          { required: true, message: "订单编号不能为空", trigger: "blur" },
        ],
        orderCreateTime: [
          { required: true, message: "订单创建时间不能为空", trigger: "blur" },
        ],
        orderAmount: [
          { required: true, message: "订单金额不能为空", trigger: "blur" },
        ],
        orderQuantity: [
          { required: true, message: "订单数量不能为空", trigger: "blur" },
        ],
        orderDeliveryType: [
          {
            required: true,
            message: "订单配送方式：1->自送自取；2->上门取料不能为空",
            trigger: "change",
          },
        ],
        orderExpectTime: [
          { required: true, message: "订单期望时间不能为空", trigger: "blur" },
        ],
        orderPayAmount: [
          { required: true, message: "订单支付金额不能为空", trigger: "blur" },
        ],
        orderProcessAmount: [
          { required: true, message: "加工金额不能为空", trigger: "blur" },
        ],
        orderTaxAmount: [
          { required: true, message: "税费金额不能为空", trigger: "blur" },
        ],
        orderFreightAmount: [
          { required: true, message: "运费金额不能为空", trigger: "blur" },
        ],
      },
      productingList: [
        // 生产信息列表
        {
          productingTitle: "开始生产",
          productingStatus: 1,
          user: "苏铭",
          deviceCode: "A001",
          createTime: "2021-03-12 12:23:54",
        },
        {
          productingTitle: "生产暂停",
          productingStatus: 2,
          user: "苏铭",
          deviceCode: "A001",
          createTime: "2021-03-12 12:23:54",
        },
        {
          productingTitle: "继续生产",
          productingStatus: 3,
          user: "张三",
          deviceCode: "A001",
          createTime: "2021-03-12 12:23:54",
        },
        {
          productingTitle: "生产暂停",
          productingStatus: 2,
          user: "张三",
          deviceCode: "A001",
          createTime: "2021-03-12 12:23:54",
        },
        {
          productingTitle: "继续生产",
          productingStatus: 3,
          user: "李四",
          deviceCode: "A001",
          createTime: "2021-03-12 12:23:54",
        },
        {
          productingTitle: "生产完成",
          productingStatus: 4,
          user: "李四",
          deviceCode: "A001",
          createTime: "2021-03-12 12:23:54",
        },
      ],
      productStatus: [
        { key: 1, value: "开始生产" },
        { key: 2, value: "暂停生产" },
        { key: 3, value: "继续生产" },
        { key: 4, value: "完成生产" },
      ],
      rosterDeviceType: 1, // 排班类型 1 排班 2 重新排班
      localRow: {},
      uploadType:1,// 1排版，2版式
    };
  },
  mounted() {
    console.log("mounted");
  },
  created() {
    console.log("created");

    this.getList();
    this.getDicts("oms_order_status").then((response) => {
      this.orderStatusOptions = response.data;
    });
    this.getDicts("oms_delivery_type").then((response) => {
      this.orderDeliveryOptions = response.data;
    });
    this.getDicts("oms_pay_type").then((response) => {
      this.orderPayTypeOptions = response.data;
    });
  },
  // 订单金额过滤器
  filters: {
    money(value) {
      if (!value) return "0.00";
      const value2Array = value.toString().split(".");
      const intPart = value2Array[0].toString(); //获取整数部分
      const intPartFormat = intPart.replace(/(\d)(?=(?:\d{3})+$)/g, "$1,"); //将整数部分逢三一断
      let floatPart = ".00"; //预定义小数部分

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
    },
  },
  methods: {
    dataFormat(d) {
      console.log("d", d);
      let str =
        d.getFullYear() +
        "-" +
        this.p(d.getMonth() + 1) +
        "-" +
        this.p(d.getDate());
      return str;
    },
    dataFormatSecond(d) {
      console.log("d", d);
      let str =
        d.getFullYear() +
        "-" +
        this.p(d.getMonth() + 1) +
        "-" +
        this.p(d.getDate()) +
        " " +
        this.p(d.getHours()) +
        ":" +
        this.p(d.getMinutes()) +
        ":" +
        this.p(d.getSeconds());
      return str;
    },
    //创建补0函数
    p(s) {
      return s < 10 ? "0" + s : s;
    },
    /** 查询wxapp端订单列表 */
    getList() {
      this.loading = true;
      listOrder(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.orderList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 取消按钮
    cancel() {
      this.activeName = "order";
      this.open = false;
      this.reset();
    },
    handleClose() {
      this.activeName = "order";
      this.open = false;
      this.reset();
    },
    // 分页记忆多选
    getRowKeys(row) {
      return row.pkid;
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
        remark: null,
      };
      this.resetForm("form");
    },
    // 步骤条状态激活
    formatStepStatus(value) {
      value = Number(value);
      if (this.form.omsProxyOrder.orderDeliveryType == 1) {
        if (value >= 4 && value < 7) {
          // 订单已支付
          return 2;
        } else if (value >= 7 && value < 13) {
          // 订单加工中
          return 3;
        } else if (value >= 13) {
          // 订单已完成
          return 4;
        } else {
          // 其他
          if (value == 0 && this.form.omsProxyOrder.orderPayTime) {
            return 3;
          } else if (value == 0 && !this.form.omsProxyOrder.orderPayTime) {
            return 2;
          }
          return 1;
        }
      } else {
        if (value >= 2 && value < 7) {
          // 订单已支付
          return 2;
        } else if (value >= 7 && value < 13) {
          // 订单加工中
          return 3;
        } else if (value >= 13) {
          // 订单已完成
          return 4;
        } else {
          // 其他
          if (value == 0 && this.form.omsProxyOrder.orderPayTime) {
            return 3;
          } else if (value == 0 && !this.form.omsProxyOrder.orderPayTime) {
            return 2;
          }
          return 1;
        }
      }
    },
    // 订单状态字典翻译
    orderStatusFormat(row, column) {
      if (row.orderStatus == 8) {
        if (!row.assignInspectionFlag) {
          return "待分配检测";
        } else {
          return row.orderDeliveryType == 1
            ? row.orderStatus == 12
              ? "待取货"
              : this.selectDictLabel(this.orderStatusOptions, row.orderStatus)
            : this.selectDictLabel(this.orderStatusOptions, row.orderStatus);
        }
      } else {
        return row.orderDeliveryType == 1
          ? row.orderStatus == 12
            ? "待取货"
            : this.selectDictLabel(this.orderStatusOptions, row.orderStatus)
          : this.selectDictLabel(this.orderStatusOptions, row.orderStatus);
      }
    },
    // 运单状态格式化
    formatOrderStatus(value) {
      return this.form.orderDeliveryType == 1
        ? value == 12
          ? "待取货"
          : this.selectDictLabel(this.orderStatusOptions, value)
        : this.selectDictLabel(this.orderStatusOptions, value);
    },
    // 订单支付类型格式化
    formatOrderPayType(value) {
      return this.selectDictLabel(this.orderPayTypeOptions, value);
    },
    // 订单配送方式字典翻译
    orderDeliveryTypeFormat(row, column) {
      return this.selectDictLabel(
        this.orderDeliveryOptions,
        row.orderDeliveryType
      );
    },
    // 预览图片list
    previewList(res) {
      console.log("imgList", res);
      if (!res) {
        return;
      }
      let imgList = res.map((item) => {
        return item.orderAnnexImageUrl;
      });
      console.log("imgList", imgList);
      return imgList;
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.selectOrderList = [];
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
      // this.ids = selection.map(item => item.pkid)
      // this.single = selection.length!==1
      // this.multiple = !selection.length
      // this.selectOrderList = selection.map(item => item.pkid);
      this.selectOrderList = selection;
      console.log(this.selectOrderList);
    },
    // 取消已取料的订单
    cancelSelected(e) {
      console.log("e", e);
      // this.$refs.dataTable.clearSelection;
      this.selectOrderList = this.selectOrderList.filter((item) => {
        this.$refs.dataTable.toggleRowSelection(item, false);
        return e.indexOf(item.orderNo) < 0;
      });
      this.selectOrderList.map((item) => {
        this.$nextTick(() => {
          this.$refs.dataTable.toggleRowSelection(item, true);
        });
      });
      console.log(this.selectOrderList);
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
      const pkid = row.pkid || this.ids;
      getOrder(pkid).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "【订单详情】";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.pkid != null) {
            updateOrder(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOrder(this.form).then((response) => {
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
      this.$confirm(
        "是否确认取消订单编号为【" + row.orderNo + "】的数据项?",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return cancelOrder(pkids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("订单平台取消成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有订单数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportOrder(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
    /** 获取配送员*/
    getPickerList() {
      // this.loading = true;
      let params = {
        userKey: this.pickerSearchKey || "",
      };
      getPickers(params).then((res) => {
        if (res.code == 200) {
          this.pickerList = res.data;
        }
      });
    },
    /** 获取生产员*/
    getProducterList() {
      // this.loading = true;
      let params = {
        userKey: this.producterSearchKey || "",
      };
      getProducters(params).then((res) => {
        if (res.code == 200) {
          this.producterList = res.data;
        }
      });
    },
    // 取料
    pickOrder(e) {
      this.selectOrderList = [e];
      this.pickerVisible = true;
      this.isSingle = true;
      this.getPickerList();
    },
    // 配送
    sendOrder(e) {
      this.selectOrderList = [e];
      this.pickerVisible = true;
      this.isSingle = true;
      this.getPickerList();
    },
    // 合并取料
    mergeOrders() {
      this.isSingle = false;
      console.log("this.queryParams.orderStatus", this.queryParams.orderStatus);
      if (this.queryParams.orderStatus != 2) {
        return this.$message({
          type: "warning",
          message: "请先筛选出待取料订单!",
        });
      }
      if (this.selectOrderList.length == 0) {
        return this.$message({
          type: "warning",
          message: "请先选择订单!",
        });
      }
      this.pickerVisible = true;
      this.getPickerList();
    },
    // 合并配送
    sendOrders() {
      this.isSingle = false;
      if (this.queryParams.orderStatus != 10) {
        return this.$message({
          type: "warning",
          message: "请先筛选出待配送订单!",
        });
      }
      if (this.selectOrderList.length == 0) {
        return this.$message({
          type: "warning",
          message: "请先选择订单!",
        });
      }
      this.pickerVisible = true;
      this.getPickerList();
    },
    // 批量分配
    rosterOrders() {
      if (this.queryParams.orderStatus != 5) {
        return this.$message({
          type: "warning",
          message: "请先筛选出待排单订单!",
        });
      }
      if (this.selectOrderList.length == 0) {
        return this.$message({
          type: "warning",
          message: "请先选择订单!",
        });
      }
      this.rosterOrder(null, 1);
    },

    // 取料单选
    mergeOrderApiSingle() {
      let orderPkids = this.selectOrderList.map((item) => item.pkid);
      let params = {
        deliveryUserPkid: this.selelctPickerId,
        orderPkids: orderPkids,
        workshopPkid: this.$store.state.user.userInfo.workshopId,
      };

      mergeOrder(params).then((res) => {
        if (res.code == 200) {
          this.selelctPickerId = "";
          this.selectOrderList = [];
          this.pickerVisible = false;
          //this.handleQuery();
          this.getList();
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        } else if (res.code == 422) {
          this.selelctPickerId = "";
          this.selectOrderList = [];
          this.pickerVisible = false;
          this.$message({
            type: "warning",
            message: `此订单${res.msg}已经取过料!`,
          });
        } else {
          this.$message({
            type: "fail",
            message: "操作失败!",
          });
        }
      });
    },

    // 配送单选
    sendOrderApiSingle() {
      let orderPkids = this.selectOrderList.map((item) => item.pkid);
      let params = {
        deliveryUserPkid: this.selelctPickerId,
        orderPkids: orderPkids,
        workshopPkid: this.$store.state.user.userInfo.workshopId,
      };

      orderAssignSender(params).then((res) => {
        if (res.code == 200) {
          this.selelctPickerId = "";
          this.selectOrderList = [];
          this.pickerVisible = false;
          // this.handleQuery();
          this.getList();
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        } else if (res.code == 422) {
          this.selelctPickerId = "";
          this.selectOrderList = [];
          this.pickerVisible = false;
          this.$message({
            type: "warning",
            message: `此订单${res.msg}已分配配送员!`,
          });
        } else {
          this.$message({
            type: "fail",
            message: "操作失败!",
          });
        }
      });
    },
    // 合并取料-api
    mergeOrderApi() {
      let orderPkids = this.selectOrderList.map((item) => item.pkid);
      let params = {
        deliveryUserPkid: this.selelctPickerId,
        orderPkids: orderPkids,
        workshopPkid: this.$store.state.user.userInfo.workshopId,
      };

      mergeOrder(params).then((res) => {
        if (res.code == 200) {
          this.selelctPickerId = "";
          this.selectOrderList = [];
          this.pickerVisible = false;
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          // this.handleQuery();
          this.getList();
        } else if (res.code == 422) {
          this.dialogTitle = "已取料订单";
          let orderList = res.msg.split(",");
          this.isPickList = orderList.map((res) => {
            return {
              id: res,
              statusText: "已取料",
            };
          });
          this.$refs.isPickDialogRef.open();
        } else {
          this.$message({
            type: "fail",
            message: "操作失败!",
          });
        }
      });
    },

    // 合并配送-api
    sendOrderApi() {
      let orderPkids = this.selectOrderList.map((item) => item.pkid);
      let params = {
        deliveryUserPkid: this.selelctPickerId,
        orderPkids: orderPkids,
        workshopPkid: this.$store.state.user.userInfo.workshopId,
      };

      orderAssignSender(params).then((res) => {
        if (res.code == 200) {
          this.selelctPickerId = "";
          this.selectOrderList = [];
          this.pickerVisible = false;
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          // this.handleQuery();
          this.getList();
        } else if (res.code == 422) {
          this.dialogTitle = "已配送订单";
          let orderList = res.msg.split(",");
          this.isPickList = orderList.map((res) => {
            return {
              id: res,
              statusText: "已配送",
            };
          });
          this.$refs.isPickDialogRef.open();
        } else {
          this.$message({
            type: "fail",
            message: "操作失败!",
          });
        }
      });
    },

    // 选择配送员
    selectPicker(item) {
      this.selelctPickerId = item.userId;
    },
    // 选择生产员
    selectProducter(item) {
      this.selelctProducterId = item.userId;
    },
    // 选择排班设备
    selectDevicer(item) {
      this.selelctDeviceId = item.devicePkid;
    },
    // 选择检测员
    selectChecker(item) {
      this.selelctCheckerId = item.userId;
    },
    // 取消配送弹框
    cancelPicker() {
      this.pickerVisible = false;
    },
    // 取消生产员对话框
    cancelProducter() {
      this.producterVisible = false;
      this.deviceSearchKey = "";
    },
    // 取消检测员对话框
    cancelChecker() {
      this.checkerVisible = false;
    },
    // 确认配送弹框
    confirmPicker() {
      // this.pickerVisible = false

      if (this.selectOrderList.length == 0) {
        return this.$message({
          type: "warning",
          message: "请先选择订单!",
        });
      }
      if (!this.selelctPickerId) {
        return this.$message({
          type: "warning",
          message: "请先选择配送员!",
        });
      }

      if (this.isSingle) {
        this.isSingle = false;
        if (this.selectOrderList[0].orderStatus == 2) {
          // 待取料
          this.mergeOrderApiSingle();
        } else if (this.selectOrderList[0].orderStatus == 10) {
          // 待配送
          this.sendOrderApiSingle();
        }
      } else {
        this.isSingle = false;
        if (this.selectOrderList[0].orderStatus == 2) {
          // 待取料
          this.mergeOrderApi();
        } else if (this.selectOrderList[0].orderStatus == 10) {
          // 待配送
          this.sendOrderApi();
        }
      }
    },
    // 确认配送弹框
    confirmProducter() {
      if (!this.selelctDeviceId) {
        return this.$message({
          type: "warning",
          message: "请先选择设备!",
        });
      }

      if (this.rosterDeviceType == 1) {
        this.rosterOrderApi();
      } else {
        this.rosterOrderApiAgain();
      }
    },
    // 确认配送弹框
    confirmChecker() {
      if (!this.selelctCheckerId) {
        return this.$message({
          type: "warning",
          message: "请先选择检测员!",
        });
      }

      this.confirmCheckerApi();
    },
    // 单个排班api
    rosterOrderApi() {
      let orderPkids = this.selectOrderList.map((item) => item.pkid);
      let params = {
        orderPkids: orderPkids,
        devicePkid: this.selelctDeviceId,
        workshopPkid: this.$store.state.user.userInfo.workshopId,
      };
      console.log("params", params, this.$store);
      orderAssignDevice(params).then((res) => {
        if (res.code == 200) {
          this.producterVisible = false;
          this.selelctDeviceId = "";
          this.selectOrderList = [];
          // this.handleQuery();
          this.getList();
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        } else {
          this.$message({
            type: "warning",
            message: res.msg,
          });
        }
      });
    },
    // 单个重新排班api
    rosterOrderApiAgain() {
      let orderPkids = this.selectOrderList.map((item) => item.pkid);
      let params = {
        orderPkids: orderPkids,
        devicePkid: this.selelctDeviceId,
        workshopPkid: this.$store.state.user.userInfo.workshopId,
      };
      console.log("params", params, this.$store);
      orderAssignDeviceAgain(params).then((res) => {
        if (res.code == 200) {
          this.producterVisible = false;
          this.selelctDeviceId = "";
          this.selectOrderList = [];
          // this.handleQuery();
          this.getList();
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        } else {
          this.$message({
            type: "warning",
            message: res.msg,
          });
        }
      });
    },

    // 单个排班api
    confirmCheckerApi() {
      let orderPkids = this.selectOrderList.map((item) => item.pkid);
      let params = {
        orderPkids,
        inspectionUserPkid: this.selelctCheckerId,
        workshopPkid: this.$store.state.user.userInfo.workshopId,
      };
      orderAssignChecker(params).then((res) => {
        if (res.code == 200) {
          this.checkerVisible = false;
          this.selelctCheckerId = "";
          this.selectOrderList = [];
          // this.handleQuery();
          this.getList();
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        } else if (res.code == 422) {
          this.checkerVisible = false;
          this.selelctCheckerId = "";
          this.selectOrderList = [];
          this.$message({
            type: "warning",
            message: `此订单${res.msg}已经分配检测员!`,
          });
        }
      });
    },

    // 确认接单
    confirmOrderApi(e) {
      let orderPkids = e.map((item) => item.pkid);
      let params = {
        orderPkids,
        workshopPkid: this.$store.state.user.userInfo.workshopId,
      };
      console.log("params", params, this.$store);
      confirmOrder(params).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          // this.$refs.lodopPrint.open(orderPkids)
          // this.handleQuery();
          this.getList();
        } else if (res.code == 422) {
          this.dialogTitle = "已确认订单";
          let orderList = res.msg.split(",");
          this.isPickList = orderList.map((res) => {
            return {
              id: res,
              statusText: "已确认",
            };
          });
          this.$refs.isPickDialogRef.open();
        }
      });
    },
    // 单个确认接单
    confirmOrderApiSingle(e) {
      let orderPkids = e.map((item) => item.pkid);
      let params = {
        orderPkids,
        workshopPkid: this.$store.state.user.userInfo.workshopId,
      };
      console.log("params", params, this.$store);
      confirmOrder(params).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          // this.$refs.lodopPrint.open(orderPkids)
          // this.$refs.orderPrintRefs.open(orderPkids);
          // this.handleQuery();
          this.getList();
        }
      });
    },
    // 单个确认订单按钮
    confirmOrderSingle(e) {
      this.$confirm(`是否确认此订单${e.orderNo}?`, "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.confirmOrderApiSingle([e]);
          // this.$refs.lodopPrint.open([e.pkid])
          //  this.$refs.orderPrintRefs.open(ids);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    // 批量确认订单按钮
    confirmOrders() {
      if (this.queryParams.orderStatus != 4) {
        return this.$message({
          type: "warning",
          message: "请先筛选出待确认订单!",
        });
      }
      if (this.selectOrderList.length == 0) {
        return this.$message({
          type: "warning",
          message: "请先选择订单!",
        });
      }

      this.$confirm(`是否确认订单?`, "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.confirmOrderApi(this.selectOrderList);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    // 排班弹框
    rosterOrder(e, type) {
      this.selectOrderList = e ? [e] : this.selectOrderList;
      this.rosterDeviceType = type;
      this.getRosterList();
    },

    /** 查询排班计划列表 */
    getRosterList() {
      // this.loading = true;
      let date = this.dataFormat(new Date());
      let params = {
        rosterDate: date,
      };
      listRoster(params).then((res) => {
        if (res.code == 200) {
          // this.rosterList = res.data;
          if (res.data.length > 0) {
            this.producterVisible = true;
            this.getListRosterDevice();
          } else {
            this.$message({
              type: "warning",
              message: "当天并无排班计划",
            });
          }
        }
      });
    },
    // 点击打印
    printOrder(e) {
      // this.$refs.orderPrintRef.open(e);
      this.printOrders(e);
    },
    // 批量打印
    printOrders(val) {
      console.log("this.selectOrderList", this.selectOrderList, val);
      let ids = null;
      if (val.pkid) {
        // 单个打印
        this.printDialogTitle = "订单打印";
        ids = [val.pkid];
        this.$refs.orderPrintRefs.open(ids);
        // this.$refs.lodopPrint.open(ids)
      } else {
        // 多个打印
        this.printDialogTitle = "批量打印";
        if (!this.selectOrderList.length) {
          return this.$message({
            type: "warning",
            message: "请先选择相应订单!",
          });
        }
        let ids = this.selectOrderList.map((item) => item.pkid);
        // this.$refs.lodopPrint.open(ids)
        this.$refs.orderPrintRefs.open(ids);
      }
    },
    // 分配检测员
    checkOrder(e) {
      this.selectOrderList = [e];
      this.checkerVisible = true;
      this.getCheckerList();
    },

    /** 获取检测员 */
    getCheckerList() {
      // this.loading = true;
      let params = {
        userKey: this.checkerSearchKey || "",
      };
      getCheckerListApi(params).then((res) => {
        if (res.code == 200) {
          this.checkerList = res.data;
        }
      });
    },
    // 已取货
    pickedGoods(e) {
      this.$confirm(`确认订单${e.orderNo}已取货?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.pickedGoodsApi(e);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    // 已取货-api
    pickedGoodsApi(e) {
      let params = {
        orderPkid: e.pkid,
        workshopPkid: this.$store.state.user.userInfo.workshopId,
      };
      orderPicked(params).then((res) => {
        if (res.code == 200) {
          // this.handleQuery();
          this.getList();
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        }
      });
    },
    /** 获取当天已排班设备*/
    getListRosterDevice() {
      // this.loading = true;
      let params = {
        queryKey: this.deviceSearchKey || "",
        workshopPkid: this.$store.state.user.userInfo.workshopId,
      };
      listRosterDevice(params).then((res) => {
        if (res.code == 200) {
          this.devicerList = res.data;
          this.selelctDeviceId = this.devicerList[0]
            ? this.devicerList[0].devicePkid
            : "";
        }
      });
    },
    // 版式预览
    bsHandlePreview(file) {
      console.log(file);
    },
    // 版式预览
    bsHandleExceed(files, fileList) {
      console.log("===========");
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    selectLocalRow(row,type) {
      this.localRow = row;
      this.uploadType = type
    },
    bsHandleChange(file, fileList) {
      //上传文件变化时
      console.log("bsHandleChange", file, fileList);
      this.loading = true;
      this.uploadStyleFile(file);
    },
    // 上传文件-版式
    uploadStyleFile(file) {
      let formData = new FormData();
      formData.append("file", file.raw);
      uploadFile(formData).then((res) => {
        if (res.code == 200) {
          this.editOrder(res.data.name);
        }
      });
    },
    delFile(row,type) {
      this.uploadType = type
      this.$confirm(`确认删除当前${this.uploadType == 1 ? '排版文件' : '版式文件'}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
            this.localRow = row;
            this.editOrder('')
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    // 编辑订单
    editOrder(res) {
      let params;
      if(this.uploadType == 1) {
         params = {
          orderAnnexImageUrl: res,
          pkid: this.localRow.pkid,
        }
      } else {
         params = {
          orderStyleAnnexImageUrl: res,
          pkid: this.localRow.pkid,
        }
      }
      orderEdit(params).then((res) => {
        if (res.code == 200) {
          this.loading = false;
          this.getList();
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        }
      });
    },
    // 下载文件
    downFile(row,type) {
       this.uploadType = type
      this.downs(row);
    },
    // 下载图片
    downs(e) {
       console.log("downs", e);
      var alink = document.createElement("a");
       alink.href =  this.uploadType == 1 ? e.orderAnnexImageUrl : e.orderStyleAnnexImageUrl;
       alink.download = this.uploadType == 1 ? `代裁排版-${e.orderNo}` : `代裁版式-${e.orderNo}` ; //图片名
       // alink.download = '4444' ; //图片名
       alink.click();
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss">
.producting-content-main {
  height: 300px;
  padding: 20px;
  overflow: auto;
  // display: flex;
  // justify-content: center;
}
.producting-content-main-list {
}
.producting-content-main ul {
  padding-left: 0px;
}
.producting-content-main .el-card {
  color: #48aafd;
}
.no-data-product {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999999;
  margin-top: 100px;
}
.producting-content {
}
.producting-content-text {
  margin: 10px 0 10px 0;
}
.producting-content-step {
}
.producting-content-steps {
}

/* 解决 上传下载按钮 不能再一行显示 */
.inline-block {
  display: inline-block;
}
</style>
