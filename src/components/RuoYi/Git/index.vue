<template>
  <div>
    <svg-icon icon-class="github" plain @click="note()"/>
  </div>
</template>

<script>
export default {
  name: 'RuoYiGit',
  data() {
    return {
      // url: 'https://gitee.com/y_project/RuoYi-Vue'
    }
  },
  methods: {
    note() {
      const h = this.$createElement;
      this.$notify({
        title: '温馨提示',
        message: h('i', {style: 'color: teal'}, '巨象官网闭关中，敬请期待！')
      });
    },
    // goto() {
    //   window.open(this.url)
    // }
  }
}
</script>
