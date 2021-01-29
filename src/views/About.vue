<template>
  <div class="container">
    <el-row :gutter="20">
      <!-- img & canvas -->
      <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18" style="height: 100%">
        <el-row >
          <!-- canvas -->
          <el-col :span="24" class="img-canvas-top">
            <FabricEditor
              ref="fabricEditor"
              :width="canvasWidth"
              :height="canvasHeight"
              :bgImageUrl="bgImageUrl"
              :hostImageUrl="hostImageUrl"
              :playerImageUrl="playerImageUrl"
              :filterData="filter"
              v-on:activeChange="setActiveFilterType"
            ></FabricEditor>
          </el-col>

        </el-row>
      </el-col>
      <!-- img filter -->
      <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6" class="col-slider">
        <!-- <div class="div-checkbox-radio">
          <el-checkbox v-model="filter.grayscaleBool">Grayscale</el-checkbox>
          <div>
            <el-radio v-model="filter.grayscale" label="average">Avg.</el-radio>
            <el-radio v-model="filter.grayscale" label="luminosity"
              >Lum.</el-radio
            >
            <el-radio v-model="filter.grayscale" label="lightness"
              >Light.</el-radio
            >
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
        </div> -->

        <div class="div-slider-flex">
          <span class="demonstration">明瞭度: {{ filter.brightness }}</span>
          <el-slider
            v-model="filter.brightness"
            :show-tooltip="false"
            :min="-1"
            :max="1"
            :step="0.1"
          ></el-slider>
        </div>

        <div class="div-slider-flex">
          <span class="demonstration">コントラスト: {{ filter.contrast }}</span>
          <el-slider
            v-model="filter.contrast"
            :show-tooltip="false"
            :min="-1"
            :max="1"
            :step="0.1"
          ></el-slider>
        </div>

        <div class="div-slider-flex">
          <span class="demonstration">飽和: {{ filter.saturation }}</span>
          <el-slider
            v-model="filter.saturation"
            :show-tooltip="false"
            :min="-1"
            :max="1"
            :step="0.1"
          ></el-slider>
        </div>

        <div class="div-slider-flex">
          <span class="demonstration">ノイズ: {{ filter.noise }}</span>
          <el-slider
            v-model="filter.noise"
            :show-tooltip="false"
            :min="0"
            :max="1000"
          ></el-slider>
        </div>

        <div class="div-slider-flex button-save" style="display: block">
          <el-button type="primary" @click="downloadImage"
            >保存</el-button
          >
          <el-button type="primary" @click="resetImage"
            >reset</el-button
          >
        </div>
      </el-col>
    </el-row>
    <el-row>
                <!-- img -->
          <el-col :span="24" class="img-canvas-bottom">
            <el-row :gutter="20">
              <el-col :span="8" class="col-img-view">
                <!-- <ImgUpload
                  v-on:imageChange="hostImageUrlChange"
                  :imgsrc="hostImageUrl"></ImgUpload> -->

                <ImageView :src="hostImageUrl" :fit="`contain`" v-on:imageSelection="selectHost"></ImageView>
              </el-col>
              <el-col :span="8" class="col-img-view">
                <!-- <ImgUpload
                  v-on:imageChange="playerImageUrlChange"
                  :imgsrc="playerImageUrl"
                ></ImgUpload> -->
                <ImageView :src="playerImageUrl" :fit="`contain`" v-on:imageSelection="selectPlayer"></ImageView>
              </el-col>
              <el-col :span="8" class="col-img-view">
                <!-- <ImgUpload
                  v-on:imageChange="bgImageUrlChange"
                  :imgsrc="bgImageUrl"></ImgUpload> -->
                <ImageView :src="bgImageUrl" :fit="`contain`" ></ImageView>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="8"
                >
                <ButtonUpload v-on:imageChange="hostImageUrlChange"></ButtonUpload>
                </el-col
              >
              <el-col :span="8"
                ><ButtonUpload v-on:imageChange="playerImageUrlChange"></ButtonUpload></el-col
              >
              <el-col :span="8"
                ><ButtonUpload v-on:imageChange="bgImageUrlChange"></ButtonUpload></el-col
              >
            </el-row>
          </el-col>
    </el-row>
  </div>
</template>
<script>
import FabricEditor from "../components/img/FabricEditor";
// import ImgUpload from "../components/upload/ImgUpload";
import ImageView from "../components/img/ImageView";
import ButtonUpload from "../components/upload/ButtonUpload";
import axios from "axios";
import { getData, toFileUrlByBaseData } from "../util/base64";
import { isMobile } from "../util/mobile"

const filterInitData = {
  // grayscaleBool: false,
  // grayscale: "average",
  // invert: false,
  // sepia: false,
  // blackwhite: false,
  // brownie: false,
  // vintage: false,
  // kodachrome: false,
  // technicolor: false,
  // polaroid: false,

  brightness: 0,
  contrast: 0,
  saturation: 0,
  noise: 0,
};

export default {
  name: "about",
  components: {
    FabricEditor,
    ImageView,
    ButtonUpload
    // ImgUpload,
  },
  data() {
    return {
      canvasHeight: 360,//parseInt(document.documentElement.clientHeight * 0.6) ,
      canvasWidth: isMobile() ? (document.documentElement.clientWidth - 40) : 640,//parseInt(document.documentElement.clientWidth * 0.6),//
      hostImageUrl: "",
      playerImageUrl: "",
      bgImageUrl: "",

      filter: JSON.parse(JSON.stringify(filterInitData)),
      hostFilter: JSON.parse(JSON.stringify(filterInitData)),
      playerFilter: JSON.parse(JSON.stringify(filterInitData)),
      activeFilter: '',
    };
  },
  mounted() {},
  computed: {
    // filter: {
    //   // getter
    //   get: function () {
    //     if (this.activeFilter === 'host') {
    //       return this.newFilter(this.hostFilter)
    //     } else if (this.activeFilter === 'player') {
    //       return this.newFilter(this.playerFilter)
    //     } else {
    //       return this.newFilter(filterInitData)
    //     }
    //   },
    //         // setter
    //   set: function (newValue) {
    //     console.log(newValue)
    //   }
    // }
  },
  watch: {
    activeFilter(val, oldval) {
      console.log('.......activeFilter:')
      console.log(val)
      console.log(oldval)
      if (val === 'host') {
        if (oldval === 'player') {
          this.playerFilter = this.newFilter(this.filter) 
        }
        this.filter = this.newFilter(this.hostFilter) 
      } else if (val === 'player') {
        if (oldval === 'host') {
          this.hostFilter = this.newFilter(this.filter) 
        }
        this.filter = this.newFilter(this.playerFilter) 
      }
    }
  },
  methods: {
    setActiveFilterType(type) {
      this.activeFilter = type
    },
    newFilter (fil) {
      return JSON.parse(JSON.stringify(fil))
    },
    selectHost() {
      this.activeFilter = 'host'
      this.$refs.fabricEditor.$emit("setActiveObject", "hostImage");
    },
    selectPlayer() {
      this.activeFilter = 'player'
      this.$refs.fabricEditor.$emit("setActiveObject", "playerImage");
    },
    resetImage() {
      this.filter = this.newFilter(filterInitData)
      this.hostFilter = this.newFilter(filterInitData)
      this.playerFilter = this.newFilter(filterInitData)
      this.$refs.fabricEditor.$emit("reset");
    },
    downloadImage() {
      console.log("...........downloadImage:");
      this.$refs.fabricEditor.$emit("downloadimage", "downloadImageName");
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
        .then((response) => {
          let imgUrl = toFileUrlByBaseData(
            baseHeader + response.data.response.resultImage
          );
          successFunc(imgUrl);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    hostImageUrlChange(data) {
      console.log("host......");
      console.log(data);

      this.axiosPost(data, (imgUrl) => {
        this.hostImageUrl = imgUrl;
      });
    },
    playerImageUrlChange(data) {
      console.log("player......");
      console.log(data);
      this.axiosPost(data, (imgUrl) => {
        this.playerImageUrl = imgUrl;
      });
    },
    bgImageUrlChange(data) {
      console.log("bg......");
      console.log(data);
      let imgUrl = toFileUrlByBaseData(data);
      this.bgImageUrl = imgUrl;
      // this.hostImageUrl
      // this.playerImageUrl
      // this.bgImageUrl
    },
  },
};
</script>

<style scoped>
.container {
  height: 100%;
  padding: 20px 30px;
  overflow-y: auto;
}
.el-col {
  /* border: 1px dashed black; */
}
.el-row {
  /* height: 100%; */
}
.img-canvas-top {
  /* height: 75%; */
}
.img-canvas-bottom {
  /* height: 25%; */
  width: 75%;
  margin-top: 30px;
}
.col-slider {
  height: 100%;
}
.div-slider-flex {
  display: flex;
  padding: 10px 15px;
  flex-direction: column;
  align-items: flex-start;
}
.el-slider {
  margin-left: 0px;
  width: 65%;
}
.demonstration {
  font-size: 14px;
  line-height: 14px;
  text-align: left;
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
.button-save {
  margin-top: 60px;
}
.col-img-view {
  height: 200px;
}

@media screen and (max-width: 767px){
  .col-slider {
    margin-top: 10px;
  }
  .div-slider-flex {
    padding: 0px 15px;
  }
  .button-save {
    margin-top: 10px;
  }
  .img-canvas-bottom {
    width: 100%;
    margin-bottom: 130px;
  }
  .col-img-view {
    height: 100px;
  }
}

</style>
