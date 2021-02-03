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
      // 绘制图表
      this.chart.setOption({
        title: {
          text: "1000单",
          subtext: "",
           textStyle: {
              color: "#666666"
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
          data: ["新增订单"],
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

          data: [
            "2019-02-25",
            "2019-03-04",
            "2019-03-18",
            "2019-03-26",
            "2019-04-16",
            "2019-04-26",
            "2019-05-04"
          ]
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value}",
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
            name: "新增订单",
            type: "line",
            data: [11, 11, 15, 13, 12, 13, 10],
            smooth: false,
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
          },
        ]
      });
    }
  }
};
</script>
