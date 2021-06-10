<template>
  <div :class="className" :style="{ height: height, width: width }" />
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
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "300px",
    },
    activeName: {
      type: String,
      default: "",
    },
    chartData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.initChart();
    // });
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
      console.log("initChart", this.chartData);
      const _this = this;
      this.chart = echarts.init(this.$el, "macarons");
      this.chart.setOption({
        // title: {
        //   text: "某站点用户访问来源",
        //   subtext: "纯属虚构",
        //   left: "center"
        // },
        tooltip: {
          trigger: "item",
        },
        legend: {
          // orient: "vertical",
          left: "left",
        },
        color: _this.chartData.length <= 4 ? ["#1990FF", "#FFBD19", "#00D889", "#FFBD19",] : [],
        series: [
          {
            // name: "服务分类",
             name: _this.activeName == 4 ? '合作状态': "服务分类",
            type: "pie",
            radius: "50%",
            data: _this.chartData,
            tooltip: {
              trigger: "item",
              //　formatter: '{b}:{c}  (万元) {d}%',
              formatter: (item) => {
                 if (_this.activeName == 1) {
                  return `${item.seriesName} <br /> ${item.data.name}:${item.data.value}万元 (${item.percent}%) `;
                } else if (_this.activeName == 2) {
                  return `${item.seriesName} <br /> ${item.data.name}:${item.data.value}万件 (${item.percent}%) `;
                } else if (_this.activeName == 3) {
                  return `${item.seriesName} <br /> ${item.data.name}:${item.data.value}个 (${item.percent}%) `;
                } else if (_this.activeName == 4) {
                  return `${item.seriesName} <br /> ${item.data.name}:${item.data.value}个 (${item.percent}%) `;
                }
              },
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
    },
  },
};
</script>
