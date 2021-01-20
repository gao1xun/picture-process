<template>
  <div class="home">
      <div><ImgEditor></ImgEditor></div>
    <div class="container">
      <div class="left">
        <div class="maindiv">
          <el-image class="main-image" :src="mainImageUrl">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </div>
        <el-row :gutter="20">
          <el-col :span="6"><ImgUpload v-on:imageChange="hostImageUrlChange" :imgsrc="hostImageUrl"></ImgUpload></el-col>
          <el-col :span="6"><ImgUpload v-on:imageChange="playerImageUrlChange" :imgsrc="playerImageUrl"></ImgUpload></el-col>
          <el-col :span="6"><ImgUpload v-on:imageChange="bgImageUrlChange"></ImgUpload></el-col>
          <el-col :span="6"><el-button type="primary" @click="merginImgs">mergin</el-button></el-col>
        </el-row>
      </div>
      <div class="right">
        
        <div style="float: bottom;"><el-button type="primary" @click="uploadAllImage">save</el-button></div>
      </div>
    </div>
    
  </div>
</template>

<script>
// @ is an alias to /src
import ImgUpload from "../components/upload/ImgUpload";
import axios from 'axios'
import { getData } from '../util/base64'
import { mergeImg } from '../util/imgUtil'
import ImgEditor from '../components/img/ImgEditor'

export default {
  name: "Home",
  components: {
    ImgUpload,
    ImgEditor
  },
  data() {
    return {
      mainImageUrl: '',
      hostImageUrl: '',
      playerImageUrl: '',
      bgImageUrl: '',
      baseImageList: []
    }
  },
  methods: {
    axiosPost (data, successFunc) {
      let baseHeader = data.substr(0, data.indexOf("base64,") + 7) 
      console.log("...........baseType:" + baseHeader)
      let baseData = getData(data)

      axios.post('https://demosegmentportraitpic.weshow.demo.wejoin.chat:443/api/SegmentPortraitPic', 
        {imgBase64 : baseData}
      )
      .then((response) => {
          console.log(response.data.response.resultImage)
          successFunc(baseHeader + response.data.response.resultImage)
         
      })
      .catch((error) => {
          console.log(error)
      })
    },
    hostImageUrlChange (data) {
      console.log("host......")
      console.log(data)

      this.axiosPost(data, (baseImg) => {
          this.hostImageUrl = baseImg
          this.baseImageList.push(this.hostImageUrl)
      }) 


    },
    playerImageUrlChange (data) {
      console.log("player......")
      console.log(data)
      this.axiosPost(data, (baseImg) => {
        this.playerImageUrl = baseImg
        this.baseImageList.push(this.playerImageUrl)
      }) 
    },
    bgImageUrlChange (data) {
      console.log("bg......")
      console.log(data)
    },
    merginImgs() {
      mergeImg(this.baseImageList, (mergeData) => this.mainImageUrl = mergeData)
    },
    uploadAllImage () {
      console.log("upload all ...")
    },
  
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
