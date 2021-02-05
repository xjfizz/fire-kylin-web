<template>
<div class="message">
    <el-card shadow="never" class="message-card">
    <div class="message-main">
      <el-tabs
        class="message-tabs"
        type="border-card"
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane label="公司通知" name="first">
          <div class="message-tab-main" v-infinite-scroll="load" style="overflow:auto">
            <div class="message-item" v-for="item in count">
              <div class="message-top">
                <div class="message-top-message">【放假通知】 巨象信息部2021年春节放假20210207开始，节后上班时间定于20210219</div>
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
                  <div v-if="true" class="message-read-message message-read-message-no">标为已读</div>
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
</div>

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
 .message .el-card__body {
    padding: 0;
  } 
.message-card {
  height: 300px;
 
  .message-tabs {
    height: 300px;

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
              color: #9040fb;
            }
          }
        }
      }
    }
  }
}
</style>