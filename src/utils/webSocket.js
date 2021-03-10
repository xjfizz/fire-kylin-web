import store from '@/store'
import { Message } from 'element-ui'

var url = 'ws://123.207.136.134:9010/ajaxchattest'
var ws;
var tt;
var lockReconnect = false;//避免重复连接
console.log('store',store)
var clientId = store.state.user.userInfo.userId//缓存中取出客户端id

var websocket = {
  Init: function() {
    if ("WebSocket" in window) {
    //  ws = new WebSocket(url + clientId);
     ws = new WebSocket(url );
    } else if ("MozWebSocket" in window) {
    //  ws = new MozWebSocket(url + clientId);
     ws = new MozWebSocket(url );
    } else {
      console.log("您的浏览器不支持 WebSocket!");
      return;
    }

    ws.onmessage = function(e) {
      console.log("接收消息:" + e.data)
      heartCheck.start()
      if(e.data=='ok'){//心跳消息不做处理
        return
      }
      //messageHandle(e.data)
    }

    ws.onclose = function() {
      console.log("连接已关闭")
      Message({
      		message: '连接已关闭',
      		type: 'error',
      });
      reconnect(clientId);
    }

    ws.onopen = function() {
      console.log("连接成功")
      Message({
      		message: '连接成功',
      		type: 'success',
      });
      heartCheck.start();
    }

    ws.onerror = function(e) {
      console.log("数据传输发生错误");
      Message({
      		message: '数据传输发生错误',
      		type: 'error',
      });
      reconnect(clientId)
    }
  },
  Send:function(sender,reception,body,flag){
    let data = {
      sender:sender,
      reception:reception,
      body:body,
      flag:flag
    }
    let msg= JSON.stringify(data)
    console.log("发送消息："+msg)
    ws.send(msg)
  },
  getWebSocket(){
    return ws;
  },
  getStatus() {
    if (ws.readyState == 0) {
      return "未连接";
    } else if (ws.readyState == 1) {
      return "已连接";
    } else if (ws.readyState == 2) {
      return "连接正在关闭";
    } else if (ws.readyState == 3) {
      return "连接已关闭";
    }
  }
}

export default websocket;

//根据消息标识做不同的处理
function messageHandle(message) {
  let msg = JSON.parse(message)
  switch (msg.flag) {
    case 'command':
      console.log("指令消息类型")
      break;
    case 'inform':
      console.log("通知")
      break;
    default:
      console.log("未知消息类型")
  }
}

function reconnect(sname) {
  if(lockReconnect) {
    return;
  };
  lockReconnect = true;
  //没连接上会一直重连，设置延迟避免请求过多
  tt && clearTimeout(tt);
  tt = setTimeout(function () {
    console.log("执行断线重连...")
    websocket.Init(sname);
    lockReconnect = false;
  }, 4000);
}

//心跳检测
var heartCheck = {
  timeout: 1000 * 60 * 3,
  timeoutObj: null,
  serverTimeoutObj: null,
  start: function(){
    console.log('开始心跳检测');
    var self = this;
    this.timeoutObj && clearTimeout(this.timeoutObj);
    this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
    this.timeoutObj = setTimeout(function(){
      //这里发送一个心跳，后端收到后，返回一个心跳消息，
      //onmessage拿到返回的心跳就说明连接正常
      console.log('心跳检测...');
      ws.send("HeartBeat:"+ clientId );
      self.serverTimeoutObj = setTimeout(function() {
        if(ws.readyState!=1){
           ws.close();
        }
        // createWebSocket();
      }, self.timeout);

    }, this.timeout)
  }
}

