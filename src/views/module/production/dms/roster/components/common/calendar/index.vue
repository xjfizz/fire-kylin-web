<template>
  <div class="calendar-main">
    <div class="
    top">
        <span>系统检测: </span>
        <span>已复制2020-01-02计划</span>
         <el-button
        class="insert-btn"
        type="success"
        size="mini"
        @click="downs()"
      >插入</el-button>
    </div>
    <div class="mid">
         <Calendar v-on:choseDay="clickDay" v-on:changeMonth="changeDate"></Calendar>
    </div>
    <div class="bottom"></div>
   
  </div>
</template>

<script>
import Calendar from "vue-calendar-component";
export default {
  name: "calendar",
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  components: {
    Calendar
  },
  data() {
    return {};
  },
  computed: {},
  watch: {
    value: {
      handler(val) {},
      immediate: true
    }
  },
  mounted() {},

  methods: {
    clickDay(data) {
      console.log(data); //选中某天
    },
    changeDate(data) {
      console.log(data); //左右点击切换月份
    },
    clickToday(data) {
      console.log(data); //跳到了本月
    },
    downloadIamge(imgsrc, name) {//下载图片地址和图片名
  var image = new Image();
  // 解决跨域 Canvas 污染问题
  image.setAttribute("crossOrigin", "anonymous");
  image.onload = function() {
    var canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    var context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, image.width, image.height);
    var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
  
    var a = document.createElement("a"); // 生成一个a元素
    var event = new MouseEvent("click"); // 创建一个单击事件
    a.download = name || "photo"; // 设置图片名称
    a.href = url; // 将生成的URL设置为a.href属性
    a.dispatchEvent(event); // 触发a的单击事件
  };
  image.src = imgsrc;
},
downs(){
    let url = 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1603365312,3218205429&fm=26&gp=0.jpg'
  this.downloadIamge(url, 'pic')
}
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.calendar-main {
  // 606266 c0c4cc 1890ff
  .wh_item_date:hover {
    background: #ffffff;
    color: #1890ff;
    cursor: pointer;
  }
  .wh_content_all {
    background-color: #ffffff;
    color: #606266;
  }
  .wh_content:first-child .wh_content_item_tag,
  .wh_content:first-child .wh_content_item {
    color: #606266;
  }
  .wh_content_item,
  wh_content_item_tag {
    color: #606266;
  }

  .wh_jiantou1 {
    border-top: 2px solid #606266;
    border-left: 2px solid #606266;
  }

  .wh_jiantou1:active,
  .wh_jiantou2:active {
    border-color: #606266;
  }

  .wh_jiantou2 {
    border-top: 2px solid #606266;
    border-right: 2px solid #606266;
  }
  .wh_content_item > .wh_isMark {
    background: blue;
  }
  .wh_content_item .wh_other_dayhide {
    color: #c0c4cc;
  }
  .wh_content_item .wh_want_dayhide {
    color: #c0c4cc;
  }
  .wh_content_item .wh_isToday {
    background: #ffffff;
    color: #1890ff;
  }
  .wh_content_item .wh_chose_day {
    background: #1890ff;
    color: #fff;
  }

  .wh_top_changge li {
    color: #606266;
  }
  .top{
      display: flex;
      justify-content: flex-start;
      align-items: center;
  }
  .mid{}
  .bottom{}
}
</style>