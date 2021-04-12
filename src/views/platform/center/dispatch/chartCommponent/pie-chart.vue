<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "400px"
    },
    chartTitle: {
      type: String,
      default: ""
    },
    data: {
      type: Array,
      default: []
    },
    type: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      let _this = this;
      this.chart.setOption({
        // title: {
        //   text: "某站点用户访问来源",
        //   subtext: "纯属虚构",
        //   left: "center"
        // },
        tooltip: {
          trigger: "item"
        },
        title: {
          text: _this.chartTitle,
          left: "center",
          subtext: "",
          textStyle: {
            //文字颜色
            color: "#333333",
            //字体风格,'normal','italic','oblique'
            fontStyle: "normal",
            //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
            fontWeight: "bold",
            //字体系列
            fontFamily: "sans-serif",
            //字体大小
            fontSize: 18
          }
        },
        legend: {
          orient: "vertical",
          left: "left"
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: "none"
            },
            dataView: { readOnly: false },
            // magicType: { type: ["line", "bar"] },
            restore: {},
            saveAsImage: {}
          }
        },
        // color: [
        //   "#dc3545",
        //   "#17a2b8",
        //   "#007bff",
        //   "#dc3545",
        //   "blue",
        //   "indigo",
        //   "purple"
        // ],
        series: [
          {
            name: "服务分类",
            type: "pie",
            radius: "60%",
            center: ["50%", "50%"], //设置饼图位置
            data: _this.data,
            tooltip: {
              trigger: "item",
              //   formatter: "{b}:{c}  (万元) {d}%"
              formatter: function(item) {
                if (_this.type == 2) {
                   return `${_this.chartTitle} <br /> ${item.data.name}:${item.data.value} (${item.percent}%) `;
                } else {
                   if(item.data.categoryName) {
                      return `${_this.chartTitle} <br /> ${item.data.categoryName}-${item.data.name}:${item.data.value} (${item.percent}%) <br /> 订单数量:${item.data.orderQuantity} <br /> 订单金额:${item.data.money} `;
                  } else {
                     return `${_this.chartTitle} <br /> ${item.data.name}:${item.data.value} (${item.percent}%) <br /> 订单数量:${item.data.orderQuantity} <br /> 订单金额:${item.data.money} `;
                  }
                }
              }
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    }
  }
};
</script>
