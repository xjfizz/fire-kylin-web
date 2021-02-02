<template>
  <el-card shadow="never" class="message-card">
    <div class="message-main">
      <el-tabs
        class="message-tabs"
        type="border-card"
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane label="公司通知" name="first">
          <div class="tab-main" v-infinite-scroll="load" style="overflow:auto">
            <div class="message-item" v-for="item in count">
              <div class="message-top">
                <div class="top-message">【放假通知】 巨象信息部2021年春节放假20210207开始，节后上班时间定于20210219</div>
              </div>
              <div class="message-bottom">
                <div class="bottom-left">
                  <div class="left-time">
                    <div class="time-title">发布时间:</div>
                    <div class="time-value">2-2</div>
                  </div>
                  <div class="left-user">
                    <div class="user-title">发布人:</div>
                    <div class="user-value">张三</div>
                  </div>
                </div>
                <div class="bottom-right">
                  <div v-if="false" class="read-message">已读</div>
                  <div v-if="true" class="read-message read-message-no">标为已读</div>
                </div>
              </div>
            </div>
               <p v-if="loading">加载中...</p>
                <p v-if="noMore">没有更多了</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="制帽订单通知" name="second">配置管理</el-tab-pane>
        <el-tab-pane label="派单订单通知" name="third">角色管理</el-tab-pane>
      </el-tabs>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "message",
  props: {},
  components: {},
  data() {
    return {
      activeName: "first",
      count: 1,
      loading: false
    };
  },
  computed: {
      noMore () {
        return this.count >= 20
      },
       disabled () {
        return this.loading || this.noMore
      }
  },
  watch: {},
  mounted() {},

  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
     load () {
        this.loading = true
        setTimeout(() => {
          this.count += 2
          this.loading = false
        }, 2000)
      }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.message-card {
  height: 300px;
  .el-card__body {
    padding: 0;
  }
  .message-tabs {
    height: 300px;

    .el-tabs__content {
      padding: 0;
    }
    .tab-main {
      height: 250px;
      overflow: auto;
      .message-item {
        .message-top {
          padding: 10px 10px 3px 10px;
          .top-message {
            font-size: 15px;
          }
        }
        .message-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 15px;
          color: #a89e9e;
          border-bottom: 1px solid #e5e5e5;
          padding: 3px 10px 10px 10px;
          .bottom-left {
            display: flex;
            align-items: center;
            .left-time {
              display: flex;
              align-items: center;
              .time-title {
              }
              .time-value {
                margin-left: 10px;
              }
            }
            .left-user {
              display: flex;
              align-items: center;
              margin-left: 20px;

              .user-title {
              }
              .user-value {
                margin-left: 10px;
              }
            }
          }
          .bottom-right {
            .read-message {
            }
            .read-message-no {
              color: #9040fb;
            }
          }
        }
      }
    }
  }
}
</style>