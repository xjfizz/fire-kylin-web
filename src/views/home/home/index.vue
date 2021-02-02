<template>
  <div class="dashboard-editor-container">

    工厂首页

    
  </div>
</template>

<script>
// import test from './dashboard/test'




export default {
  name: 'Index',
  components: {
//    test
  },
  data() {
    return {
      sty:{
        height:'80vh'
      }
    }
  },
  methods: {
    
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
