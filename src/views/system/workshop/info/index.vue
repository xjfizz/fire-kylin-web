<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>工场信息</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar :workshopInfo="workshopInfo" @getWorkshopInfo = "getWorkshopInfo" />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="github" style="margin-right: 5px"/>工场账号
                <div class="pull-right">{{ workshopInfo.workshopAccount }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="github" style="margin-right: 5px"/>工场昵称
                <div class="pull-right">{{ workshopInfo.workshopClusterName }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="github" style="margin-right: 5px"/>工场产业集群
                <div class="pull-right">{{ this.industrialClustersFormat(workshopInfo.workshopCluster) }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="user" style="margin-right: 5px"/>工场名称
                <div class="pull-right">{{ workshopInfo.workshopName }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="education" style="margin-right: 5px"/>工场行业
                <div class="pull-right">{{ this.supplierIndustryFormat(workshopInfo.workshopIndustry) }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="bookmark-outline-add" style="margin-right: 5px"/>服务标签
                <div class="pull-right">{{ workshopInfo.workshopServerTag }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="location" style="margin-right: 5px"/>工场地址
                <div class="pull-right">{{ workshopInfo.workshopProvince }} - {{ workshopInfo.workshopCity }} - {{ workshopInfo.workshopRegion }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="location" style="margin-right: 5px"/>详细地址
                <div class="pull-right">{{ workshopInfo.workshopDetailAddress}}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="phone" style="margin-right: 5px"/>客服电话
                <div class="pull-right">{{ workshopInfo.workshopConsumerHotline }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="email" style="margin-right: 5px"/>工场邮箱
                <div class="pull-right">{{ workshopInfo.workshopEmail }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="star-full" style="margin-right: 5px"/>产能评级
                <div class="pull-right">{{ workshopInfo.workshopCapacityRating }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="star-full" style="margin-right: 5px"/>信用评级
                <div class="pull-right">{{ workshopInfo.workshopCreditRating }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="date" style="margin-right: 5px"/>创建日期
                <div class="pull-right">{{ workshopInfo.createTime }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>信息管理</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="workshopInfoDetail">
              <workshopInfoDetail :workshopInfo="workshopInfo" />
            </el-tab-pane>
            <el-tab-pane label="工场介绍" name="introduction">
              <introduction :workshopInfo="workshopInfo" />
            </el-tab-pane>
            <el-tab-pane label="银行卡" name="bank">
              <bank :workshopInfo="workshopInfo" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userAvatar from "@/views/system/workshop/info/userAvatar";
import workshopInfoDetail from "@/views/system/workshop/info/workshopInfoDetail";
import introduction from "@/views/system/workshop/info/introduction";
import bank from "@/views/system/workshop/info/bank";
import {getWorkshopInfoDetail, listAllIndustry, listIndustrialClusters} from "@/api/system/workshop/info/info";

export default {
  name: "Profile",
  components: { userAvatar, workshopInfoDetail, introduction, bank },
  data() {
    return {
      loading: false,
      // 平台行业表格数据
      industryList: [],
      // 产业集群
      industrialClustersList: [],
      // 工场服务标签
      serverTagList: [],
      // 工场数据信息
      workshopInfo: {},
      activeTab: "workshopInfoDetail"
    };
  },
  created() {
    this.getIndustryList();
    this.getWorkshopInfo();
    this.getIndustrialClustersList();
    // this.getServerTagList();
  },
  methods: {
    /** 查询平台行业列表 */
    getIndustryList() {
      this.loading = true;
      listAllIndustry().then(response => {
        this.industryList = response.data;
        this.loading = false;
      });
    },
    /** 查询产业集群列表 */
    getIndustrialClustersList() {
      this.loading = true;
      listIndustrialClusters().then(response => {
        this.industrialClustersList = response.data;
        this.loading = false;
      });
    },
    /** 查询工场服务标签列表 */
    // getServerTagList() {
    //   this.loading = true;
    //   listServerTag().then(response => {
    //     this.serverTagList = response.data;
    //     this.loading = false;
    //   });
    // },
    // 获取工场信息
    getWorkshopInfo() {
      getWorkshopInfoDetail().then(response => {
        this.workshopInfo = response.data;
        this.$store.commit('SET_WORKSHOPINFO',this.workshopInfo)
      });
    },
    // 客服状态字典翻译
    supplierIndustryFormat(value) {
      return this.formatSupplierIndustry(this.industryList, value);
    },

    // 工场产业集群格式化
    industrialClustersFormat(value) {
      return this.formatIndustrialClusters(this.industrialClustersList, value);
    },

    // 客服状态字典翻译
    // serverTagFormat(value) {
    //   return this.formatServerTag(this.serverTagList, value);
    // },

    formatSupplierIndustry(datas, value) {
      var actions = [];
      Object.keys(datas).some((key) => {
        if (datas[key].pkid === (value)) {
          actions.push(datas[key].industryName);
          return true;
        }
      })
      return actions.join('');
    },

    formatIndustrialClusters(datas, value) {
      var actions = [];
      if (value === null || value === undefined){
        return actions.join('');
      }
      Object.keys(datas).some((key) => {
        if (datas[key].pkid === (value)) {
          actions.push(datas[key].clusterName);
          return true;
        }
      })
      return actions.join('');
    },

    // formatServerTag(datas, value) {
    //   var actions = [];
    //   Object.keys(datas).some((key) => {
    //     if (datas[key].pkid == (value)) {
    //       actions.push(datas[key].categoryName);
    //       return true;
    //     }
    //   })
    //   return actions.join('');
    // },
  }
};
</script>
