<template>
  <el-form ref="form" :model="workshopInfo" :rules="rules" label-width="180px">
    <el-form-item label="工场二级商户账户" prop="bankAccountName">
      <el-input v-model="workshopInfo.bankAccountName" placeholder="请输入工场二级商户账户"  />
    </el-form-item>
    <el-form-item label="工场收款账户名称" prop="bankName">
      <el-input v-model="workshopInfo.bankName" placeholder="请输入工场收款账户名称"  />
    </el-form-item>
    <el-form-item label="工场收款账户" prop="bankAccount">
      <el-input v-model="workshopInfo.bankAccount" placeholder="请输入工场收款账户"  />
    </el-form-item>
    <el-form-item label="预留手机" prop="bankReservePhone">
      <el-input v-model="workshopInfo.bankReservePhone" placeholder="请输入预留手机"  />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
      <el-button type="danger" size="mini" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { addWorkshopInfoDetail, updateWorkshopInfoDetail } from "@/api/system/workshop/info/info";
export default {
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
