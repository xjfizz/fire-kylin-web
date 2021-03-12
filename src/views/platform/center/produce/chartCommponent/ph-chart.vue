<template>
  <div :class="className" :style="{height:height,width:width}">
    <div class="content">
      <div v-if="data.length > 0" class="content-item" v-for="item in data">
        <div class="left">
          <div class="left-left">
            <img
              :src="item.userAvatar"
            />
          </div>
          <div class="left-right">
            <div class="left-top">{{item.userName || '暂无'}}</div>
            <div class="left-bottom">
              <!-- <div class="bottom-icon"></div>
                          <div class="bottom-title">统计日期:</div>
              <div class="bottom-time">2020</div>-->
              <blockquote class="left-bottom-message">统计日期: 
                <span v-if="item.orderDayDate">{{item.orderDayDate}}</span>
                <span v-if="item.orderMonthDate">{{item.orderMonthDate}}</span>
                <span v-if="item.orderYearDate">{{item.orderYearDate}}</span>
              </blockquote>
            </div>
          </div>
        </div>
        <div class="right">{{item.orderNum || 0}}单</div>
      </div>
      <div v-if="data.length == 0" class="no-data">暂无数据</div>
    </div>
  </div>
</template>

<script>
export default {
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
  },
  data() {
    return {
      chart: null
    };
  },
  mounted() {},
  beforeDestroy() {},
  methods: {}
};
</script>
<style rel="stylesheet/scss" lang="scss">
.content {
  .content-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e6e6e6;
    padding: 15px 30px 15px 5px;
    // background-color: #fdf8f9;
    // margin-top: 2px;
    .left {
      display: flex;
      align-items: center;
      .left-left {
        display: flex;
        align-items: center;
        img {
          width: 50px;
          height: 50px;
          border-radius: 3px;
        }
      }
      .left-right {
        margin-left: 10px;

        .left-top {
          font-size: 16px;
          color: #73879c;
          font-weight: 600;
        }
        .left-bottom {
          display: flex;
          .bottom-icon {
            width: 5px;
          }
          .bottom-title {
            margin-left: 10px;
            font-size: 13px;
            color: #73879c;
          }
          .bottom-time {
            margin-left: 10px;
            font-size: 13px;
            color: #73879c;
          }
          .left-bottom-message {
            padding: 0px 10px;
            margin: 0;
            border-left: 5px solid #eee;
            font-size: 13px;
            color: #73879c;
          }
        }
      }
    }
    .right {
      font-size: 28px;
      color: #dc3545;
    }
  }
}
.no-data{
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: 400;
  color: #73879c;
  margin-top: 20px;
}
</style>
