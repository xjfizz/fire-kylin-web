<template>

  <div class="index-main">
    <div class="content">
      <div class="top">
        <img src="../assets/logo/kylin_logo.png" />
        <span>巨象Faas共享工场后台管理系统</span>
        </div>
      <div class="bottom">Giant Elephant Faas Shared Workshop Backstage Management System</div>
    </div>
  </div>

  </div>
</template>

<script>


export default {
  name: 'Index',
  components: {
   
  },
  data() {
    return {
     
    }
  },
  methods: {
   
  }
}
</script>

<style lang="scss" scoped>
  .index-main{
    width: 100%;
    height: 80vh;
  }
  .index-main .content{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height:100vh;
    background-color: darkgray;

  }
  .index-main .top{
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    color: black;
    font-size: 40px;
    margin: 10px;
  }
  .index-main .top img {
    width: 32px;
    height: 32px;
  }
   .index-main .bottom{
      display: flex;
    justify-content: center;
     align-items: center;
    font-weight: bold;
    color: black;
    font-size: 20px;
  }
</style>
