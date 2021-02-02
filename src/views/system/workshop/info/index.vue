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
              <userAvatar :workshopInfo="workshopInfo" />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="github" style="margin-right: 5px"/>工场账号
                <div class="pull-right">{{ workshopInfo.workshopAccount }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="user" style="margin-right: 5px"/>工场名称
                <div class="pull-right">{{ workshopInfo.workshopName }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="education" style="margin-right: 5px"/>工场行业
                <div class="pull-right">{{ workshopInfo.workshopIndustry }}</div>
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
import { listInfo, getInfo, delInfo, addInfo, updateInfo, exportInfo, getWorkshopInfoDetail } from "@/api/system/workshop/info/info";

export default {
  name: "Profile",
  components: { userAvatar, workshopInfoDetail, introduction, bank },
  data() {
    return {
      workshopInfo: {},
      activeTab: "workshopInfoDetail"
    };
  },
  created() {
    this.getWorkshopInfo();
  },
  methods: {
    // 获取工场信息
    getWorkshopInfo(){
      getWorkshopInfoDetail().then(response => {
        this.workshopInfo = response.data;
      });
    }
  }
};
</script>
