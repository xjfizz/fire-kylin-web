<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import websocket from '@/utils/webSocket'
export default  {
  name:  'App',
   created(){
	  websocket.Init("user-1")
  }
}
</script>
