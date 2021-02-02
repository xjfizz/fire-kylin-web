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
      default: "300px"
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
        legend: {
          orient: "vertical",
          left: "right"
        },
        color : [ 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'purple' ],
        series: [
          {
            name: "服务分类",
            type: "pie",
            radius: "50%",
            data: [
              { value: 1048, name: "板带" , unit:'万元'},
              { value: 735, name: "魔术贴", unit:'万元'},
             
            ],
            tooltip: {
                trigger: 'item',
                　formatter: '{b}:{c}  (万元) {d}%',

            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            },
           
          }
        ]
      });
    }
  }
};
</script>
