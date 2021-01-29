<template>
  <div class="div-container">
    <div
      class="div-canvas"
      :style="{ width: `${width}px`, height: `${height}px` }"
    >
      <canvas id="canvas" :width="width" :height="height"></canvas>
    </div>
  </div>
</template>

<script>
import { fabric } from "fabric";
import { saveAs } from "file-saver";
import { getBlob } from "../../util/base64";

const filterTypeArr = ["brightness", "contrast", "saturation", "noise"];

const selectionBorder = {
  borderColor: 'red',
  cornerColor: 'green',
  cornerSize: 6,
  transparentCorners: false,
  hasControls: true, 
  lockMovementX: false, 
  lockMovementY: false,
  centeredScaling: true,
  centeredRotation: true,
}

export default {
  name: "FabricEditor",
  components: {},
  props: {
    bgImageUrl: {
      type: String,
      default: "",
    },
    hostImageUrl: {
      type: String,
      default: "",
    },
    playerImageUrl: {
      type: String,
      default: "",
    },
    width: {
      type: Number,
      default: 700,
    },
    height: {
      type: Number,
      default: 400,
    },
    filterData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  // ["bgImageUrl", "hostImageUrl", "playerImageUrl", "filterData"],
  data() {
    return {
      imageUrl: "",
      imageId: "",

      canvas: undefined,

      filterObj: undefined,

      bgImageObj: undefined,
      hostImageObj: undefined,
      playerImageObj: undefined,

      imgList: []
    };
  },
  watch: {
    bgImageUrl(imgUrl) {
      //   console.log(imgUrl)

      fabric.Image.fromURL(imgUrl, (img) => {
        console.log('...................canvas:')
        console.log(img.width)
        console.log(img.height)
        this.bgImageObj = img.set({ originX: 'left', originY: 'top' }).scale(0.5);
        // this.canvas.add(this.bgImageObj);
        this.canvas.setBackgroundImage(this.bgImageObj, () => this.canvas.renderAll());
        //Moves an object to the bottom of the stack of drawn objects
        // this.bgImageObj.sendToBack();
        // console.log(this.canvas);
      });
    },
    hostImageUrl(imgUrl) {
      console.log(imgUrl);

      this.loadHostImage(imgUrl)
    },
    playerImageUrl(imgUrl) {
      console.log(imgUrl);

      this.loadplayerImage(imgUrl)
    },
    "filterData.brightness": {
      //newVal, oldVal
      handler(newVal) {
        let type = filterTypeArr[0];
        let brightness = new this.filterObj.Brightness({
          brightness: parseFloat(newVal),
          filterType: type,
        });
        this.updateFilter(brightness, type);
      },
      // immediate: true,
      // deep: true
    },
    "filterData.contrast": {
      //newVal, oldVal
      handler(newVal) {
        //contrast
        let type = filterTypeArr[1];
        let contrast = new this.filterObj.Contrast({
          contrast: parseFloat(newVal),
          filterType: type,
        });
        this.updateFilter(contrast, type);
      },
      // immediate: true,
      // deep: true
    },
    "filterData.saturation": {
      //, oldVal
      handler(newVal) {
        //saturation
        let type = filterTypeArr[2];
        let saturation = new this.filterObj.Saturation({
          saturation: parseFloat(newVal),
          filterType: type,
        });
        this.updateFilter(saturation, type);
      },
      // immediate: true,
      // deep: true
    },
    "filterData.noise": {
      //, oldVal
      handler(newVal) {
        //noise
        let type = filterTypeArr[3];
        let noise = new this.filterObj.Noise({
          noise: parseInt(newVal),
          filterType: type,
        });
        this.updateFilter(noise, type);
      },
      // immediate: true,
      // deep: true
    },
  },
  mounted() {
    this.canvas = new fabric.Canvas("canvas");

    this.filterObj = fabric.Image.filters;

    console.log(".......................filterObj:");
    console.log(this.filterObj);
    // let rect = new fabric.Rect({
    //     top : 50,
    //     left : 100,
    //     width : 100,
    //     height : 70,
    //     fill : 'red'
    // });
    // this.canvas.add(rect);

    this.$on("downloadimage", (imageName) => {
      this.downloadImage(imageName);
    });

    this.$on("setActiveObject", (flag) => this.setActiveObject(flag))

    this.$on("reset", () => {
      console.log(".....host reset")
      console.log(this.imgList)
      console.log(this.hostImageObj)
      console.log(this.imgList[0] === this.hostImageObj)
      console.log(this.imgList[0] === this.playerImageObj)

      this.canvas.remove(this.hostImageObj);
      this.canvas.remove(this.playerImageObj);
      this.loadHostImage(this.hostImageUrl)
      this.loadplayerImage(this.playerImageUrl)
      // this.hostImageObj.setSrc(this.hostImageUrl)
      this.canvas.renderAll();
    })

    this.canvas.on("selection:created", (obj) => {
      console.log(".............selection:created:")
      console.log(obj)
      console.log(obj.selected[0] === this.hostImageObj)
      if (obj.selected[0] === this.hostImageObj) {
        this.$emit('activeChange', 'host')
      } else if ((obj.selected[0] === this.playerImageObj)) {
        this.$emit('activeChange', 'player')
      }
    })
    this.canvas.on("selection:updated", (obj) => {
      console.log(".............selection:updated:")
      console.log(obj)
      console.log(obj.selected[0] === this.hostImageObj)
      if (obj.selected[0] === this.hostImageObj) {
        this.$emit('activeChange', 'host')
      } else if ((obj.selected[0] === this.playerImageObj)) {
        this.$emit('activeChange', 'player')
      }
    })
  },
  methods: {
    loadHostImage (imgUrl) {
      fabric.Image.fromURL(imgUrl, (img) => {
        this.hostImageObj = img.set({ ...selectionBorder, left: 0, top: 0 }).scale(0.5)
          // .setControlVisible("ml", false)
          // .setControlVisible("mb", false)
          // .setControlVisible("mr", false)
          // .setControlVisible("mt", false)
          .setControlVisible("mtr", false)
        this.canvas.add(this.hostImageObj);
      });
    },
    loadplayerImage (imgUrl) {
      fabric.Image.fromURL(imgUrl, (img) => {
        // console
        this.playerImageObj = img
          .set({ ...selectionBorder, left: parseInt(this.width / 2), top: 0 })
          .scale(0.5)
          // .setControlVisible("ml", false)
          // .setControlVisible("mb", false)
          // .setControlVisible("mr", false)
          // .setControlVisible("mt", false)
          .setControlVisible("mtr", false);
        this.canvas.add(this.playerImageObj);

      });
    },
    setActiveObject (flag) {
      // if (flag === 'bgImage') {
      //   this.canvas.setActiveObject(this.bgImageObj)
      // } else 
      if (flag === 'hostImage') {
        this.canvas.setActiveObject(this.hostImageObj)
        this.canvas.renderAll();
      } else if (flag === 'playerImage') {
        this.canvas.setActiveObject(this.playerImageObj)
      this.canvas.renderAll();
      }
    },
    downloadImage(imageName) {
      let dataURL = this.canvas.toDataURL({
        format: "png",
        multiplier: 2
      });
      console.log(dataURL);
      let blob = getBlob(dataURL);
      let type = blob.type.split("/")[1];
      if (imageName.split(".").pop() !== type) {
        imageName += "." + type;
      }

      // // Library: FileSaver - saveAs
      saveAs(blob, imageName);
    },
    updateFilter(filter, type) {
      let obj = this.canvas.getActiveObject();
      console.log(obj);
      if (obj && !obj._objects) {
        //不是选中多个图片
        let index = obj.filters.findIndex((item) => item.filterType === type);
        if (index > -1) {
          obj.filters[index] = filter;
        } else {
          obj.filters.push(filter);
        }
        obj.applyFilters();
        this.canvas.renderAll();
      }
    },
  },
};
</script>
<style scoped>
.div-container {
  display: flex;
  justify-content: center;
}
.div-canvas {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAABemlDQ1BJQ0MgUHJvZmlsZQAAKM9jYGAqSSwoyGFhYGDIzSspCnJ3UoiIjFJgv8PAzcDDIMRgxSCemFxc4BgQ4MOAE3y7xsAIoi/rgsxK8/x506a1fP4WNq+ZclYlOgz4AXdKanEyAwMjB5CdnFKcnAtk5wDZOskFRSVA9gwgW7e8pADEPgFkixQBHQhk3wGx0yHsDyB2EpjNxAJWExLkDGRLANkCSRC2BoidDmFbgNjJGYkpQLYHyC6IG8CA08NFwdzAUteRgcogN6cUZgcotHhS80KDQe4AYhkGDwYXBgUGcwYDBksGXQbHktSKEpBC5/yCyqLM9IwSBUdgyKYqOOfnFpSWpBbpKHjmJevpKBgZGBqA1IHiDGL05yCw6Yxi5xFi+QsZGCyVGRiYexBiSdMYGLbvYWCQOIUQU5nHwMBvzcCw7VxBYlEi3OGM31gI8YvTjI0gbB4nBgbWe///f1ZjYGCfxMDwd+L//78X/f//dzHQfmCcHcgBACR3aeD10IV6AAAACXBIWXMAAA7EAAAOxAGVKw4bAAABnGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4xMTA8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+OTk8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KydpWSQAAACVJREFUKFNj/Pnz538GIgFYMRsbG5SLHzBBaaLAqGJkQCvFDAwAlKIH+ycXcc8AAAAASUVORK5CYII=);
  background-color: #fff;
  border: 1px solid #c1c1c1;
}
</style>
