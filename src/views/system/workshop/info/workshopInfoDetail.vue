<template>
  <el-form ref="form" :model="workshopInfo" :rules="rules" label-width="140px">
    <el-form-item label="工场名称" prop="workshopName">
      <el-input v-model="workshopInfo.workshopName" />
    </el-form-item>
    <el-form-item label="工场行业" prop="workshopIndustry">
      <el-input v-model="workshopInfo.workshopIndustry" />
    </el-form-item>
    <el-form-item label="服务标签" prop="workshopServerTag">
      <el-input v-model="workshopInfo.workshopServerTag" />
    </el-form-item>
    <el-form-item label="（省）" prop="workshopProvince">
      <el-input v-model="workshopInfo.workshopProvince" />
    </el-form-item>
    <el-form-item label="（市）" prop="workshopCity">
      <el-input v-model="workshopInfo.workshopCity" />
    </el-form-item>
    <el-form-item label="（区/县）" prop="workshopRegion">
      <el-input v-model="workshopInfo.workshopRegion" />
    </el-form-item>
    <el-form-item label="详细地址" prop="workshopDetailAddress">
      <el-input type="textarea" v-model="workshopInfo.workshopDetailAddress" />
    </el-form-item>
    <el-form-item label="经度" prop="workshopLongitude">
      <el-input v-model="workshopInfo.workshopLongitude" />
    </el-form-item>
    <el-form-item label="纬度" prop="workshopLatitude">
    <el-input v-model="workshopInfo.workshopLatitude" />
    </el-form-item>
    <el-form-item label="客服电话" prop="workshopConsumerHotline">
      <el-input v-model="workshopInfo.workshopConsumerHotline" maxlength="11" />
    </el-form-item>
    <el-form-item label="工场邮箱" prop="workshopEmail">
      <el-input v-model="workshopInfo.workshopEmail" maxlength="50" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
      <el-button type="danger" size="mini" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {addWorkshopInfoDetail, updateWorkshopInfoDetail} from "@/api/system/workshop/info/info";
export default {
  props: {
    workshopInfo: {
      type: Object
    }
  },
  data() {
    return {
      // 表单校验
      rules: {
        workshopName: [
          { required: true, message: "工场名称不能为空", trigger: "blur" }
        ],
        workshopIndustry: [
          { required: true, message: "工场行业不能为空", trigger: "blur" }
        ],
        workshopDetailAddress: [
          { required: true, message: "工场详细地址不能为空", trigger: "blur" }
        ],
        workshopEmail: [
          { required: true, message: "工场邮箱地址不能为空", trigger: "blur" },
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        workshopConsumerHotline: [
          { required: true, message: "工场客服手机号码不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.workshopInfo.pkid !== undefined){
            updateWorkshopInfoDetail(this.workshopInfo).then(
              response => {
                this.msgSuccess("修改成功");
              }
            );
          }else {
            addWorkshopInfoDetail(this.workshopInfo).then(
              response => {
                this.msgSuccess("新增成功");
              }
            );
          }
        }
      });
    },
    close() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ path: "/index" });
    }
  }
};
</script>
