<template>
  <div class="app-container">
    <div class="produce-content">
      <div class="produce-top">
        <el-collapse v-model="activeName1">
          <el-collapse-item name="1">
            <template slot="title">
              <div class="collapse-title-sty">
                <span class="collapse-title">查询</span>
                <span class="collapse-des">请输入查询日期进行检索</span>
                <span class="collapse-tips">※：请选择年月日进行查询，默认查询时间范围为：当月(例如：2020-09)</span>
              </div>
            </template>
            <!-- 查询筛选条件 -->
            <div class="produce-top-main">
              <div class="search">
                <div class="search-title">查询日期</div>
                <div class="search-date">
                  <el-date-picker
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
                  <el-select v-model="searchDateType" placeholder="请选择" @change="selectKeyClick">
                    <el-option
                      v-for="item in searchKeyList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
                <div class="search-btn">
                  <el-button icon="el-icon-search" type="primary" @click="search">查询</el-button>
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
                <span class="collapse-tips">※统计：平台订单、用户、实收</span>
              </div>
            </template>
            <!-- 统计 -->
            <div class="produce-mid-main">
              <div class="select-moudle">
                <el-tooltip class="item" effect="dark" content="统计查询时间范围内；订单" placement="bottom">
                  <div
                    class="select-moudle-item"
                    :class="selectMoudleItem == 1 ? 'select-moudle-item-active' : ''"
                    @click="selectMoudle(1)"
                  >
                    <div class="item-left">
                      <div class="left-top">订单</div>
                      <div class="left-mid">
                        <div class="mid-title">新增订单:</div>
                        <div class="mid-value">0单</div>
                      </div>
                      <div class="left-bottom">
                        <div class="mid-title">订单总额:</div>
                        <div class="mid-value">0元</div>
                      </div>
                    </div>
                    <div class="item-right">
                      <i class="el-icon-shopping-cart-2 item-right-icon"></i>
                    </div>
                  </div>
                </el-tooltip>

                <el-tooltip class="item" effect="dark" content="统计查询时间范围内；用户" placement="bottom">
                  <div
                    class="select-moudle-item"
                    :class="selectMoudleItem == 2 ? 'select-moudle-item-active' : ''"
                    @click="selectMoudle(2)"
                  >
                    <div class="item-left">
                      <div class="left-top">用户</div>
                      <div class="left-mid">
                        <div class="mid-title">活跃用户:</div>
                        <div class="mid-value">2人</div>
                      </div>
                      <div class="left-bottom">
                        <div class="mid-title">用户总数:</div>
                        <div class="mid-value">326人</div>
                      </div>
                    </div>
                    <div class="item-right">
                      <i class="el-icon-user-solid item-right-icon"></i>
                    </div>
                  </div>
                </el-tooltip>

                <el-tooltip class="item" effect="dark" content="统计查询时间范围内；实收" placement="bottom">
                  <div
                    class="select-moudle-item"
                    :class="selectMoudleItem == 3 ? 'select-moudle-item-active' : ''"
                    @click="selectMoudle(3)"
                  >
                    <div class="item-left">
                      <div class="left-top">实收</div>
                      <div class="left-mid">
                        <div class="mid-title">支付订单:</div>
                        <div class="mid-value">2单</div>
                      </div>
                      <div class="left-bottom">
                        <div class="mid-title">支付金额:</div>
                        <div class="mid-value">0元</div>
                      </div>
                    </div>
                    <div class="item-right">
                      <i class="el-icon-wallet item-right-icon"></i>
                    </div>
                  </div>
                </el-tooltip>

                <el-tooltip class="item" effect="dark" content="统计查询时间范围内；产量" placement="bottom">
                  <div
                    class="select-moudle-item"
                    :class="selectMoudleItem == 4 ? 'select-moudle-item-active' : ''"
                    @click="selectMoudle(4)"
                  >
                    <div class="item-left">
                      <div class="left-top">产量</div>
                      <div class="left-mid">
                        <div class="mid-title">当前产量:</div>
                        <div class="mid-value">0件</div>
                      </div>
                      <div class="left-bottom">
                        <div class="mid-title">总生产量:</div>
                        <div class="mid-value">156892件</div>
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
          >新增订单</el-button>
          <el-button
            :type="selectMoudleBtnSty == 2 ? 'primary' : ''"
            @click="selectMoudleBtn(2)"
          >生产完成</el-button>
          <el-button
            :type="selectMoudleBtnSty == 3 ? 'primary' : ''"
            @click="selectMoudleBtn(3)"
          >支付完成</el-button>
        </el-button-group>

        <el-button-group v-if="selectMoudleItem == 2">
          <!-- 用户 -->
          <el-button
            :type="selectMoudleBtnSty == 1 ? 'primary' : ''"
            @click="selectMoudleBtn(1)"
          >活跃用户</el-button>
          <el-button
            :type="selectMoudleBtnSty == 2 ? 'primary' : ''"
            @click="selectMoudleBtn(2)"
          >新增用户</el-button>
        </el-button-group>

        <el-button-group v-if="selectMoudleItem == 3">
          <el-button
            :type="selectMoudleBtnSty == 1 ? 'primary' : ''"
            @click="selectMoudleBtn(1)"
          >微信支付</el-button>
          <el-button
            :type="selectMoudleBtnSty == 2 ? 'primary' : ''"
            @click="selectMoudleBtn(2)"
          >余额支付</el-button>
          <el-button
            :type="selectMoudleBtnSty == 3 ? 'primary' : ''"
            @click="selectMoudleBtn(3)"
          >银联支付</el-button>
        </el-button-group>

        <el-button-group v-if="selectMoudleItem == 4">
          <!-- 产量-->
          <el-button :type="selectMoudleBtnSty == 1 ? 'primary' : ''" @click="selectMoudleBtn(1)">产量</el-button>
        </el-button-group>
      </div>

      <div class="produce-bottom">
        <el-collapse v-model="activeName3">
          <el-collapse-item name="1">
            <template slot="title">
              <div class="collapse-title-sty">
                <span class="collapse-title">新增订单</span>
              </div>
            </template>

            <!-- 统计 -->
            <div class="produce-bottom-main">
              <lineChart></lineChart>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>

      <!-- 底部表格 -->
      <div class="produce-bottom-chart">
        <div class="bottom-content-left">
          <div class="produce-bottom-content">
            <el-collapse v-model="activeName4">
              <el-collapse-item name="1">
                <template slot="title">
                  <div class="collapse-title-sty">
                    <span class="collapse-title">订单分类</span>
                  </div>
                </template>

                <!-- 统计 -->
                <div class="produce-bottom-main">
                  <pieChart></pieChart>
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
                     <span class="collapse-title">订单排行榜 (Top:前五名)</span>
                      <div class="collapse-title-right-icon" @click.stop="openPh">
                        <i class="el-icon-tickets"></i>
                      </div>
                  </div>
                </template>

                <!-- 排行榜 -->
                <div class="produce-bottom-main">
                    <phChart></phChart>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>
      <!-- <div class="produce-bottom-content">
        <div class="bottom-content-left">
           <el-collapse v-model="activeName4">
          <el-collapse-item name="1">
            <template slot="title">
              <div class="collapse-title-sty">
                <span class="collapse-title">订单分类</span>
              </div>
            </template>

            
            <div class="produce-bottom-main">
              <pieChart></pieChart>
            </div>
          </el-collapse-item>
        </el-collapse>
        </div>
        <div class="bottom-content-right">
             <el-collapse v-model="activeName5">
          <el-collapse-item name="1">
            <template slot="title">
              <div class="collapse-title-sty">
                <span class="collapse-title">订单排行榜 (Top:前五名)</span>
                <div class="collapse-title-right-icon">
                  <i class="el-icon-tickets"></i>
                </div>
              </div>
            </template>

           
            <div class="produce-bottom-main">
              <phChart></phChart>
            </div>
          </el-collapse-item>
        </el-collapse>
        </div>
      </div>-->
    </div>
  </div>
</template>

<script>
import lineChart from "./chartCommponent/line-chart";
import pieChart from "./chartCommponent/pie-chart";
import phChart from "./chartCommponent/ph-chart";
export default {
  name: "produce",
  components: { lineChart, pieChart, phChart },
  data() {
    return {
      activeName1: "1",
      activeName2: "1",
      activeName3: "1",
      activeName4: "1",
      activeName5: "1",
      searchDate: "",
      searchKeyList: [
        {
          value: "date",
          label: "日份"
        },
        {
          value: "month",
          label: "月份"
        },
        {
          value: "year",
          label: "年份"
        }
      ],
      searchKey: "month",
      searchDateType: "month",
      selectMoudleItem: 1,
      selectMoudleBtnSty: 1
    };
  },
  watch: {},
  created() {
    this.init();
  },
  mounted() {
    // this.init();
  },
  methods: {
    // 初始化
    init() {
      this.searchDate = this.dataFormat();
    },
    //查询
    search() {
      console.log("search", this.searchDate, this.searchDateType);
    },

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
    },
    // 切换图表按钮
    selectMoudleBtn(e) {
      this.selectMoudleBtnSty = e;
    },
    // 打开排行榜
    openPh() {

    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.app-container {
  background-color: #f9f9f9;
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
            padding: 10px;
            color: #73879c;
            background-color: aliceblue;
            font-size: 20px;
            border: 1px solid #007bff;
            border-radius: 5px;
            flex: 1;
            margin-right: 20px;
            transition: all 0.4s;
            -moz-transition: all 0.4s;
            -webkit-transition: all 0.4s;
            -o-transition: all 0.4s;
            // background-clip: padding-box;
            .item-left {
              .left-top {
                font-size: 30px;
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
            .collapse-title-right-icon{
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
</style>
