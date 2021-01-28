<template>
  <div class="home">
    <div style="height: 550px">
      <div></div>
      <div
        style="position: absolute;top: 8px;left: 0px;width: 100%"
        :style="{ 'z-index': `${bgImageZindex}` }"
      >
        <ImageEditor :bgImageUrl="bgImageUrl"></ImageEditor>
      </div>
      <div
        style="position: absolute;top: 8px;left: 0px;width: 100%"
        :style="{ 'z-index': `${hostImageZindex}` }"
      >
        <ImageEditor :bgImageUrl="hostImageUrl"></ImageEditor>
      </div>
      <div
        style="position: absolute;top: 8px;left: 0px;width: 100%"
        :style="{ 'z-index': `${playerImageZindex}` }"
      >
        <ImageEditor :bgImageUrl="playerImageUrl"></ImageEditor>
      </div>
    </div>
    <div class="container">
      <div class="left">
        <!-- <div class="maindiv">
          <el-image class="main-image" :src="mainImageUrl">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </div> -->
        <el-row :gutter="20">
          <el-col :span="6"
            ><ImgUpload
              v-on:imageChange="hostImageUrlChange"
              :imgsrc="hostImageUrl"
            ></ImgUpload
          ></el-col>
          <el-col :span="6"
            ><ImgUpload
              v-on:imageChange="playerImageUrlChange"
              :imgsrc="playerImageUrl"
            ></ImgUpload
          ></el-col>
          <el-col :span="6"
            ><ImgUpload
              v-on:imageChange="bgImageUrlChange"
              :imgsrc="bgImageUrl"
            ></ImgUpload
          ></el-col>
          <!-- <el-col :span="6"><el-button type="primary" @click="merginImgs">mergin</el-button></el-col> -->
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6"
            ><el-button type="primary" @click="selectHost"
              >host select</el-button
            ></el-col
          >
          <el-col :span="6"
            ><el-col :span="6"
              ><el-button type="primary" @click="selectPlayer"
                >player select</el-button
              ></el-col
            ></el-col
          >
          <el-col :span="6"
            ><el-col :span="6"
              ><el-button type="primary" @click="selectBg"
                >bg select</el-button
              ></el-col
            ></el-col
          >
          <!-- <el-col :span="6"><el-button type="primary" @click="merginImgs">mergin</el-button></el-col> -->
        </el-row>
      </div>
      <div class="right">
        <!-- <div><el-button type="primary" @click="uploadAllImage">save</el-button></div> -->
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import ImgUpload from "../components/upload/ImgUpload";
import axios from "axios";
import { getData } from "../util/base64";
import { mergeImg } from "../util/imgUtil";
import ImageEditor from "../components/img/ImageEditor";

import $ from "jquery";

export default {
  name: "Home",
  components: {
    ImgUpload,
    ImageEditor
  },
  data() {
    return {
      mainImageUrl: "",
      hostImageUrl: "",
      playerImageUrl: "",
      bgImageUrl: "",
      baseImageList: [],

      initZindex: 3000,
      bgImageZindex: 3000,
      hostImageZindex: 2999,
      playerImageZindex: 2998
    };
  },
  mounted() {
    // console.log('mounted.........')
    // console.log($('.bg-transparent div'))

    $(".tui-image-editor-container").css("background-color", "transparent");
    $(".tui-image-editor-main-container").css(
      "background-color",
      "transparent"
    );
    $(".tui-image-editor-canvas-container").css(
      "background-color",
      "transparent"
    );
  },
  methods: {
    selectHost() {
      this.hostImageZindex = this.initZindex;
      this.playerImageZindex = this.initZindex - 1;
      this.bgImageZindex = this.initZindex - 2;
    },
    selectPlayer() {
      this.playerImageZindex = this.initZindex;
      this.hostImageZindex = this.initZindex - 1;
      this.bgImageZindex = this.initZindex - 2;
    },
    selectBg() {
      this.bgImageZindex = this.initZindex;
      this.hostImageZindex = this.initZindex - 1;
      this.playerImageZindex = this.initZindex - 2;
    },
    axiosPost(data, successFunc) {
      let baseHeader = data.substr(0, data.indexOf("base64,") + 7);
      console.log("...........baseType:" + baseHeader);
      let baseData = getData(data);

      axios
        .post(
          "https://demosegmentportraitpic.weshow.demo.wejoin.chat:443/api/SegmentPortraitPic",
          { imgBase64: baseData }
        )
        .then(response => {
          console.log(response.data.response.resultImage);
          successFunc(baseHeader + response.data.response.resultImage);
        })
        .catch(error => {
          console.log(error);
        });
    },
    hostImageUrlChange(data) {
      console.log("host......");
      console.log(data);

      this.axiosPost(data, baseImg => {
        this.hostImageUrl = baseImg;
        this.baseImageList.push(this.hostImageUrl);
      });
    },
    playerImageUrlChange(data) {
      console.log("player......");
      console.log(data);
      this.axiosPost(data, baseImg => {
        this.playerImageUrl = baseImg;
        this.baseImageList.push(this.playerImageUrl);
      });
    },
    bgImageUrlChange(data) {
      console.log("bg......");
      console.log(data);
      this.bgImageUrl = data;
      // this.hostImageUrl
      // this.playerImageUrl
      // this.bgImageUrl
    },
    merginImgs() {
      mergeImg(
        this.baseImageList,
        mergeData => (this.mainImageUrl = mergeData)
      );
    },
    uploadAllImage() {
      console.log("upload all .....");
    }
  }
};
</script>

<style lang="stylus" scoped>
.home {
  height: 100%
}
.maindiv {
  height 70%
  background-color: #f9fafc
  padding 30px
}
.main-image {
  height 100%
  width 100%
}
.image-slot {
  height 100%
  display flex
  justify-content center
}
.container {
  display: flex
  padding-bottom: 20px
  height: 100%
  width: 100%
}
.left {
  width: 75%
}
.right {
  width: 25%
}
.left-bottom {
  display flex
}
.row-bg {
  padding: 10px 0
  background-color: #f9fafc
}
</style>
