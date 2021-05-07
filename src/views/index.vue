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
import { getCodeImg } from "@/api/login";
import { getToken } from '@/utils/auth'


export default {
  name: 'Index',
  components: {
   
  },
  data() {
    return {
      loginForm:{
        password: 'qdzyds2021', //  "qdzyds2021", // decrypt('qdzyds2021')
        username: "qdzyds",
        loginSource:1, // 登陆来源
      },
    }
  },
  created() {
    console.log('getToken',getToken())
    if(this.$route.query.jumpSource == 'bigScreen') {
      // 清除token
      this.goLogin()
    } else {
      if(!getToken()) {
         this.$confirm('登录状态已过期，请重新登录', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           this.$router.push('/login')
          // this.store.dispatch('LogOut').then(() => {
          //   this.$router.push('/login')
          // })
        }).catch(() => {
                   
        });
      }
    }
  },
  methods: {
    // 登陆操作
    goLogin() {
      let params = {
         password: this.$route.query.password, //  "qdzyds2021", // decrypt('qdzyds2021')
         username: this.$route.query.username,
         loginSource:1, // 登陆来源
      }
      this.$store.dispatch("Login", params).then(() => {
        if(this.$route.query.username == 'qdzyds') {
           this.$router.replace({name:'Produce'})
          
        } else if(this.$route.query.username == 'hzzlds') {
          this.$router.replace({name:'Dispatch'})
        }
          }).catch(() => {
            
          });
    },
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
