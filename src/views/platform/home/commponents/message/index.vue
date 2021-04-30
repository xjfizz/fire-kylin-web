<template>
  <div class="message">
    <div class="message-main">
      <el-tabs
        class="message-tabs"
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane label="公司通知" name="first">
          <div
            class="message-tab-main"
            v-infinite-scroll="load"
            style="overflow: auto"
          >
            <div
              class="message-item"
              v-for="(item, index) in count"
              :key="index"
              @click="goDetail(item)"
            >
              <div class="message-top">
                <div class="message-top-message">
                  【放假通知】
                  巨象信息部2021年春节放假20210207开始，节后上班时间定于20210219
                </div>
              </div>
              <div class="message-bottom">
                <div class="message-bottom-left">
                  <div class="message-left-time">
                    <div class="message-time-title">发布时间:</div>
                    <div class="message-time-value">2-2</div>
                  </div>
                  <div class="message-left-user">
                    <div class="message-user-title">发布人:</div>
                    <div class="message-user-value">张三</div>
                  </div>
                </div>
                <div class="message-bottom-right">
                  <div v-if="false" class="message-read-message">已读</div>
                  <div
                    v-if="true"
                    class="message-read-message message-read-message-no"
                  >
                    标为已读
                  </div>
                </div>
              </div>
            </div>
            <p v-if="loading">加载中...</p>
            <p v-if="noMore">没有更多了</p>
          </div>
        </el-tab-pane>
        <el-tab-pane
          :label="workShopType == 1 ? '制帽订单通知' : '代裁订单通知'"
          name="second"
        >
          <div
            class="message-tab-main"
            v-infinite-scroll="load"
            style="overflow: auto"
          >
            <div
              class="message-item"
              v-for="(item, index) in count"
              :key="index"
              @click="goDetail(item)"
            >
              <div class="message-top">
                <div class="message-top-message">
                  【放假通知】
                  巨象信息部2021年春节放假20210207开始，节后上班时间定于20210219
                </div>
              </div>
              <div class="message-bottom">
                <div class="message-bottom-left">
                  <div class="message-left-time">
                    <div class="message-time-title">发布时间:</div>
                    <div class="message-time-value">2-2</div>
                  </div>
                  <div class="message-left-user">
                    <div class="message-user-title">发布人:</div>
                    <div class="message-user-value">张三</div>
                  </div>
                </div>
                <div class="message-bottom-right">
                  <div v-if="false" class="message-read-message">已读</div>
                  <div
                    v-if="true"
                    class="message-read-message message-read-message-no"
                  >
                    标为已读
                  </div>
                </div>
              </div>
            </div>
            <p v-if="loading">加载中...</p>
            <p v-if="noMore">没有更多了</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="派单订单通知" name="third">
          <div
            class="message-tab-main"
            v-infinite-scroll="load"
            style="overflow: auto"
          >
            <div
              class="message-item"
              v-for="(item, index) in count"
              :key="index"
              @click="goDetail(item)"
            >
              <div class="message-top">
                <div class="message-top-message">
                  【放假通知】
                  巨象信息部2021年春节放假20210207开始，节后上班时间定于20210219
                </div>
              </div>
              <div class="message-bottom">
                <div class="message-bottom-left">
                  <div class="message-left-time">
                    <div class="message-time-title">发布时间:</div>
                    <div class="message-time-value">2-2</div>
                  </div>
                  <div class="message-left-user">
                    <div class="message-user-title">发布人:</div>
                    <div class="message-user-value">张三</div>
                  </div>
                </div>
                <div class="message-bottom-right">
                  <div v-if="false" class="message-read-message">已读</div>
                  <div
                    v-if="true"
                    class="message-read-message message-read-message-no"
                  >
                    标为已读
                  </div>
                </div>
              </div>
            </div>
            <p v-if="loading">加载中...</p>
            <p v-if="noMore">没有更多了</p>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="message-dialog">
      <el-dialog
        title="通知详情"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
      >
        <div class="message-dialog-content">
          <div class="message-dialog-top">
            巨象信息部2021年春节放假20210207开始，节后上班时间定于20210219
          </div>
          <div class="message-dialog-bottom">
            <div class="dialog-message-left-time">
              <span class="dialog-message-time-title">发布时间:</span>
              <span class="dialog-message-time-value">2-2</span>
            </div>
            <div class="dialog-message-left-user">
              <span class="dialog-message-user-title">发布人:</span>
              <span class="dialog-message-user-value">张三</span>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "message",
  props: {
    homeMainData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {},
  data() {
    return {
      workShopType: this.$store.state.user.userInfo.workShopType || 2,
      activeName: "first",
      count: 1,
      loading: false,
      dialogVisible: false,
      titleList: [
        { type: 1, name: "公司通知" },
        { type: 1, name: "公司通知" },
        { type: 1, name: "公司通知" },
      ],
    };
  },
  computed: {
    noMore() {
      return this.count >= 20;
    },
    disabled() {
      return this.loading || this.noMore;
    },
  },
  watch: {},
  mounted() {},

  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    load() {
      this.loading = true;
      setTimeout(() => {
        this.count += 2;
        this.loading = false;
      }, 2000);
    },
    goDetail(item) {
      this.dialogVisible = true;
    },
    handleClose(done) {
      this.dialogVisible = false;
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
.message .el-card__body {
  padding: 0;
}
.message {
  background: #ffffff;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  padding: 10px 10px 10px 10px;
}
.message-main {
  height: 305px;

  .message-tabs {
    height: 330px;

    .message-tabs .el-tabs__content {
      padding: 0;
    }
    .message-tab-main {
      height: 250px;
      overflow: auto;
      .message-item {
        .message-top {
          padding: 10px 10px 3px 10px;
          .message-top-message {
            font-size: 14px;
            color: #000000;
            font-weight: 500;
            font-family: PingFangSC-Medium, PingFang SC;
          }
        }
        .message-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          color: #a89e9e;
          border-bottom: 1px solid #e5e5e5;
          padding: 3px 10px 10px 10px;
          .message-bottom-left {
            display: flex;
            align-items: center;
            .message-left-time {
              display: flex;
              align-items: center;
              .message-time-title {
              }
              .message-time-value {
                margin-left: 10px;
              }
            }
            .message-left-user {
              display: flex;
              align-items: center;
              margin-left: 20px;

              .message-user-title {
              }
              .message-user-value {
                margin-left: 10px;
              }
            }
          }
          .message-bottom-right {
            .message-read-message {
            }
            .message-read-message-no {
              font-size: 14px;
              color: #1a90fe;
            }
          }
        }
      }
    }
  }
}
.message-dialog {
  .message-dialog-content {
    .message-dialog-top {
      height: 50px;
    }
    .message-dialog-bottom {
      display: flex;
      justify-content: flex-end;
       
      .dialog-message-left-time {
        display: flex;
        align-items: center;
        .dialog-message-time-title {
        }
        .dialog-message-time-value {
          margin-left: 10px;
        }
      }
      .dialog-message-left-user {
        display: flex;
        align-items: center;
        margin-left: 20px;

        .dialog-message-user-title {
        }
        .dialog-message-user-value {
          margin-left: 10px;
        }
      }
    }
  }
}
</style>