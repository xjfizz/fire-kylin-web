<template>
  <div class="waitInfo-main">
  <!-- 制帽代裁业务 -->
    <div class="waitInfo-main-item">
      <div v-if="workShopType == 1" class="waitInfo-main-item-title">制帽订单业务</div>
      <div v-if="workShopType == 2" class="waitInfo-main-item-title">代裁订单业务</div>
      <div class="waitInfo-main-item-name">我的待办</div>
      <div class="waitInfo-main-content">
        <div class="main-content-item">
          <div class="main-content-item-top">
            <div class="status-text status-text-sty1"></div>
            <span>待取料</span>
          </div>
          <div class="main-content-item-bottom">{{homeMainData.reclaimedNum}}</div>
        </div>
        <div class="main-content-item">
          <div class="main-content-item-top">
            <div class="status-text status-text-sty2"></div>
            <span>待确认</span>
          </div>
          <div class="main-content-item-bottom">{{homeMainData.confirmedNum}}</div>
        </div>
        <div class="main-content-item">
          <div class="main-content-item-top">
            <div class="status-text status-text-sty3"></div>
            <span>待分配生产</span>
          </div>
          <div class="main-content-item-bottom">{{homeMainData.producedNum}}</div>
        </div>
        <div class="main-content-item">
          <div class="main-content-item-top">
            <div class="status-text status-text-sty4"></div>
            <span>待检测</span>
          </div>
          <div class="main-content-item-bottom">{{homeMainData.testedNum}}</div>
        </div>
        <div class="main-content-item">
          <div class="main-content-item-top">
            <div class="status-text status-text-sty5"></div>
            <span>待配送</span>
          </div>
          <div class="main-content-item-bottom">{{homeMainData.deliveredNum}}</div>
        </div>
      </div>
    </div>
    <!-- 派单业务 -->
    <div class="waitInfo-main-item">
      <div class="waitInfo-main-item-title">派单订单业务</div>
      <div class="waitInfo-main-item-name">我的待办</div>
      <div class="waitInfo-main-content">
        <div class="main-content-item">
          <div class="main-content-item-top">
            <div class="status-text status-text-sty1"></div>
            <span>待取料</span>
          </div>
          <div class="main-content-item-bottom">{{homeMainData.pdReclaimedNum}}</div>
        </div>
        <div class="main-content-item">
          <div class="main-content-item-top">
            <div class="status-text status-text-sty2"></div>
            <span>待确认</span>
          </div>
          <div class="main-content-item-bottom">{{homeMainData.pdConfirmedNum}}</div>
        </div>
        <div class="main-content-item">
          <div class="main-content-item-top">
            <div class="status-text status-text-sty3"></div>
            <span>待分配生产</span>
          </div>
          <div class="main-content-item-bottom">{{homeMainData.pdProducedNum}}</div>
        </div>
        <div class="main-content-item">
          <div class="main-content-item-top">
            <div class="status-text status-text-sty4"></div>
            <span>待检测</span>
          </div>
          <div class="main-content-item-bottom">{{homeMainData.pdTestedNum}}</div>
        </div>
        <div class="main-content-item">
          <div class="main-content-item-top">
            <div class="status-text status-text-sty5"></div>
            <span>待配送</span>
          </div>
          <div class="main-content-item-bottom">{{homeMainData.pdDeliveredNum}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "waitInfo",
  
  props: {
      homeMainData:{
          type:Object,
          default:() => {
              return {}
          }
      }
  },
  components: {},
  data() {
    return {
    };
  },
  computed: {
    workShopType() {
      return this.$store.state.user.workshopInfo.workshopType
    }
  },
  watch: {},
  mounted() {},

  methods: {},
};
</script>

<style rel="stylesheet/scss" lang="scss">
.waitInfo-main {
  // width: 1076px;
  .waitInfo-main-item {
    height: 206px;
    background: #ffffff;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    padding: 21px 24px 24px 24px;
    margin-bottom: 32px;
    .waitInfo-main-item-title {
      font-size: 18px;
      color: #333333;
    }
    .waitInfo-main-item-name {
      margin-top: 16px;
      font-size: 16px;
      color: #888888;
    }
    .waitInfo-main-content {
      margin-top: 24px;
      display: flex;
      justify-content: space-between;
      .main-content-item:last-child {
        border: none;
      }
      .main-content-item {
       width: 18%;
        border-right:  1px solid #E5E5E5;
        .main-content-item-top {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.65);
          .status-text {
            width: 4px;
            height: 4px;
            margin-right: 8px;
          }
          .status-text-sty1 {
            background: #1990ff;
            border: 2px solid rgba(25, 144, 255, 0.2);
          }
          .status-text-sty2 {
            background: #ff5400;
            border: 2px solid rgba(255, 84, 0, 0.2);
          }
          .status-text-sty3 {
            background: #00d889;
            border: 2px solid rgba(0, 218, 134, 0.2);
          }
          .status-text-sty4 {
            background: #ffbf19;
            border: 2px solid rgba(255, 191, 25, 0.2);
          }
          .status-text-sty5 {
            background: #ff1919;
            border: 2px solid rgba(255, 25, 25, 0.2);
          }
        }
        .main-content-item-bottom {
          margin-top: 10px;
          font-size: 30px;
          color: rgba(0, 0, 0, 0.85);
        }
      }
    }
  }
}
</style>