<template>
    <div style="height: 550px">
    <!-- <input type="file" accept="image/*" v-on:change="selectImage($event)">
    <el-button type="primary"
        @click="loadImage">load img</el-button>
        <el-button type="primary"
        @click="addImage">add img</el-button> -->
    <tui-image-editor ref="tuiImageEditor" :include-ui="useDefaultUI" :options="options"></tui-image-editor>
    </div>
</template>

<script>
import { ImageEditor } from "@toast-ui/vue-image-editor";
// To use the basic UI, the svg files for the icons is required.


// Load Style Code
import "tui-image-editor/dist/tui-image-editor.css";
// to use download feature
import "file-saver";

//
import { editorOptions } from './imageEditorConstant'
import { blobToFile, getBlob } from '../../util/base64';

export default {
  name: "ImageEditor",
  components: {
    "tui-image-editor": ImageEditor
  },
  props: ['bgImageUrl', 'hostImageUrl', 'playerImageUrl'],
  data() {
    return {
      useDefaultUI: true,
      //document.documentElement.clientWidth, document.documentElement.clientHeight
      options: editorOptions(700, 500),

      imageUrl: ''
    };
  },
  watch: {
      bgImageUrl(baseData) {
          console.log('........obj:.')
          let imgfile = blobToFile(getBlob(baseData), 'name2.jpg')
          console.log(imgfile)
          console.log(getBlob(baseData))
          let bgImgUrl = URL.createObjectURL(getBlob(baseData))

        this.$refs.tuiImageEditor.invoke('loadImageFromURL', bgImgUrl, 'bgimage')
            .then((objectProps) => {
            console.log("loading bg....over....")
            console.log(objectProps)

            if (this.hostImageUrl) {
                let hostImg = URL.createObjectURL(getBlob(this.hostImageUrl))
                this.addImageFunc(hostImg)
            }
            setTimeout(() => {

                if (this.playerImageUrl) {
                    let playerImg = URL.createObjectURL(getBlob(this.playerImageUrl))
                    this.addImageFunc(playerImg)
                }
            }, 1000)

        }).finally(() => {
            
            
        })

      }
  },
    methods: {
        
        selectImage(event) {
            console.log(event.target.files[0])
            this.imageUrl = URL.createObjectURL(event.target.files[0])
        },
        loadImage () {
        this.$refs.tuiImageEditor.invoke('loadImageFromURL', this.imageUrl, 'My sample image')
            .then(() => {
            console.log("loading....over....")
            })
        },
        addImageFunc (imgFile) {
            this.$refs.tuiImageEditor.invoke('addImageObject', imgFile)
                .then((objectProps) => {
                console.log("addImageObject....over....")
                console.log(objectProps)


                // this.$refs.tuiImageEditor.invoke('changeShape', objectProps.id, {
                //     fill: 'red',
                //     stroke: 'blue',
                //     strokeWidth: 3,
                //     width: 600,
                //     height: 600
                // })

                // this.$refs.tuiImageEditor.invoke('setObjectProperties', objectProps.id, {
                //     left:100,
                //     top:100,
                //     width: 150,
                //     height: 150,
                //     // opacity: 0.5
                // })
                })
            },
        addImage () {
            this.addImageFunc(this.imageUrl)
        },

    }
};
</script>
