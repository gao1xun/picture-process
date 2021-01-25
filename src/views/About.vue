<template>
  <div class="container">
    <el-row :gutter="20">
      <!-- img & canvas -->
      <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18" style="height: 100%">
        <el-row :gutter="30">
          <!-- canvas -->
          <el-col :span="24" class="img-canvas-top">
            <FabricEditor ref="fabricEditor" :bgImageUrl="bgImageUrl" :hostImageUrl="hostImageUrl" :playerImageUrl="playerImageUrl" :filterData="filter"></FabricEditor>
          </el-col>
          <!-- img -->
          <el-col :span="24"  class="img-canvas-bottom">
            <el-row :gutter="20">
              <el-col :span="6"><ImgUpload v-on:imageChange="hostImageUrlChange" :imgsrc="hostImageUrl"></ImgUpload></el-col>
              <el-col :span="6"><ImgUpload v-on:imageChange="playerImageUrlChange" :imgsrc="playerImageUrl"></ImgUpload></el-col>
              <el-col :span="6"><ImgUpload v-on:imageChange="bgImageUrlChange" :imgsrc="bgImageUrl"></ImgUpload></el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
      <!-- img filter -->
      <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6" style="height: 100%">

          
          <el-divider></el-divider>
          <div class="div-checkbox-radio">
            <el-checkbox v-model="filter.grayscaleBool">Grayscale</el-checkbox>
            <div>
              <el-radio v-model="filter.grayscale" label="average">Avg.</el-radio>
              <el-radio v-model="filter.grayscale" label="luminosity">Lum.</el-radio>
              <el-radio v-model="filter.grayscale" label="lightness">Light.</el-radio>
            </div>
          </div>

          <div class="div-checkbox-radio">
            <el-checkbox v-model="filter.invert">Invert</el-checkbox>
          </div>

          <div class="div-checkbox-radio">
            <el-checkbox v-model="filter.sepia">Sepia</el-checkbox>
          </div>

          <div class="div-checkbox-radio">
            <el-checkbox v-model="filter.blackwhite">Black/White</el-checkbox>
          </div>

          <div class="div-checkbox-radio">
            <el-checkbox v-model="filter.brownie">Brownie</el-checkbox>
          </div>

          <div class="div-checkbox-radio">
            <el-checkbox v-model="filter.vintage">Vintage</el-checkbox>
          </div>

          <div class="div-checkbox-radio">
            <el-checkbox v-model="filter.kodachrome">Kodachrome</el-checkbox>
          </div>

          <div class="div-checkbox-radio">
            <el-checkbox v-model="filter.technicolor">Technicolor</el-checkbox>
          </div>

          <div class="div-checkbox-radio">
            <el-checkbox v-model="filter.polaroid">Polaroid</el-checkbox>
          </div>

          <div class="div-slider-flex">
            <span class="demonstration">Brightness</span>
            <el-slider v-model="filter.brightness" :show-tooltip="false" :min="-1" :max="1" :step="0.1"></el-slider>
          </div>
           <div class="div-slider-flex">
            <el-button type="primary"
              @click="downloadImage">download Image</el-button>
          </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import FabricEditor from '../components/img/FabricEditor'
import ImgUpload from "../components/upload/ImgUpload";
import axios from 'axios'
import { getData } from '../util/base64'

const filterInitData = {
  grayscaleBool: false,
  grayscale: 'average',
  invert: false,
  sepia: false,
  blackwhite: false,
  brightness: 0,
  brownie: false,
  vintage: false,
  kodachrome: false,
  technicolor: false,
  polaroid: false,
}

export default {
  name: 'about',
  components: {
    FabricEditor,
    ImgUpload
  },
  data() {
    return {
      hostImageUrl: '',
      playerImageUrl: '',
      bgImageUrl: '',
      

      filter: filterInitData,
    }
  },
  mounted() {
  },
  methods: {
    downloadImage() {
      console.log("...........downloadImage:")
      this.$refs.fabricEditor.$emit('downloadimage', 'downloadImageName')
    },
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
      }) 

    },
    playerImageUrlChange (data) {
      console.log("player......")
      console.log(data)
      this.axiosPost(data, (baseImg) => {
        this.playerImageUrl = baseImg
      }) 
    },
    bgImageUrlChange (data) {
      console.log("bg......")
      console.log(data)
      this.bgImageUrl = data
      // this.hostImageUrl
      // this.playerImageUrl
      // this.bgImageUrl
    },
  
  }
}
</script>

<style scoped>
  .container {
    height: 100vh;
  }
  .el-col {
    /* border: 1px dashed black; */
  }
  .el-row {
    height: 100%;
  }
  .img-canvas-top {
    height: 75%;
  }
  .img-filter-bottom {
    /* height: 25%; */
  }

  .div-slider-flex {
    display: flex;
    padding: 10px 15px;
  }
  .el-slider {
    margin-left: 20px;
    width: 65%;
  }
  .demonstration {
    font-size: 14px;
    line-height: 35px;
  }
  .div-checkbox-radio {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 15px;
  }
  .el-divider {
    margin: 0px 0px;
  }
</style>
