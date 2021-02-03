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
          text: "订单分类",
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
        color: ["red", "orange", "yellow", "green", "blue", "indigo", "purple"],
        series: [
          {
            name: "服务分类",
            type: "pie",
            radius: "60%",
            center: ["50%", "50%"], //设置饼图位置
            data: [
              { value: 1048, name: "板带", unit: "万元", value2:90000 },
              { value: 735, name: "魔术贴", unit: "万元",value2:6000 }
            ],
            tooltip: {
              trigger: "item",
            //   formatter: "{b}:{c}  (万元) {d}%"
             formatter: function(item) {
                 console.log('item',item)
                 return `订单分类 <br /> ${item.data.name}:${item.data.value} (${item.percent}%) <br /> 订单金额:${item.data.value2} ${item.data.unit} `
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
