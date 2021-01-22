<template>
  <el-form ref="form" :model="workshopInfo" :rules="rules" label-width="80px">
    <el-row>
      <el-col :span="24">
        <el-form-item label="工场介绍">
          <editor v-model="workshopInfo.workshopIntroduction" :min-height="192"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
      <el-button type="danger" size="mini" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {addWorkshopInfoDetail, updateWorkshopInfoDetail} from "@/api/system/workshop/info/info";
import Editor from "@/components/Editor";

export default {
  components: {
    Editor
  },
  props: {
    workshopInfo: {
      type: Object
    }
  },
  data() {

    return {

      // 表单校验
      rules: {}
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
