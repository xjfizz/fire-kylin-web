<template>
  <div :class="className" :style="{height:height,width:width}">
    <div class="content">
      <div class="content-item" v-for="item in 5">
        <div class="left">
          <div class="left-left">
            <img
              src="https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLBszrcIsTs7P2SRE3XaU7gQq8T6x87UKLibJU8Clicu1h7z3lG3qkrootQrd3TqY8dtDFaSfXPLHcA/132"
            />
          </div>
          <div class="left-right">
            <div class="left-top">润通帽业</div>
            <div class="left-bottom">
              <!-- <div class="bottom-icon"></div>
                          <div class="bottom-title">统计日期:</div>
              <div class="bottom-time">2020</div>-->
              <blockquote class="left-bottom-message">统计日期: 2020</blockquote>
            </div>
          </div>
        </div>
        <div class="right">200单</div>
      </div>
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
    }
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
</style>
