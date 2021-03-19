<template>
  <div>
    <svg-icon icon-class="question" @click="note"/>
  </div>
</template>

<script>
import {getPlatformPhone} from "@/api/system/workshop/info/info";
export default {
  name: 'RuoYiDoc',
  data() {
    return {
      url: 'http://doc.ruoyi.vip/ruoyi-vue',
      platform:{}
    }
  },
  methods: {
    note() {
      this.getWorkshopInfo()
     
    },
     // 获取工场信息
    getWorkshopInfo() {
      getPlatformPhone().then(response => {
        if(response.data.length > 0) {
           this.platform = response.data[0];
        }
       const h = this.$createElement;
        console.log('=======',this.$store)
        this.$notify({
          title: '温馨提示',
          message: h('i', {style: 'color: teal'}, `巨象官方联系方式为：${this.platform.infoPhone || '暂无客服'}`)
        });
      });
    },
    // goto() {
    //   window.open(this.url)
    // }
  }
}
</script>
