<template>
  <el-upload
    class="avatar-uploader"
    action="#"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
    :on-change="handleChange"
    :auto-upload="false"
  >
    <img v-if="imgsrc" :src="imgsrc" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<script>
import { blobToBase64 } from "../../util/base64";
export default {
  props: ["imgsrc"],
  data() {
    return {
      // imageUrl: ''
    };
  },
  methods: {
    handleChange(file, fileList) {
      console.log("..........");
      console.log(file);
      console.log(fileList);
      //   this.imageUrl = URL.createObjectURL(file.raw);
      //   this.$emit("imageChange", this.imageUrl)
      blobToBase64(file.raw, data => this.$emit("imageChange", data));
    },
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
      console.log(file);
    },
    beforeAvatarUpload(file) {
      console.log(".......................");
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }
  }
};
</script>
