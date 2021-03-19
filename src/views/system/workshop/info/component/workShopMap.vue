<template>
   <div class="index">
      <el-input class="map-input"  ref="mapInput" v-model="input" type="text" id="place" placeholder="请输入地点搜索"></el-input>
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
        addressInfo:{},
        input:''
    }
  },
    mounted() {
      //  this.getMyLocation();
    },
  methods: {
      // 初始化
      init() {
          this.position = {
               longitude: 0,//经度
               latitude:0,//纬度
               city:''
          }
          this.input = ''
          this.getMyLocation();
      },
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
            this.search()
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
          },
           /**搜索地点 */
        search(){
            ap = new window.qq.maps.place.Autocomplete(document.getElementById('place'));
            var keyword = "";
            //调用Poi检索类。用于进行本地检索、周边检索等服务。
              var searchService = new window.qq.maps.SearchService({
                  complete : function(results){
                      if(results.type === "CITY_LIST") {
                        searchService.setLocation(results.detail.cities[0].cityName);
                        searchService.search(keyword);
                        return;
                    }
                    var pois = results.detail.pois;
                    var latlngBounds = new window.qq.maps.LatLngBounds();
                    for(var i = 0,l = pois.length;i < l; i++){
                       var poi = pois[i];
                        latlngBounds.extend(poi.latLng);  
                        //  var marker = new window.qq.maps.Marker({
                        //     map:map,
                        //     position: poi.latLng
                        // });
                         marker.setTitle(poi.name);
                    }
                     map.fitBounds(latlngBounds);
                  }
              })
               //添加监听事件
            window.qq.maps.event.addListener(ap, "confirm", function(res){
                keyword = res.value;
                searchService.search(keyword);
            });
        },
        searchAddress() {
           
        },
        enterInput() {
            
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

.map-input{
    width: 250px;
    position: absolute;
    top:200px;
    right: 50px;
    z-index: 999;
}

</style>
