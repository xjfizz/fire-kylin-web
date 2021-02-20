<template>
  <div>
    <svg-icon icon-class="question" @click="note"/>
  </div>
</template>

<script>
export default {
  name: 'RuoYiDoc',
  data() {
    return {
      url: 'http://doc.ruoyi.vip/ruoyi-vue'
    }
  },
  methods: {
    note() {
      const h = this.$createElement;
      this.$notify({
        title: '温馨提示',
        message: h('i', {style: 'color: teal'}, '巨象官方联系方式为：0521-88888888')
      });
    },
    // goto() {
    //   window.open(this.url)
    // }
  }
}
</script>
