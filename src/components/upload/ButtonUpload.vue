<template>
  <el-upload
    class="avatar-uploader"
    action="#"
    :show-file-list="false"
    :on-change="handleChange"
    :auto-upload="false"
  >
    <el-button slot="trigger" size="small" type="primary"
      >ファイルを選択</el-button
    >
  </el-upload>
</template>

<style scoped>
</style>

<script>
import { blobToBase64 } from "../../util/base64";
export default {
  name: "button-upload",
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
      blobToBase64(file.raw, (data) => this.$emit("imageChange", data));
    },
  },
};
</script>
