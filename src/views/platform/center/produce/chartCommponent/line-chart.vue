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
    dataNum: {
      type: String,
      default: ""
    },
    dataY: {
      type: Array,
      default: []
    },
    dataX: {
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
      // 绘制图表
      this.chart.setOption({
        title: {
          text: _this.dataNum,
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
        tooltip: {
          trigger: "axis",

          axisPointer: {
            type: "line",
            lineStyle: {
              color: "#999999",
              width: 2
            }
          }
        },
        legend: {
          data: [_this.chartTitle],
          orient: "vertical",
          left: "center",
          textStyle: {
            fontSize: 14, //字体大小
            color: "#888888" //字体颜色
          }
        },

        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: "none"
            },
            dataView: { readOnly: false },
            magicType: { type: ["line", "bar"] },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisLabel: {
            show: true,
            textStyle: {
              color: "#000000"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#999999",
              width: 2 //这里是为了突出显示加上的
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ["#e5e5e5"],
              width: 1,
              type: "solid"
            }
          },

          data: _this.dataX
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: function(value) {
              if (_this.type == 1) {
                return `${value}单`;
              } else if (_this.type == 2) {
                return `${value}人`;
              } else if (_this.type == 3) {
                return `￥${value}`;
              } else if (_this.type == 4) {
                return `${value}件`;
              }
            },
            textStyle: {
              color: "#000000"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#999999",
              width: 2 //这里是为了突出显示加上的
            }
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ["#e5e5e5"],
            width: 1,
            type: "solid"
          }
        },
        series: [
          {
            name: _this.chartTitle,
            type: "line",
            data: _this.dataY,
            smooth: true, // 曲线开启
            color: ["#d02929"], //折线条的颜色
            markPoint: {
              data: [
                { type: "max", name: "最大值" },
                { type: "min", name: "最小值" }
              ]
            },
            markLine: {
              data: [{ type: "average", name: "平均值" }]
            }
          }
        ]
      });
    }
  }
};
</script>
