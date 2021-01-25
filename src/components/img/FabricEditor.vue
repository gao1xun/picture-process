<template>
    <div class="div-container">
        <div class="div-canvas" :style="{width: `${width}px`, height: `${height}px`}">
            <canvas id="canvas" :width="width" :height="height"></canvas>
        </div>
    </div>
</template>

<script>
import { fabric } from 'fabric'
import { saveAs } from 'file-saver'
import { getBlob, toFileUrlByBaseData } from '../../util/base64';
export default {
  name: "FabricEditor",
  components: {
  },
  props: ['bgImageUrl', 'hostImageUrl', 'playerImageUrl', 'filterData'],
  data() {
    return {

      imageUrl: '',
      imageId: '',
      width: 700,
      height: 450,

      canvas: undefined,

      filterObj: undefined,
    };
  },
  watch: {
      bgImageUrl(baseData) {
        //   console.log(baseData)
          let imgUrl = toFileUrlByBaseData(baseData)

            fabric.Image.fromURL(imgUrl, (img) => {
                let oImg = img.set({ left: 0, top: 0}).scale(1);
                this.canvas.add(oImg); 
                //Moves an object to the bottom of the stack of drawn objects
                oImg.sendToBack()
                console.log(this.canvas)
            })
      },
      hostImageUrl(baseData) {
          console.log(baseData)
          let imgUrl = toFileUrlByBaseData(baseData)

            fabric.Image.fromURL(imgUrl, (img) => {
                let oImg = img.set({ left: 0, top: 0}).scale(0.5);
                this.canvas.add(oImg); 
            })
      },
      playerImageUrl(baseData) {
          console.log(baseData)
          let imgUrl = toFileUrlByBaseData(baseData)

            fabric.Image.fromURL(imgUrl, (img) => {
                // console
                let oImg = img.set({ left: parseInt(this.width/2), top: 0}).scale(0.5);
                this.canvas.add(oImg); 
            })
      },
    //   'filterData.brightness':(newVal,oldVal) => {
    //     console.log('..................newVal:')
    //     console.log(newVal)
    //     console.log('..................oldVal:')
    //     console.log(oldVal)
    //     console.log(this.width)

    //     // let obj = this.canvas.getActiveObject();
    //     // let brightness = new f.Brightness({
    //     //     brightness: parseFloat(newVal)
    //     // })

    //     // console.log(obj)
    //   },
        'filterData.brightness': {
            handler(newVal, oldVal) {
                console.log('..................newVal:')
                console.log(newVal)
                console.log('..................oldVal:')
                console.log(oldVal)
                let obj = this.canvas.getActiveObject();
                let brightness = new this.filterObj.Brightness({
                    brightness: parseFloat(newVal)
                })
                console.log(obj)
                if (obj.filters.length > 0) {
                    obj.filters[0] = brightness
                } else {
                    obj.filters.push(brightness);

                }
                obj.applyFilters();
                this.canvas.renderAll();
            },
            // immediate: true,
            // deep: true
        }

    //   filterData(filterV) {
    //       console.log('..................filterData:')
    //       console.log(filterV)
    //   }
  },
  mounted() {
    this.canvas = new fabric.Canvas('canvas');

    this.filterObj = fabric.Image.filters

    console.log('.......................filterObj:')
    console.log(this.filterObj)
    // let rect = new fabric.Rect({
    //     top : 50,
    //     left : 100,
    //     width : 100,
    //     height : 70,
    //     fill : 'red'
    // });
    // this.canvas.add(rect);

    this.$on('downloadimage',(imageName)=>{
        this.downloadImage(imageName);
    });
  },
    methods: {
        downloadImage (imageName) {
            let dataURL = this.canvas.toDataURL({
                format: 'png',
            });
            console.log(dataURL)
            let blob = getBlob(dataURL)
            let type = blob.type.split('/')[1];
            if (imageName.split('.').pop() !== type) {
                imageName += '.' + type;
            }

            // // Library: FileSaver - saveAs
            saveAs(blob, imageName);
        }
    }
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
