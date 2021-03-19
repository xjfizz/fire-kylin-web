<template>
   <div class="index">
     <div id="container"></div>
  </div>
</template>

<script>
let map, marker, polygon, drawingManager, lngLat,ap;
export default {
  name: 'workShopMap',
  components: {
   
  },
  data() {
    return {
        key:'WWPBZ-G5ZCQ-ATG56-GXL4K-VKDN5-LDFNI',
        position:{ 
                    longitude: 0,//经度
                    latitude:0,//纬度
                    city:''
        },
        addressInfo:{}
    }
  },
    mounted() {
        this.getMyLocation();
    },
  methods: {
       /**
         * /定位获得当前位置信息
         */
        getMyLocation() {
            var geolocation = new qq.maps.Geolocation(this.key, "巨象工场-后台管理");
            geolocation.getLocation(this.showPosition, this.showErr);
        },
        showPosition(position) {
            console.log(position);
            this.position.latitude = position.lat;
            this.position.longitude = position.lng;
            this.position.city = position.city;
            this.setMapData();
        },
        //定位失败再请求定位，测试使用
        showErr() {
            console.log("定位失败，请重试！");
            this.getMyLocation();
        },
         /**
         * 位置信息在地图上展示
         */
        setMapData() {
             var myLatlng = new qq.maps.LatLng(this.position.latitude, this.position.longitude);
            var myOptions = {
                zoom: 16, 
                center: myLatlng, 
                mapTypeId: qq.maps.MapTypeId.ROADMAP  
            }
            //获取dom元素添加地图信息
            map = new qq.maps.Map(document.getElementById("container"), myOptions)
            //给定位的位置添加图片标注
            marker = new qq.maps.Marker({
                position: myLatlng,
                map: map,
                draggable: true //允许鼠标拖动
            })
            this.mouseClick()
        },
         /**
         * 鼠标点击获取标记位置事件
         */
        mouseClick () {
            const _this = this 
            qq.maps.event.addListener(map, 'click', function (event) {
                if(!marker) {
                    marker=new qq.maps.Marker({
                        position: event.latLng,
                        map:map
                    })
                    return
                }
                marker.setPosition(event.latLng) 
                _this.position.latitude = event.latLng.getLat();
                _this.position.longitude = event.latLng.getLng();
                console.log('event',event)
                _this.getAddresss(_this.position.latitude, _this.position.longitude)
            })
        },
        getAddresss(lat,lng){
	        const KEY = this.key; //key 秘钥自己申请
	        const _this = this; //key 秘钥自己申请
	        let url = 'https://apis.map.qq.com/ws/geocoder/v1?&poi_options=address_format=short&get_poi=0';
	        let locationdata = lat+','+lng //纬度，经度
	        this.$jsonp(url,{
	          key:KEY,
	          callbackName: 'QQmap',
	          output:'jsonp',
	          location:locationdata
	        })
			.then(json => {
                _this.addressInfo = json.result
                _this.$emit('getAddress', _this.addressInfo)
	            	})
				.catch(err => {
				console.log(err)
				})
	      }

      
  }
}
</script>

<style lang="scss" scoped>
#container{
    width: 100%;
    height:100vh;
    position: absolute;
}
</style>
