<template>
  <el-card shadow="never" class="produce-card">
    <div class="produce-main">
      <div class="top">
        <div class="item" :class="itemSelectPie == 1 ? 'item-borderl' : ''" @click="selectPie(1)">
          <div class="item-top">20000.31</div>
          <div class="item-mid">总生产金额</div>
          <div class="item-bottom">(万元)</div>
        </div>
        <div class="item" :class="itemSelectPie == 2 ? 'item-borderl' : ''" @click="selectPie(2)">
          <div class="item-top">200.31</div>
          <div class="item-mid">总生产件数</div>
          <div class="item-bottom">(万件)</div>
        </div>
       <div class="item" :class="itemSelectPie == 3 ? 'item-borderl' : ''" @click="selectPie(3)">
          <div class="item-top">20000.31</div>
          <div class="item-mid">总订单数量</div>
          <div class="item-bottom">(个)</div>
        </div>
        <div class="item" :class="itemSelectPie == 4 ? 'item-borderl' : ''" @click="selectPie(4)">
          <div class="item-top">20000.31</div>
          <div class="item-mid">总客户数量</div>
          <div class="item-bottom">(家)</div>
        </div>
      </div>
      <!-- 饼图 -->
      <div class="bottom">
         <test></test>
      </div>
    </div>
  </el-card>
</template>

<script>
import test from '../chartCommponent/test'
export default {
  name: "message",
  props: {},
  components: {test},
  data() {
    return {
      activeName: "second",
      itemSelectPie:1 // 统计类型
    };
  },
  computed: {},
  watch: {},
  mounted() {},

  methods: {
      // 选择统计类型
   selectPie(e) {
       this.itemSelectPie = e
   }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.produce-card {
    // min-height: 300px;

  .produce-main {
      padding: 10px;
    .top {
         display: flex;
         align-items: center;
         justify-content: space-around;
         .item:hover{
             cursor: pointer;
         }
      .item {
          padding-top: 8px;
          padding-bottom: 8px;
        .item-top {
            display: flex;
            justify-content: center;
            font-size: 20px;
            color: #ff5400;
        }
        .item-mid {
             display: flex;
            justify-content: center;
             font-size: 14px;
         
        }
        .item-bottom {
             display: flex;
            justify-content: center;
             font-size: 14px;
             
        }
      }
      .item-borderl{
          border-bottom: 2px solid #ff5400;
      }
    }
  }
}
</style>