<template>
  <div class="app-container">
    <div
      class="produce-content"
      v-loading="loading"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
    >
      <div class="produce-top">
        <el-collapse v-model="activeName1">
          <el-collapse-item name="1">
            <template slot="title">
              <div class="collapse-title-sty">
                <span class="collapse-title">查询</span>
                <span class="collapse-des">请输入查询日期进行检索</span>
                <span class="collapse-tips"
                  >※：请选择年月日进行查询，默认查询时间范围为：当月(例如：2020-09)</span
                >
              </div>
            </template>
            <!-- 查询筛选条件 -->
            <div class="produce-top-main">
              <div class="search">
                <div class="search-title">查询日期</div>
                <div class="search-date">
                  <el-date-picker
                    @change="selectDate"
                    :editable="false"
                    :clearable="false"
                    v-model="searchDate"
                    :type="searchDateType"
                    placeholder="选择日期"
                    :format="dateTextFormate(searchDateType)"
                    :value-format="dateValueFormate(searchDateType)"
                  ></el-date-picker>
                </div>
                <div class="search-key">
                  <el-select
                    v-model="searchDateType"
                    placeholder="请选择"
                    @change="selectKeyClick"
                  >
                    <el-option
                      v-for="item in searchKeyList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
                <div class="search-btn">
                  <el-button
                    icon="el-icon-search"
                    type="primary"
                    @click="search"
                    >查询</el-button
                  >
                </div>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="produce-mid">
        <el-collapse v-model="activeName2">
          <el-collapse-item name="1">
            <template slot="title">
              <div class="collapse-title-sty">
                <span class="collapse-title">统计</span>
                <span class="collapse-tips">※统计：工场订单、用户、实收</span>
              </div>
            </template>
            <!-- 统计 -->
            <div class="produce-mid-main">
              <div class="select-moudle">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="统计查询时间范围内；订单"
                  placement="bottom"
                >
                  <div
                    class="select-moudle-item"
                    :class="
                      selectMoudleItem == 1 ? 'select-moudle-item-active' : ''
                    "
                    @click="selectMoudle(1)"
                  >
                    <div class="item-left">
                      <div class="left-top">订单</div>
                      <div class="left-mid">
                        <div class="mid-title">新增订单:</div>
                        <div class="mid-value">{{ tabData.newOrderNum }}单</div>
                      </div>
                      <div class="left-bottom">
                        <div class="mid-title">订单总额:</div>
                        <div class="mid-value">
                          {{ tabData.newOrderAmount }}
                        </div>
                      </div>
                    </div>
                    <div class="item-right">
                      <i class="el-icon-shopping-cart-2 item-right-icon"></i>
                    </div>
                  </div>
                </el-tooltip>

                <el-tooltip
                  class="item"
                  effect="dark"
                  content="统计查询时间范围内；用户"
                  placement="bottom"
                >
                  <div
                    class="select-moudle-item"
                    :class="
                      selectMoudleItem == 2 ? 'select-moudle-item-active' : ''
                    "
                    @click="selectMoudle(2)"
                  >
                    <div class="item-left">
                      <div class="left-top">用户</div>
                      <div class="left-mid">
                        <div class="mid-title">活跃用户:</div>
                        <div class="mid-value">
                          {{ tabData.activeUserNum }}人
                        </div>
                      </div>
                      <div class="left-bottom">
                        <div class="mid-title">用户总数:</div>
                        <div class="mid-value">
                          {{ tabData.totalUserNum }}人
                        </div>
                      </div>
                    </div>
                    <div class="item-right">
                      <i class="el-icon-user-solid item-right-icon"></i>
                    </div>
                  </div>
                </el-tooltip>

                <el-tooltip
                  v-if="queryType == 1"
                  class="item"
                  effect="dark"
                  content="统计查询时间范围内；实收"
                  placement="bottom"
                >
                  <div
                    class="select-moudle-item"
                    :class="
                      selectMoudleItem == 3 ? 'select-moudle-item-active' : ''
                    "
                    @click="selectMoudle(3)"
                  >
                    <div class="item-left">
                      <div class="left-top">实收</div>
                      <div class="left-mid">
                        <div class="mid-title">支付订单:</div>
                        <div class="mid-value">
                          {{ tabData.incomeOrderNum }}单
                        </div>
                      </div>
                      <div class="left-bottom">
                        <div class="mid-title">支付金额:</div>
                        <div class="mid-value">
                          {{ tabData.incomeOrderAmount }}元
                        </div>
                      </div>
                    </div>
                    <div class="item-right">
                      <i class="el-icon-wallet item-right-icon"></i>
                    </div>
                  </div>
                </el-tooltip>

                <el-tooltip
                  class="item"
                  effect="dark"
                  content="统计查询时间范围内；产量"
                  placement="bottom"
                >
                  <div
                    class="select-moudle-item"
                    :class="
                      selectMoudleItem == 4 ? 'select-moudle-item-active' : ''
                    "
                    @click="selectMoudle(4)"
                  >
                    <div class="item-left">
                      <div class="left-top">产量</div>
                      <div class="left-mid">
                        <div class="mid-title">当前产量:</div>
                        <div class="mid-value">
                          {{ tabData.currentOutputNum }}件
                        </div>
                      </div>
                      <div class="left-bottom">
                        <div class="mid-title">总生产量:</div>
                        <div class="mid-value">
                          {{ tabData.totalOutputNum }}件
                        </div>
                      </div>
                    </div>
                    <div class="item-right">
                      <i class="el-icon-s-data item-right-icon"></i>
                    </div>
                  </div>
                </el-tooltip>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>

      <div class="select-item-btns">
        <el-button-group v-if="selectMoudleItem == 1">
          <!-- 订单 -->
          <el-button
            :type="selectMoudleBtnSty == 1 ? 'primary' : ''"
            @click="selectMoudleBtn(1)"
            >新增订单</el-button
          >
          <el-button
            :type="selectMoudleBtnSty == 2 ? 'primary' : ''"
            @click="selectMoudleBtn(2)"
            >生产完成</el-button
          >
          <el-button
            :type="selectMoudleBtnSty == 3 ? 'primary' : ''"
            @click="selectMoudleBtn(3)"
            >支付完成</el-button
          >
        </el-button-group>

        <el-button-group v-if="selectMoudleItem == 2">
          <!-- 用户 -->
          <el-button
            :type="selectMoudleBtnSty == 1 ? 'primary' : ''"
            @click="selectMoudleBtn(1)"
            >活跃用户</el-button
          >
        </el-button-group>

        <el-button-group v-if="selectMoudleItem == 3">
          <el-button
            :type="selectMoudleBtnSty == 1 ? 'primary' : ''"
            @click="selectMoudleBtn(1)"
            >微信支付</el-button
          >
          <el-button
            :type="selectMoudleBtnSty == 2 ? 'primary' : ''"
            @click="selectMoudleBtn(2)"
            >保证金支付</el-button
          >
        </el-button-group>

        <el-button-group v-if="selectMoudleItem == 4">
          <!-- 产量-->
          <el-button
            :type="selectMoudleBtnSty == 1 ? 'primary' : ''"
            @click="selectMoudleBtn(1)"
            >产量</el-button
          >
        </el-button-group>
      </div>

      <div class="produce-bottom">
        <el-collapse v-model="activeName3">
          <el-collapse-item name="1">
            <template slot="title">
              <div class="collapse-title-sty">
                <span class="collapse-title">{{
                  mainData.lineData.chartTitle
                }}</span>
              </div>
            </template>

            <!-- 统计 -->
            <div class="produce-bottom-main">
              <lineChart
                ref="lineChart"
                :chartTitle="mainData.lineData.chartTitle"
                :dataNum="mainData.lineData.dataNum"
                :dataX="mainData.lineData.dataX"
                :dataY="mainData.lineData.dataY"
                :type="selectMoudleItem"
              ></lineChart>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>

      <!-- 底部表格 -->
      <!-- v-show="[1,2,3].indexOf(selectMoudleItem) > 0" -->
      <div
        v-show="[1, 2, 3].indexOf(selectMoudleItem) > -1 && queryType == 1"
        class="produce-bottom-chart"
      >
        <div class="bottom-content-left">
          <div class="produce-bottom-content">
            <el-collapse v-model="activeName4">
              <el-collapse-item name="1">
                <template slot="title">
                  <div class="collapse-title-sty">
                    <span class="collapse-title">{{
                      mainData.pieData.chartTitle
                    }}</span>
                  </div>
                </template>

                <!-- 统计 -->
                <div class="produce-bottom-main">
                  <!-- 饼图切换 -->
                  <div class="produce-bottom-main-btns" v-if="selectMoudleItem == 1 || selectMoudleItem == 3">
                    <el-button-group>
                      <!-- 订单 -->
                      <el-button
                        :type="pieType == 1 ? 'primary' : ''"
                        @click="selectPieType(1)"
                        >款式</el-button
                      >
                      <el-button
                        :type="pieType == 2 ? 'primary' : ''"
                        @click="selectPieType(2)"
                        >材质</el-button
                      >
                    </el-button-group>
                  </div>

                  <pieChart
                    ref="pieChart"
                    :chartTitle="mainData.pieData.chartTitle"
                    :data="mainData.pieData.data"
                    :type="selectMoudleItem"
                  ></pieChart>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
        <div class="bottom-content-right">
          <div class="produce-bottom-content">
            <el-collapse v-model="activeName5">
              <el-collapse-item name="1">
                <template slot="title">
                  <div class="collapse-title-sty">
                    <span class="collapse-title"
                      >{{ mainData.rankData.chartTitle }} (Top:前五名)</span
                    >
                    <div class="collapse-title-right-icon" @click.stop="openPh">
                      <i class="el-icon-tickets"></i>
                    </div>
                  </div>
                </template>

                <!-- 排行榜 -->
                <div class="produce-bottom-main">
                  <phChart
                    ref="rankChart"
                    :chartTitle="mainData.rankData.chartTitle"
                    :data="mainData.rankData.data"
                  ></phChart>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>
    </div>

    <!-- 弹出框 -->
    <el-dialog
      :title="mainData.rankData.chartTitle + '(总榜)'"
      :visible.sync="dialogPhVisible"
    >
      <div class="dialogp-content">
        <div
          v-if="mainData.rankData && mainData.rankData.data.length > 0"
          class="dialogp-content-item"
          v-for="item in mainData.rankData.data"
        >
          <div class="dialogp-left">
            <div class="dialogp-left-left">
              <img :src="item.userAvatar" />
            </div>
            <div class="dialogp-left-right">
              <div class="dialogp-left-top">{{ item.userName || "暂无" }}</div>
              <div class="dialogp-left-bottom">
                <!-- <div class="bottom-icon"></div>
                          <div class="bottom-title">统计日期:</div>
                <div class="bottom-time">2020</div>-->
                <blockquote class="dialogp-left-bottom-message">
                  统计日期:
                  <span v-if="item.orderDayDate">{{ item.orderDayDate }}</span>
                  <span v-if="item.orderMonthDate">{{
                    item.orderMonthDate
                  }}</span>
                  <span v-if="item.orderYearDate">{{
                    item.orderYearDate
                  }}</span>
                </blockquote>
              </div>
            </div>
          </div>
          <div class="dialogp-right">{{ item.orderNum || 0 }}单</div>
        </div>
        <div
          v-if="mainData.rankData && mainData.rankData.data.length == 0"
          class="dialogp-no-data"
        >
          暂无数据
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPhVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogPhVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import lineChart from "./chartCommponent/line-chart";
import pieChart from "./chartCommponent/pie-chart";
import phChart from "./chartCommponent/ph-chart";

import produceApi from "@/api/platform/center/produceProxy";

import timeFormat from "./unit/timeFormat";

export default {
  name: "dispatch",
  components: { lineChart, pieChart, phChart },
  data() {
    return {
      loading: false,
      userInfo: this.$store.state.user.userInfo,
      dialogPhVisible: false,
      activeName1: "1",
      activeName2: "1",
      activeName3: "1",
      activeName4: "1",
      activeName5: "1",
      searchDate: "",
      searchKeyList: [
        {
          value: "date",
          label: "日份",
        },
        {
          value: "month",
          label: "月份",
        },
        {
          value: "year",
          label: "年份",
        },
      ],
      searchKey: "month",
      searchDateType: "month",
      selectMoudleItem: 1,
      selectMoudleBtnSty: 1,
      tabData: {}, // tab数据
      mainData: {
        // 主数据
        lineData: {
          // 折线图数据
          chartTitle: "", // 折线图标题
          dataNum: "", // 折线图数量总数
          dataX: [], // 折线图X轴
          dataY: [], // 折线图Y轴
        },
        pieData: {
          chartTitle: "", // 饼图标题
          data: [],
        },
        rankData: {
          chartTitle: "", // 排行榜标题
          data: [],
        },
      },
      queryType: 1, // 查询类型，1 新版订单，2 旧版订单，
      queryTypeDate: {
        // 查询类型截止日期
        date: "2021-03-10",
        month: "2021-03",
        year: "2021",
      },
      pieType:1, //1 款式1 材质2
    };
  },
  watch: {},
  created() {
    this.init();
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化
    init() {
      this.searchDate = this.dataFormat();
      this.search();
    },
    //查询
    search() {
      console.log("search", this.searchDate, this.searchDateType, produceApi);
      this.queryType = this.dateHandleNewOld(this.searchDate);
      console.log("this.queryType", this.queryType);
      this.getTabData();
      this.setTitle();
      if (this.selectMoudleItem == 1) {
        this.getTabOrderData();
      } else if (this.selectMoudleItem == 2) {
        this.getTabUserData();
      } else if (this.selectMoudleItem == 3) {
        this.getTabIncomeData();
      } else if (this.selectMoudleItem == 4) {
        this.getTabProduceData();
      }
    },
    // 标题控制
    setTitle() {
      if (this.selectMoudleItem == 1) {
        if (this.selectMoudleBtnSty == 1) {
          this.mainData.lineData.chartTitle = "新增订单";
          this.mainData.pieData.chartTitle = "订单分类";
          this.mainData.rankData.chartTitle = "订单排行榜";
        } else if (this.selectMoudleBtnSty == 2) {
          this.mainData.lineData.chartTitle = "生产完成";
        } else if (this.selectMoudleBtnSty == 3) {
          this.mainData.lineData.chartTitle = "支付完成";
        }
      } else if (this.selectMoudleItem == 2) {
        this.mainData.lineData.chartTitle = "活跃用户";
        this.mainData.pieData.chartTitle = "用户活跃度";
        this.mainData.rankData.chartTitle = "用户活跃度排行榜";
      } else if (this.selectMoudleItem == 3) {
        if (this.selectMoudleBtnSty == 1) {
          this.mainData.lineData.chartTitle = "微信支付";
          this.mainData.pieData.chartTitle = "商品支付分类";
          this.mainData.rankData.chartTitle = "用户支付排行榜";
        } else if (this.selectMoudleBtnSty == 2) {
          this.mainData.lineData.chartTitle = "保证金支付";
          this.mainData.pieData.chartTitle = "商品支付分类";
          this.mainData.rankData.chartTitle = "用户支付排行榜";
        }
      } else if (this.selectMoudleItem == 4) {
        this.mainData.lineData.chartTitle = "产量";
      }
    },

    // 日期比较处理
    dateHandleNewOld(newValue) {
      let oldTime = null;
      if (this.searchDateType == "date") {
        oldTime = new Date(this.queryTypeDate.date);
      } else if (this.searchDateType == "month") {
        oldTime = new Date(this.queryTypeDate.month);
      } else if (this.searchDateType == "year") {
        oldTime = new Date(this.queryTypeDate.year);
      }
      let newTime = new Date(newValue);
      console.log("dateHandleNewOld", newTime, oldTime);
      if (newTime.getTime() >= oldTime.getTime()) {
        // this.queryType = 1
        return 1;
      } else {
        // this.queryType = 2
        return 2;
      }
    },
    // 选择时间
    selectDate() {
      console.log("searchDate", this.searchDate);
      this.queryType = this.dateHandleNewOld(this.searchDate);
      console.log("this.queryType", this.queryType);
    },

    /* 数据对接-start */

    // 获取tab数据
    getTabData() {
      console.log("timeFormat", this.searchDate, this.searchDateType);
      this.loading = true;
      let params = {
        queryDate: timeFormat.timeSearchFormat(
          this.searchDate,
          this.searchDateType
        ),
        queryDateType:
          this.searchDateType == "date" ? "day" : this.searchDateType,
        workshopPkid: this.userInfo.workshopId,
        queryType: this.queryType,
      };
      console.log("params", params);
      produceApi.getObtainTabList(params).then((res) => {
        if (res.code == 200) {
          this.tabData = res.data;
          this.loading = false;
        }
      });
    },

    // 获取订单-数据
    getTabOrderData() {
      let params = {
        queryDate: timeFormat.timeSearchFormat(
          this.searchDate,
          this.searchDateType
        ),
        queryDateType:
          this.searchDateType == "date" ? "day" : this.searchDateType,
        workshopPkid: this.userInfo.workshopId,
        queryType: this.queryType,
      };
      console.log("params", params);
      produceApi.getObtainOrderTabList(params).then((res) => {
        if (res.code == 200) {
          /* 折线图 */
          if (this.selectMoudleBtnSty == 1) {
            this.mainData.lineData.dataNum = `${res.data.orderTabTotalOrderNum} 单`;
            this.mainData.lineData.dataY = res.data.orderTabLineChartInfo;
            this.mainData.lineData.dataX = timeFormat.chartXHandle(
              this.searchDate,
              this.searchDateType,
              res.data.orderTabLineChartInfo
            );
          } else if (this.selectMoudleBtnSty == 2) {
            this.mainData.lineData.dataNum = `${res.data.orderTabProductionTotalOrderNum} 单`;
            this.mainData.lineData.dataY =
              res.data.orderTabProductionLineChartInfo;
            this.mainData.lineData.dataX = timeFormat.chartXHandle(
              this.searchDate,
              this.searchDateType,
              res.data.orderTabProductionLineChartInfo
            );
          } else if (this.selectMoudleBtnSty == 3) {
            this.mainData.lineData.dataNum = `${res.data.orderTabPayTotalOrderNum} 单`;
            this.mainData.lineData.dataY = res.data.orderTabPayLineChartInfo;
            this.mainData.lineData.dataX = timeFormat.chartXHandle(
              this.searchDate,
              this.searchDateType,
              res.data.orderTabPayLineChartInfo
            );
          }
          if (this.queryType == 1) {
            /* 饼图 */
            if(this.pieType == 1) { // 款式
              this.mainData.pieData.data = res.data.orderStyleTabPieChartInfo;
            } else if(this.pieType == 2) { // 材质
              this.mainData.pieData.data = res.data.orderMaterialTabPieChartInfo;
            }
            /* 排行榜 */
            this.mainData.rankData.data = res.data.orderTabRankUserInfo;
          }
          this.$nextTick(() => {
            this.$refs.lineChart.initChart();
            this.$refs.pieChart.initChart();
          });
          console.log(
            "====================主数据============================",
            this.mainData
          );
        } else {
          this.$message(res.msg);
        }
      });
    },

    // 获取用户-数据
    getTabUserData() {
      let params = {
        queryDate: timeFormat.timeSearchFormat(
          this.searchDate,
          this.searchDateType
        ),
        queryDateType:
          this.searchDateType == "date" ? "day" : this.searchDateType,
        workshopPkid: this.userInfo.workshopId,
        queryType: this.queryType,
      };
      console.log("params", params);
      produceApi.getObtainUserTabList(params).then((res) => {
        if (res.code == 200) {
          if (this.selectMoudleBtnSty == 1) {
            /* 折线图 */
            this.mainData.lineData.dataNum = `${res.data.userTabTotalUserNum}`;
            this.mainData.lineData.dataY = res.data.userTabLineChartInfo;
            this.mainData.lineData.dataX = timeFormat.chartXHandle(
              this.searchDate,
              this.searchDateType,
              res.data.userTabLineChartInfo
            );
            if (this.queryType == 1) {
              /* 饼图 */
              this.mainData.pieData.data = res.data.userTabPieChartInfo;
              /* 排行榜 */
              this.mainData.rankData.data = res.data.userTabRankUserInfo;
            }
          }
          this.$nextTick(() => {
            this.$refs.lineChart.initChart();
            this.$refs.pieChart.initChart();
          });
          console.log(
            "====================主数据============================",
            this.mainData
          );
        } else {
          this.$message(res.msg);
        }
      });
    },

    // 获取产能-数据
    getTabProduceData() {
      let params = {
        queryDate: timeFormat.timeSearchFormat(
          this.searchDate,
          this.searchDateType
        ),
        queryDateType:
          this.searchDateType == "date" ? "day" : this.searchDateType,
        workshopPkid: this.userInfo.workshopId,
        queryType: this.queryType,
      };
      console.log("params", params);
      produceApi.getObtainProduceTabList(params).then((res) => {
        if (res.code == 200) {
          /* 折线图 */
          if (this.selectMoudleBtnSty == 1) {
            this.mainData.lineData.dataNum = `${res.data.productionTabTotalCapacityNum}件 `;
            this.mainData.lineData.dataY = res.data.productionTabLineChartInfo;
            this.mainData.lineData.dataX = timeFormat.chartXHandle(
              this.searchDate,
              this.searchDateType,
              res.data.productionTabLineChartInfo
            );
          }

          this.$nextTick(() => {
            this.$refs.lineChart.initChart();
          });
          console.log(
            "====================主数据============================",
            this.mainData
          );
        } else {
          this.$message(res.msg);
        }
      });
    },

    // 获取收入-数据
    getTabIncomeData() {
      let params = {
        queryDate: timeFormat.timeSearchFormat(
          this.searchDate,
          this.searchDateType
        ),
        queryDateType:
          this.searchDateType == "date" ? "day" : this.searchDateType,
        workshopPkid: this.userInfo.workshopId,
        queryType: this.queryType,
      };
      console.log("params", params);
      produceApi.getObtainIncomeTabList(params).then((res) => {
        if (res.code == 200) {
          if (this.selectMoudleBtnSty == 1) {
            /* 折线图 */
            this.mainData.lineData.dataNum = `${res.data.incomeTabWxappPayAmount}`;
            this.mainData.lineData.dataY = res.data.incomeTabWxappLineChartInfo;
            this.mainData.lineData.dataX = timeFormat.chartXHandle(
              this.searchDate,
              this.searchDateType,
              res.data.incomeTabWxappLineChartInfo
            );
            if (this.queryType == 1) {
              /* 饼图 */
              if(this.pieType == 1) { // 款式
              this.mainData.pieData.data = res.data.incomeTabWxappStylePieChartInfo;
            } else if(this.pieType == 2) { // 材质
              this.mainData.pieData.data = res.data.incomeTabWxappMaterialPieChartInfo;
            }
              /* 排行榜 */
              this.mainData.rankData.data = res.data.incomeTabWxappRankUserInfo;
            }
          } else if (this.selectMoudleBtnSty == 2) {
            this.mainData.lineData.dataNum = `${res.data.incomeTabMarginPayAmount} `;
            this.mainData.lineData.dataY =
              res.data.incomeTabMarginLineChartInfo;
            this.mainData.lineData.dataX = timeFormat.chartXHandle(
              this.searchDate,
              this.searchDateType,
              res.data.incomeTabMarginLineChartInfo
            );
            if (this.queryType == 1) {
              /* 饼图 */
              if(this.pieType == 1) { // 款式
              this.mainData.pieData.data = res.data.incomeTabMarginStylePieChartInfo;
            } else if(this.pieType == 2) { // 材质
              this.mainData.pieData.data = res.data.incomeTabMarginMaterialPieChartInfo;
            }
              /* 排行榜 */
              this.mainData.rankData.data =
                res.data.incomeTabMarginRankUserInfo;
            }
          }

          this.$nextTick(() => {
            this.$refs.lineChart.initChart();
            this.$refs.pieChart.initChart();
          });
          console.log(
            "====================主数据============================",
            this.mainData
          );
        } else {
          this.$message(res.msg);
        }
      });
    },

    /* 数据对接-end */

    dataFormat(d) {
      console.log("d", d);
      d = d || new Date();
      if (this.searchDateType == "date") {
        return (
          d.getFullYear() +
          "-" +
          this.p(d.getMonth() + 1) +
          "-" +
          this.p(d.getDate())
        );
      } else if (this.searchDateType == "month") {
        return d.getFullYear() + "-" + this.p(d.getMonth() + 1);
      } else if (this.searchDateType == "year") {
        return String(d.getFullYear());
      }
    },
    //创建补0函数
    p(s) {
      return s < 10 ? "0" + s : s;
    },

    // 选择年月份下拉框
    selectKeyClick(e) {
      console.log(e);
      this.searchDateType = e;
      this.searchDate = "";
      this.searchDate = this.dataFormat();
    },
    // 日历text显示格式化
    dateTextFormate(e) {
      if (e == "date") {
        return "yyyy 年 MM 月 dd 日";
      } else if (e == "month") {
        return "yyyy 年 MM 月";
      } else if (e == "year") {
        return "yyyy 年";
      }
    },
    // 日历value显示格式化
    dateValueFormate(e) {
      if (e == "date") {
        return "yyyy-MM-dd";
      } else if (e == "month") {
        return "yyyy-MM";
      } else if (e == "year") {
        return "yyyy";
      }
    },
    //选择统计模块
    selectMoudle(e) {
      this.selectMoudleItem = e;
      this.selectMoudleBtnSty = 1;
      if (e == 1) {
        // 订单
        this.mainData.lineData.chartTitle = "新增订单";
        this.mainData.pieData.chartTitle = "订单分类";
        this.mainData.rankData.chartTitle = "订单排行榜";
        this.getTabOrderData();
      } else if (e == 2) {
        // 用户
        this.mainData.lineData.chartTitle = "活跃用户";
        this.mainData.pieData.chartTitle = "用户活跃度";
        this.mainData.rankData.chartTitle = "用户活跃度排行榜";
        this.getTabUserData();
      } else if (e == 3) {
        // 收入
        this.mainData.lineData.chartTitle = "微信支付";
        this.mainData.pieData.chartTitle = "商品支付分类";
        this.mainData.rankData.chartTitle = "用户支付排行榜";
        this.getTabIncomeData();
      } else if (e == 4) {
        // 产量
        this.mainData.lineData.chartTitle = "产量";
        this.getTabProduceData();
      }
    },
    // 切换饼图
    selectPieType(e) {
      this.pieType = e
      this.search()
    },
    // 切换图表按钮
    selectMoudleBtn(e) {
      this.selectMoudleBtnSty = e;
      if (this.selectMoudleItem == 1) {
        if (this.selectMoudleBtnSty == 1) {
          this.mainData.lineData.chartTitle = "新增订单";
          this.mainData.pieData.chartTitle = "订单分类";
          this.mainData.rankData.chartTitle = "订单排行榜";
          this.getTabOrderData();
        } else if (this.selectMoudleBtnSty == 2) {
          this.mainData.lineData.chartTitle = "生产完成";
          this.mainData.pieData.chartTitle = "订单分类";
          this.mainData.rankData.chartTitle = "订单排行榜";
          this.getTabOrderData();
        } else if (this.selectMoudleBtnSty == 3) {
          this.mainData.lineData.chartTitle = "支付完成";
          this.mainData.pieData.chartTitle = "订单分类";
          this.mainData.rankData.chartTitle = "订单排行榜";
          this.getTabOrderData();
        }
      } else if (this.selectMoudleItem == 2) {
        this.mainData.lineData.chartTitle = "活跃用户";
        this.mainData.pieData.chartTitle = "用户活跃度";
        this.mainData.rankData.chartTitle = "用户活跃度排行榜";
        this.getTabUserData();
      } else if (this.selectMoudleItem == 3) {
        if (this.selectMoudleBtnSty == 1) {
          this.mainData.lineData.chartTitle = "微信支付";
          this.mainData.pieData.chartTitle = "商品支付分类";
          this.mainData.rankData.chartTitle = "用户支付排行榜";
          this.getTabIncomeData();
        } else if (this.selectMoudleBtnSty == 2) {
          this.mainData.lineData.chartTitle = "保证金支付";
          this.mainData.pieData.chartTitle = "商品支付分类";
          this.mainData.rankData.chartTitle = "用户支付排行榜";
          this.getTabIncomeData();
        }
      } else if (this.selectMoudleItem == 4) {
        this.mainData.lineData.chartTitle = "产量";
        this.getTabProduceData();
      }
    },
    // 打开排行榜
    openPh() {
      this.dialogPhVisible = true;
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
.app-container {
  // background-color: #f9f9f9;
  // background-color: #ffffff;

  .produce-content {
    // padding: 20px;
    // background-color: #ffffff;
    padding-bottom: 300px;
    .el-collapse {
      border: none;
    }
    .el-collapse-item__wrap {
      border: none;
    }
    .el-collapse-item__content {
      padding: 0;
    }
    .produce-top {
      padding: 10px 20px 10px 20px;
      background-color: #ffffff;
      .collapse-title-sty {
        width: 100%;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e6e9ed;
        .collapse-title {
          font-size: 18px;
          font-weight: 400;
          color: #73879c;
        }
        .collapse-des {
          margin-left: 10px;
          font-size: 80%;
          font-weight: 400;
          color: #73879c;
        }
        .collapse-tips {
          margin-left: 10px;
          font-size: 80%;
          font-weight: 400;
          color: #ff0000;
        }
      }
      .produce-top-main {
        margin-top: 25px;
        margin-bottom: 10px;
        .search {
          display: flex;
          align-items: center;

          .search-title {
            font-size: 13px;
            color: #73879c;
          }
          .search-date {
            margin-left: 10px;
          }
          .search-key {
            width: 80px;
          }
          .search-btn {
            margin-left: 10px;
          }
        }
      }
    }

    .produce-mid {
      margin-top: 20px;
      padding: 10px 20px 10px 20px;
      background-color: #ffffff;
      .collapse-title-sty {
        width: 100%;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e6e9ed;
        .collapse-title {
          font-size: 18px;
          font-weight: 400;
          color: #73879c;
        }
        .collapse-des {
          margin-left: 10px;
          font-size: 80%;
          font-weight: 400;
          color: #73879c;
        }
        .collapse-tips {
          margin-left: 10px;
          font-size: 80%;
          font-weight: 400;
          color: #ff0000;
        }
      }
      .produce-mid-main {
        margin-top: 25px;
        margin-bottom: 10px;
        .select-moudle {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .select-moudle-item:hover {
            cursor: pointer;
            color: #ffffff;
            background-color: #007bff;
            // transform:  scale(1.05);
          }
          .select-moudle-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            // padding: 10px;
            padding: 15px 40px 15px 20px;
            color: #73879c;
            background-color: aliceblue;
            font-size: 18px;
            border: 1px solid #007bff;
            border-radius: 5px;
            flex: 1;
            //width: 20%;
            margin-right: 20px;
            transition: all 0.4s;
            -moz-transition: all 0.4s;
            -webkit-transition: all 0.4s;
            -o-transition: all 0.4s;
            // background-clip: padding-box;
            .item-left {
              .left-top {
                font-size: 26px;
              }
              .left-mid {
                display: flex;

                .mid-title {
                }
                .mid-value {
                  margin-left: 10px;
                }
              }
              .left-bottom {
                display: flex;
                .mid-title {
                }
                .mid-value {
                  margin-left: 10px;
                }
              }
            }
            .item-right {
              .item-right-icon {
                font-size: 60px;
              }
            }
          }
          .select-moudle-item-active {
            color: #ffffff;
            background-color: #007bff;
          }
        }
      }
    }
    .select-item-btns {
      margin-top: 10px;
      padding: 10px 20px 10px 20px;
      //background-color: #ffffff;
    }
    .produce-bottom {
      margin-top: 20px;
      padding: 10px 20px 10px 20px;
      background-color: #ffffff;
      .collapse-title-sty {
        width: 100%;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e6e9ed;
        .collapse-title {
          font-size: 18px;
          font-weight: 400;
          color: #73879c;
        }
        .collapse-des {
          margin-left: 10px;
          font-size: 80%;
          font-weight: 400;
          color: #73879c;
        }
        .collapse-tips {
          margin-left: 10px;
          font-size: 80%;
          font-weight: 400;
          color: #ff0000;
        }
      }
      .produce-bottom-main {
        margin-top: 25px;
        margin-bottom: 10px;
      }
    }
    .produce-bottom-chart {
      display: flex;
      justify-content: space-between;
      width: 100%;
      .bottom-content-left {
        width: 49%;

        .produce-bottom-content {
          margin-top: 20px;
          padding: 10px 20px 10px 20px;
          background-color: #ffffff;

          .collapse-title-sty {
            width: 100%;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #e6e9ed;
            .collapse-title {
              font-size: 18px;
              font-weight: 400;
              color: #73879c;
            }
            .collapse-des {
              margin-left: 10px;
              font-size: 80%;
              font-weight: 400;
              color: #73879c;
            }
            .collapse-tips {
              margin-left: 10px;
              font-size: 80%;
              font-weight: 400;
              color: #ff0000;
            }
          }
          .produce-bottom-main {
            margin-top: 25px;
            margin-bottom: 10px;
          }
          .produce-bottom-main-btns {
            margin-top: 25px;
            margin-bottom: 20px;
          }
        }
      }
      .bottom-content-right {
        width: 49%;
        .produce-bottom-content {
          margin-top: 20px;
          padding: 10px 20px 10px 20px;
          background-color: #ffffff;

          .collapse-title-sty {
            width: 100%;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #e6e9ed;
            display: flex;
            justify-content: space-between;
            .collapse-title {
              font-size: 18px;
              font-weight: 400;
              color: #73879c;
            }
            .collapse-des {
              margin-left: 10px;
              font-size: 80%;
              font-weight: 400;
              color: #73879c;
            }
            .collapse-tips {
              margin-left: 10px;
              font-size: 80%;
              font-weight: 400;
              color: #ff0000;
            }
            .collapse-title-right-icon {
              font-size: 18px;
              margin-right: 30px;
            }
          }
          .produce-bottom-main {
            margin-top: 25px;
            margin-bottom: 10px;
          }
        }
      }
    }
    // .produce-bottom-content{
    //   // margin-top: 20px;
    //   display: flex;
    //   justify-content: space-between;

    //   .collapse-title-sty {
    //     width: 100%;
    //     display: flex;
    //     align-items: center;
    //     justify-content: space-between;
    //     margin-left: 20px;
    //     margin-right: 20px;
    //     border-bottom: 1px solid #e6e9ed;
    //     padding-top: 20px;

    //     .collapse-title {
    //       font-size: 18px;
    //       font-weight: 400;
    //       color: #73879c;
    //     }
    //     .collapse-title-right-icon{
    //         font-size: 18px;
    //     }
    //     .collapse-des {
    //       margin-left: 10px;
    //       font-size: 80%;
    //       font-weight: 400;
    //       color: #73879c;
    //     }
    //     .collapse-tips {
    //       margin-left: 10px;
    //       font-size: 80%;
    //       font-weight: 400;
    //       color: #ff0000;
    //     }
    //   }

    //   .bottom-content-left{
    //     width: 49%;
    //      margin-top: 20px;
    //   .produce-bottom-main {
    //       margin-top: 25px;
    //       margin-bottom: 10px;
    //     }
    //   }
    //   .bottom-content-right{
    //       width: 49%;
    //         margin-top: 20px;
    //      // padding: 10px 20px 10px 20px;
    //     // background-color: #ffffff;
    //      .produce-bottom-main {
    //          margin-top: 25px;
    //          margin-bottom: 10px;
    //      }
    //   }

    // }
  }
}
.dialogp-content {
  height: 30vh;
  overflow: auto;
  .dialogp-content-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e6e6e6;
    padding: 15px 30px 15px 5px;
    // background-color: #fdf8f9;
    // margin-top: 2px;
    .dialogp-left {
      display: flex;
      align-items: center;
      .dialogp-left-left {
        display: flex;
        align-items: center;
        img {
          width: 50px;
          height: 50px;
          border-radius: 3px;
        }
      }
      .dialogp-left-right {
        margin-left: 10px;

        .dialogp-left-top {
          font-size: 16px;
          color: #73879c;
          font-weight: 600;
        }
        .dialogp-left-bottom {
          display: flex;
          margin-top: 5px;
          .bottom-icon {
            width: 5px;
          }
          .dialogp-bottom-title {
            margin-left: 10px;
            font-size: 13px;
            color: #73879c;
          }
          .dialogp-bottom-time {
            margin-left: 10px;
            font-size: 13px;
            color: #73879c;
          }
          .dialogp-left-bottom-message {
            padding: 0px 10px;
            margin: 0;
            border-left: 5px solid #eee;
            font-size: 13px;
            color: #73879c;
          }
        }
      }
    }
    .dialogp-right {
      font-size: 28px;
      color: #dc3545;
    }
  }
}
.dialogp-no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: 400;
  color: #73879c;
  margin-top: 20px;
}

/* 媒体查询-自适应-start */

@media screen and (max-width: 1500px) {
  .app-container {
    .produce-content {
      padding-bottom: 300px;
      .el-collapse {
        border: none;
      }
      .el-collapse-item__wrap {
        border: none;
      }
      .el-collapse-item__content {
        padding: 0;
      }
      .produce-top {
        padding: 10px 20px 10px 20px;
        background-color: #ffffff;
        .collapse-title-sty {
          width: 100%;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #e6e9ed;
          .collapse-title {
            font-size: 18px;
            font-weight: 400;
            color: #73879c;
          }
          .collapse-des {
            margin-left: 10px;
            font-size: 80%;
            font-weight: 400;
            color: #73879c;
          }
          .collapse-tips {
            margin-left: 10px;
            font-size: 80%;
            font-weight: 400;
            color: #ff0000;
          }
        }
        .produce-top-main {
          margin-top: 25px;
          margin-bottom: 10px;
          .search {
            display: flex;
            align-items: center;

            .search-title {
              font-size: 13px;
              color: #73879c;
            }
            .search-date {
              margin-left: 10px;
            }
            .search-key {
              width: 80px;
            }
            .search-btn {
              margin-left: 10px;
            }
          }
        }
      }

      .produce-mid {
        margin-top: 20px;
        padding: 10px 20px 10px 20px;
        background-color: #ffffff;
        .collapse-title-sty {
          width: 100%;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #e6e9ed;
          .collapse-title {
            font-size: 18px;
            font-weight: 400;
            color: #73879c;
          }
          .collapse-des {
            margin-left: 10px;
            font-size: 80%;
            font-weight: 400;
            color: #73879c;
          }
          .collapse-tips {
            margin-left: 10px;
            font-size: 80%;
            font-weight: 400;
            color: #ff0000;
          }
        }
        .produce-mid-main {
          margin-top: 25px;
          margin-bottom: 10px;
          .select-moudle {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .select-moudle-item:hover {
              cursor: pointer;
              color: #ffffff;
              background-color: #007bff;
            }
            .select-moudle-item {
              display: flex;
              align-items: center;
              justify-content: space-between;
              // padding: 10px;
              padding: 15px 40px 15px 20px;
              color: #73879c;
              background-color: aliceblue;
              font-size: 18px;
              border: 1px solid #007bff;
              border-radius: 5px;
              flex: 1;
              //width: 20%;
              margin-right: 10px;
              transition: all 0.4s;
              -moz-transition: all 0.4s;
              -webkit-transition: all 0.4s;
              -o-transition: all 0.4s;
              // background-clip: padding-box;
              .item-left {
                .left-top {
                  font-size: 18px;
                }
                .left-mid {
                  display: flex;

                  .mid-title {
                  }
                  .mid-value {
                    margin-left: 10px;
                  }
                }
                .left-bottom {
                  display: flex;
                  .mid-title {
                  }
                  .mid-value {
                    margin-left: 10px;
                  }
                }
              }
              .item-right {
                .item-right-icon {
                  font-size: 40px;
                }
              }
            }
            .select-moudle-item-active {
              color: #ffffff;
              background-color: #007bff;
            }
          }
        }
      }
      .select-item-btns {
        margin-top: 10px;
        padding: 10px 20px 10px 20px;
        //background-color: #ffffff;
      }
      .produce-bottom {
        margin-top: 20px;
        padding: 10px 20px 10px 20px;
        background-color: #ffffff;
        .collapse-title-sty {
          width: 100%;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #e6e9ed;
          .collapse-title {
            font-size: 18px;
            font-weight: 400;
            color: #73879c;
          }
          .collapse-des {
            margin-left: 10px;
            font-size: 80%;
            font-weight: 400;
            color: #73879c;
          }
          .collapse-tips {
            margin-left: 10px;
            font-size: 80%;
            font-weight: 400;
            color: #ff0000;
          }
        }
        .produce-bottom-main {
          margin-top: 25px;
          margin-bottom: 10px;
        }
      }
      .produce-bottom-chart {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .bottom-content-left {
          width: 100%;

          .produce-bottom-content {
            margin-top: 20px;
            padding: 10px 20px 10px 20px;
            background-color: #ffffff;

            .collapse-title-sty {
              width: 100%;
              display: flex;
              align-items: center;
              border-bottom: 1px solid #e6e9ed;
              .collapse-title {
                font-size: 18px;
                font-weight: 400;
                color: #73879c;
              }
              .collapse-des {
                margin-left: 10px;
                font-size: 80%;
                font-weight: 400;
                color: #73879c;
              }
              .collapse-tips {
                margin-left: 10px;
                font-size: 80%;
                font-weight: 400;
                color: #ff0000;
              }
            }
            .produce-bottom-main {
              margin-top: 25px;
              margin-bottom: 10px;
            }
          }
        }
        .bottom-content-right {
          width: 100%;
          .produce-bottom-content {
            margin-top: 20px;
            padding: 10px 20px 10px 20px;
            background-color: #ffffff;

            .collapse-title-sty {
              width: 100%;
              display: flex;
              align-items: center;
              border-bottom: 1px solid #e6e9ed;
              display: flex;
              justify-content: space-between;
              .collapse-title {
                font-size: 18px;
                font-weight: 400;
                color: #73879c;
              }
              .collapse-des {
                margin-left: 10px;
                font-size: 80%;
                font-weight: 400;
                color: #73879c;
              }
              .collapse-tips {
                margin-left: 10px;
                font-size: 80%;
                font-weight: 400;
                color: #ff0000;
              }
              .collapse-title-right-icon {
                font-size: 18px;
                margin-right: 30px;
              }
            }
            .produce-bottom-main {
              margin-top: 25px;
              margin-bottom: 10px;
            }
          }
        }
      }
    }
  }
  .dialogp-content {
    height: 30vh;
    overflow: auto;
    .dialogp-content-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e6e6e6;
      padding: 15px 30px 15px 5px;
      .dialogp-left {
        display: flex;
        align-items: center;
        .dialogp-left-left {
          display: flex;
          align-items: center;
          img {
            width: 50px;
            height: 50px;
            border-radius: 3px;
          }
        }
        .dialogp-left-right {
          margin-left: 10px;

          .dialogp-left-top {
            font-size: 16px;
            color: #73879c;
            font-weight: 600;
          }
          .dialogp-left-bottom {
            display: flex;
            margin-top: 5px;
            .bottom-icon {
              width: 5px;
            }
            .dialogp-bottom-title {
              margin-left: 10px;
              font-size: 13px;
              color: #73879c;
            }
            .dialogp-bottom-time {
              margin-left: 10px;
              font-size: 13px;
              color: #73879c;
            }
            .dialogp-left-bottom-message {
              padding: 0px 10px;
              margin: 0;
              border-left: 5px solid #eee;
              font-size: 13px;
              color: #73879c;
            }
          }
        }
      }
      .dialogp-right {
        font-size: 28px;
        color: #dc3545;
      }
    }
  }
  .dialogp-no-data {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    font-weight: 400;
    color: #73879c;
    margin-top: 20px;
  }
}

@media screen and (max-width: 14px) {
  .app-container {
    .produce-content {
      padding-bottom: 300px;
      .el-collapse {
        border: none;
      }
      .el-collapse-item__wrap {
        border: none;
      }
      .el-collapse-item__content {
        padding: 0;
      }
      .produce-top {
        padding: 10px 20px 10px 20px;
        background-color: #ffffff;
        .collapse-title-sty {
          width: 100%;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #e6e9ed;
          .collapse-title {
            font-size: 18px;
            font-weight: 400;
            color: #73879c;
          }
          .collapse-des {
            margin-left: 10px;
            font-size: 80%;
            font-weight: 400;
            color: #73879c;
          }
          .collapse-tips {
            margin-left: 10px;
            font-size: 80%;
            font-weight: 400;
            color: #ff0000;
          }
        }
        .produce-top-main {
          margin-top: 25px;
          margin-bottom: 10px;
          .search {
            display: flex;
            align-items: center;

            .search-title {
              font-size: 13px;
              color: #73879c;
            }
            .search-date {
              margin-left: 10px;
            }
            .search-key {
              width: 80px;
            }
            .search-btn {
              margin-left: 10px;
            }
          }
        }
      }

      .produce-mid {
        margin-top: 20px;
        padding: 10px 20px 10px 20px;
        background-color: #ffffff;
        .collapse-title-sty {
          width: 100%;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #e6e9ed;
          .collapse-title {
            font-size: 18px;
            font-weight: 400;
            color: #73879c;
          }
          .collapse-des {
            margin-left: 10px;
            font-size: 80%;
            font-weight: 400;
            color: #73879c;
          }
          .collapse-tips {
            margin-left: 10px;
            font-size: 80%;
            font-weight: 400;
            color: #ff0000;
          }
        }
        .produce-mid-main {
          margin-top: 25px;
          margin-bottom: 10px;
          .select-moudle {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .select-moudle-item:hover {
              cursor: pointer;
              color: #ffffff;
              background-color: #007bff;
            }
            .select-moudle-item {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 10px;
              color: #73879c;
              background-color: aliceblue;
              font-size: 14px;
              border: 1px solid #007bff;
              border-radius: 5px;
              flex: 1;
              //width: 20%;
              margin-right: 10px;
              transition: all 0.4s;
              -moz-transition: all 0.4s;
              -webkit-transition: all 0.4s;
              -o-transition: all 0.4s;
              // background-clip: padding-box;
              .item-left {
                .left-top {
                  font-size: 14px;
                }
                .left-mid {
                  display: flex;

                  .mid-title {
                  }
                  .mid-value {
                    margin-left: 10px;
                  }
                }
                .left-bottom {
                  display: flex;
                  .mid-title {
                  }
                  .mid-value {
                    margin-left: 10px;
                  }
                }
              }
              .item-right {
                .item-right-icon {
                  font-size: 40px;
                }
              }
            }
            .select-moudle-item-active {
              color: #ffffff;
              background-color: #007bff;
            }
          }
        }
      }
      .select-item-btns {
        margin-top: 10px;
        padding: 10px 20px 10px 20px;
        //background-color: #ffffff;
      }
      .produce-bottom {
        margin-top: 20px;
        padding: 10px 20px 10px 20px;
        background-color: #ffffff;
        .collapse-title-sty {
          width: 100%;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #e6e9ed;
          .collapse-title {
            font-size: 18px;
            font-weight: 400;
            color: #73879c;
          }
          .collapse-des {
            margin-left: 10px;
            font-size: 80%;
            font-weight: 400;
            color: #73879c;
          }
          .collapse-tips {
            margin-left: 10px;
            font-size: 80%;
            font-weight: 400;
            color: #ff0000;
          }
        }
        .produce-bottom-main {
          margin-top: 25px;
          margin-bottom: 10px;
        }
      }
      .produce-bottom-chart {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .bottom-content-left {
          width: 100%;

          .produce-bottom-content {
            margin-top: 20px;
            padding: 10px 20px 10px 20px;
            background-color: #ffffff;

            .collapse-title-sty {
              width: 100%;
              display: flex;
              align-items: center;
              border-bottom: 1px solid #e6e9ed;
              .collapse-title {
                font-size: 18px;
                font-weight: 400;
                color: #73879c;
              }
              .collapse-des {
                margin-left: 10px;
                font-size: 80%;
                font-weight: 400;
                color: #73879c;
              }
              .collapse-tips {
                margin-left: 10px;
                font-size: 80%;
                font-weight: 400;
                color: #ff0000;
              }
            }
            .produce-bottom-main {
              margin-top: 25px;
              margin-bottom: 10px;
            }
          }
        }
        .bottom-content-right {
          width: 100%;
          .produce-bottom-content {
            margin-top: 20px;
            padding: 10px 20px 10px 20px;
            background-color: #ffffff;

            .collapse-title-sty {
              width: 100%;
              display: flex;
              align-items: center;
              border-bottom: 1px solid #e6e9ed;
              display: flex;
              justify-content: space-between;
              .collapse-title {
                font-size: 18px;
                font-weight: 400;
                color: #73879c;
              }
              .collapse-des {
                margin-left: 10px;
                font-size: 80%;
                font-weight: 400;
                color: #73879c;
              }
              .collapse-tips {
                margin-left: 10px;
                font-size: 80%;
                font-weight: 400;
                color: #ff0000;
              }
              .collapse-title-right-icon {
                font-size: 18px;
                margin-right: 30px;
              }
            }
            .produce-bottom-main {
              margin-top: 25px;
              margin-bottom: 10px;
            }
          }
        }
      }
    }
  }
  .dialogp-content {
    height: 30vh;
    overflow: auto;
    .dialogp-content-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e6e6e6;
      padding: 15px 30px 15px 5px;
      .dialogp-left {
        display: flex;
        align-items: center;
        .dialogp-left-left {
          display: flex;
          align-items: center;
          img {
            width: 50px;
            height: 50px;
            border-radius: 3px;
          }
        }
        .dialogp-left-right {
          margin-left: 10px;

          .dialogp-left-top {
            font-size: 16px;
            color: #73879c;
            font-weight: 600;
          }
          .dialogp-left-bottom {
            display: flex;
            margin-top: 5px;
            .bottom-icon {
              width: 5px;
            }
            .dialogp-bottom-title {
              margin-left: 10px;
              font-size: 13px;
              color: #73879c;
            }
            .dialogp-bottom-time {
              margin-left: 10px;
              font-size: 13px;
              color: #73879c;
            }
            .dialogp-left-bottom-message {
              padding: 0px 10px;
              margin: 0;
              border-left: 5px solid #eee;
              font-size: 13px;
              color: #73879c;
            }
          }
        }
      }
      .dialogp-right {
        font-size: 28px;
        color: #dc3545;
      }
    }
  }
  .dialogp-no-data {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    font-weight: 400;
    color: #73879c;
    margin-top: 20px;
  }
}

@media screen and (max-width: 1165px) {
  .app-container {
    .produce-content {
      padding-bottom: 300px;
      .el-collapse {
        border: none;
      }
      .el-collapse-item__wrap {
        border: none;
      }
      .el-collapse-item__content {
        padding: 0;
      }
      .produce-top {
        padding: 10px 20px 10px 20px;
        background-color: #ffffff;
        .collapse-title-sty {
          width: 100%;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #e6e9ed;
          .collapse-title {
            font-size: 18px;
            font-weight: 400;
            color: #73879c;
          }
          .collapse-des {
            margin-left: 10px;
            font-size: 80%;
            font-weight: 400;
            color: #73879c;
          }
          .collapse-tips {
            margin-left: 10px;
            font-size: 80%;
            font-weight: 400;
            color: #ff0000;
          }
        }
        .produce-top-main {
          margin-top: 25px;
          margin-bottom: 10px;
          .search {
            display: flex;
            align-items: center;

            .search-title {
              font-size: 13px;
              color: #73879c;
            }
            .search-date {
              margin-left: 10px;
            }
            .search-key {
              width: 80px;
            }
            .search-btn {
              margin-left: 10px;
            }
          }
        }
      }

      .produce-mid {
        margin-top: 20px;
        padding: 10px 20px 10px 20px;
        background-color: #ffffff;
        .collapse-title-sty {
          width: 100%;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #e6e9ed;
          .collapse-title {
            font-size: 18px;
            font-weight: 400;
            color: #73879c;
          }
          .collapse-des {
            margin-left: 10px;
            font-size: 80%;
            font-weight: 400;
            color: #73879c;
          }
          .collapse-tips {
            margin-left: 10px;
            font-size: 80%;
            font-weight: 400;
            color: #ff0000;
          }
        }
        .produce-mid-main {
          margin-top: 25px;
          margin-bottom: 10px;
          .select-moudle {
            width: 100%;
            display: flex;
            flex-flow: row wrap;
            align-content: flex-start;
            .select-moudle-item:hover {
              cursor: pointer;
              color: #ffffff;
              background-color: #007bff;
            }
            .select-moudle-item {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 10px;
              color: #73879c;
              background-color: aliceblue;
              font-size: 12px;
              border: 1px solid #007bff;
              border-radius: 5px;
              flex: 0 0 45%;
              //width: 20%;
              margin-right: 10px;
              margin-top: 10px;
              transition: all 0.4s;
              -moz-transition: all 0.4s;
              -webkit-transition: all 0.4s;
              -o-transition: all 0.4s;
              // background-clip: padding-box;
              .item-left {
                .left-top {
                  font-size: 12px;
                }
                .left-mid {
                  display: flex;

                  .mid-title {
                  }
                  .mid-value {
                    margin-left: 10px;
                  }
                }
                .left-bottom {
                  display: flex;
                  .mid-title {
                  }
                  .mid-value {
                    margin-left: 10px;
                  }
                }
              }
              .item-right {
                .item-right-icon {
                  font-size: 30px;
                }
              }
            }
            .select-moudle-item-active {
              color: #ffffff;
              background-color: #007bff;
            }
          }
        }
      }
      .select-item-btns {
        margin-top: 10px;
        padding: 10px 20px 10px 20px;
        //background-color: #ffffff;
      }
      .produce-bottom {
        margin-top: 20px;
        padding: 10px 20px 10px 20px;
        background-color: #ffffff;
        .collapse-title-sty {
          width: 100%;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #e6e9ed;
          .collapse-title {
            font-size: 18px;
            font-weight: 400;
            color: #73879c;
          }
          .collapse-des {
            margin-left: 10px;
            font-size: 80%;
            font-weight: 400;
            color: #73879c;
          }
          .collapse-tips {
            margin-left: 10px;
            font-size: 80%;
            font-weight: 400;
            color: #ff0000;
          }
        }
        .produce-bottom-main {
          margin-top: 25px;
          margin-bottom: 10px;
        }
      }
      .produce-bottom-chart {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .bottom-content-left {
          width: 100%;

          .produce-bottom-content {
            margin-top: 20px;
            padding: 10px 20px 10px 20px;
            background-color: #ffffff;

            .collapse-title-sty {
              width: 100%;
              display: flex;
              align-items: center;
              border-bottom: 1px solid #e6e9ed;
              .collapse-title {
                font-size: 18px;
                font-weight: 400;
                color: #73879c;
              }
              .collapse-des {
                margin-left: 10px;
                font-size: 80%;
                font-weight: 400;
                color: #73879c;
              }
              .collapse-tips {
                margin-left: 10px;
                font-size: 80%;
                font-weight: 400;
                color: #ff0000;
              }
            }
            .produce-bottom-main {
              margin-top: 25px;
              margin-bottom: 10px;
            }
          }
        }
        .bottom-content-right {
          width: 100%;
          .produce-bottom-content {
            margin-top: 20px;
            padding: 10px 20px 10px 20px;
            background-color: #ffffff;

            .collapse-title-sty {
              width: 100%;
              display: flex;
              align-items: center;
              border-bottom: 1px solid #e6e9ed;
              display: flex;
              justify-content: space-between;
              .collapse-title {
                font-size: 18px;
                font-weight: 400;
                color: #73879c;
              }
              .collapse-des {
                margin-left: 10px;
                font-size: 80%;
                font-weight: 400;
                color: #73879c;
              }
              .collapse-tips {
                margin-left: 10px;
                font-size: 80%;
                font-weight: 400;
                color: #ff0000;
              }
              .collapse-title-right-icon {
                font-size: 18px;
                margin-right: 30px;
              }
            }
            .produce-bottom-main {
              margin-top: 25px;
              margin-bottom: 10px;
            }
          }
        }
      }
    }
  }
  .dialogp-content {
    height: 30vh;
    overflow: auto;
    .dialogp-content-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e6e6e6;
      padding: 15px 30px 15px 5px;
      .dialogp-left {
        display: flex;
        align-items: center;
        .dialogp-left-left {
          display: flex;
          align-items: center;
          img {
            width: 50px;
            height: 50px;
            border-radius: 3px;
          }
        }
        .dialogp-left-right {
          margin-left: 10px;

          .dialogp-left-top {
            font-size: 16px;
            color: #73879c;
            font-weight: 600;
          }
          .dialogp-left-bottom {
            display: flex;
            margin-top: 5px;
            .bottom-icon {
              width: 5px;
            }
            .dialogp-bottom-title {
              margin-left: 10px;
              font-size: 13px;
              color: #73879c;
            }
            .dialogp-bottom-time {
              margin-left: 10px;
              font-size: 13px;
              color: #73879c;
            }
            .dialogp-left-bottom-message {
              padding: 0px 10px;
              margin: 0;
              border-left: 5px solid #eee;
              font-size: 13px;
              color: #73879c;
            }
          }
        }
      }
      .dialogp-right {
        font-size: 28px;
        color: #dc3545;
      }
    }
  }
  .dialogp-no-data {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    font-weight: 400;
    color: #73879c;
    margin-top: 20px;
  }
}

@media screen and (max-width: 400px) {
  .app-container {
    .produce-content {
      padding-bottom: 300px;
      .el-collapse {
        border: none;
      }
      .el-collapse-item__wrap {
        border: none;
      }
      .el-collapse-item__content {
        padding: 0;
      }
      .produce-top {
        padding: 10px 20px 10px 20px;
        background-color: #ffffff;
        .collapse-title-sty {
          width: 100%;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #e6e9ed;
          .collapse-title {
            font-size: 18px;
            font-weight: 400;
            color: #73879c;
          }
          .collapse-des {
            margin-left: 10px;
            font-size: 80%;
            font-weight: 400;
            color: #73879c;
          }
          .collapse-tips {
            margin-left: 10px;
            font-size: 80%;
            font-weight: 400;
            color: #ff0000;
          }
        }
        .produce-top-main {
          margin-top: 25px;
          margin-bottom: 10px;
          .search {
            display: flex;
            align-items: center;

            .search-title {
              font-size: 13px;
              color: #73879c;
            }
            .search-date {
              margin-left: 10px;
            }
            .search-key {
              width: 80px;
            }
            .search-btn {
              margin-left: 10px;
            }
          }
        }
      }

      .produce-mid {
        margin-top: 20px;
        padding: 10px 20px 10px 20px;
        background-color: #ffffff;
        .collapse-title-sty {
          width: 100%;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #e6e9ed;
          .collapse-title {
            font-size: 18px;
            font-weight: 400;
            color: #73879c;
          }
          .collapse-des {
            margin-left: 10px;
            font-size: 80%;
            font-weight: 400;
            color: #73879c;
          }
          .collapse-tips {
            margin-left: 10px;
            font-size: 80%;
            font-weight: 400;
            color: #ff0000;
          }
        }
        .produce-mid-main {
          margin-top: 25px;
          margin-bottom: 10px;
          .select-moudle {
            width: 100%;
            display: flex;
            flex-flow: row wrap;
            align-content: flex-start;
            .select-moudle-item:hover {
              cursor: pointer;
              color: #ffffff;
              background-color: #007bff;
            }
            .select-moudle-item {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 10px;
              color: #73879c;
              background-color: aliceblue;
              font-size: 12px;
              border: 1px solid #007bff;
              border-radius: 5px;
              flex: 0 0 100%;
              //width: 20%;
              margin-right: 10px;
              margin-top: 10px;
              transition: all 0.4s;
              -moz-transition: all 0.4s;
              -webkit-transition: all 0.4s;
              -o-transition: all 0.4s;
              // background-clip: padding-box;
              .item-left {
                .left-top {
                  font-size: 12px;
                }
                .left-mid {
                  display: flex;

                  .mid-title {
                  }
                  .mid-value {
                    margin-left: 10px;
                  }
                }
                .left-bottom {
                  display: flex;
                  .mid-title {
                  }
                  .mid-value {
                    margin-left: 10px;
                  }
                }
              }
              .item-right {
                .item-right-icon {
                  font-size: 30px;
                }
              }
            }
            .select-moudle-item-active {
              color: #ffffff;
              background-color: #007bff;
            }
          }
        }
      }
      .select-item-btns {
        margin-top: 10px;
        padding: 10px 20px 10px 20px;
        //background-color: #ffffff;
      }
      .produce-bottom {
        margin-top: 20px;
        padding: 10px 20px 10px 20px;
        background-color: #ffffff;
        .collapse-title-sty {
          width: 100%;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #e6e9ed;
          .collapse-title {
            font-size: 18px;
            font-weight: 400;
            color: #73879c;
          }
          .collapse-des {
            margin-left: 10px;
            font-size: 80%;
            font-weight: 400;
            color: #73879c;
          }
          .collapse-tips {
            margin-left: 10px;
            font-size: 80%;
            font-weight: 400;
            color: #ff0000;
          }
        }
        .produce-bottom-main {
          margin-top: 25px;
          margin-bottom: 10px;
        }
      }
      .produce-bottom-chart {
        // display: flex;
        // justify-content: space-between;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .bottom-content-left {
          width: 100%;

          .produce-bottom-content {
            margin-top: 20px;
            padding: 10px 20px 10px 20px;
            background-color: #ffffff;

            .collapse-title-sty {
              width: 100%;
              display: flex;
              align-items: center;
              border-bottom: 1px solid #e6e9ed;
              .collapse-title {
                font-size: 18px;
                font-weight: 400;
                color: #73879c;
              }
              .collapse-des {
                margin-left: 10px;
                font-size: 80%;
                font-weight: 400;
                color: #73879c;
              }
              .collapse-tips {
                margin-left: 10px;
                font-size: 80%;
                font-weight: 400;
                color: #ff0000;
              }
            }
            .produce-bottom-main {
              margin-top: 25px;
              margin-bottom: 10px;
            }
          }
        }
        .bottom-content-right {
          width: 100%;
          .produce-bottom-content {
            margin-top: 20px;
            padding: 10px 20px 10px 20px;
            background-color: #ffffff;

            .collapse-title-sty {
              width: 100%;
              display: flex;
              align-items: center;
              border-bottom: 1px solid #e6e9ed;
              display: flex;
              justify-content: space-between;
              .collapse-title {
                font-size: 18px;
                font-weight: 400;
                color: #73879c;
              }
              .collapse-des {
                margin-left: 10px;
                font-size: 80%;
                font-weight: 400;
                color: #73879c;
              }
              .collapse-tips {
                margin-left: 10px;
                font-size: 80%;
                font-weight: 400;
                color: #ff0000;
              }
              .collapse-title-right-icon {
                font-size: 18px;
                margin-right: 30px;
              }
            }
            .produce-bottom-main {
              margin-top: 25px;
              margin-bottom: 10px;
            }
          }
        }
      }
    }
  }
  .dialogp-content {
    height: 30vh;
    overflow: auto;
    .dialogp-content-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e6e6e6;
      padding: 15px 30px 15px 5px;
      .dialogp-left {
        display: flex;
        align-items: center;
        .dialogp-left-left {
          display: flex;
          align-items: center;
          img {
            width: 50px;
            height: 50px;
            border-radius: 3px;
          }
        }
        .dialogp-left-right {
          margin-left: 10px;

          .dialogp-left-top {
            font-size: 16px;
            color: #73879c;
            font-weight: 600;
          }
          .dialogp-left-bottom {
            display: flex;
            margin-top: 5px;
            .bottom-icon {
              width: 5px;
            }
            .dialogp-bottom-title {
              margin-left: 10px;
              font-size: 13px;
              color: #73879c;
            }
            .dialogp-bottom-time {
              margin-left: 10px;
              font-size: 13px;
              color: #73879c;
            }
            .dialogp-left-bottom-message {
              padding: 0px 10px;
              margin: 0;
              border-left: 5px solid #eee;
              font-size: 13px;
              color: #73879c;
            }
          }
        }
      }
      .dialogp-right {
        font-size: 28px;
        color: #dc3545;
      }
    }
  }
  .dialogp-no-data {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    font-weight: 400;
    color: #73879c;
    margin-top: 20px;
  }
}

/* 媒体查询-自适应-end */
</style>
