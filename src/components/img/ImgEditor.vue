<template>
  <div style="height: 200px">
    <input type="file" accept="image/*" v-on:change="selectImage($event)">
    <el-button type="primary"
      @click="loadImage">load img</el-button>
      <el-button type="primary"
      @click="addImage">add img</el-button>
    <tui-image-editor 
      ref="tuiImageEditor"
      :include-ui="useDefaultUI" 
      :options="options"></tui-image-editor>
  </div>
</template>
<script>
import { ImageEditor } from '@toast-ui/vue-image-editor'
import 'tui-color-picker/dist/tui-color-picker.css';
// To use the basic UI, the svg files for the icons is required.
import 'tui-image-editor/dist/svg/icon-a.svg';
import 'tui-image-editor/dist/svg/icon-b.svg';
import 'tui-image-editor/dist/svg/icon-c.svg';
import 'tui-image-editor/dist/svg/icon-d.svg';
// Load Style Code
import 'tui-image-editor/dist/tui-image-editor.css'
// var FileSaver = require('file-saver'); //to download edited image to local. Use after npm install file-saver

// const instance = new ImageEditor(document.querySelector('#tui-image-editor'), {
//   cssMaxWidth: 700,
//   cssMaxHeight: 500,
//   selectionStyle: {
//     cornerSize: 20,
//     rotatingPointOffset: 70,
//   },
// })
  export default {
    components: {
      'tui-image-editor': ImageEditor
    },
    data() {
      return {
        useDefaultUI: false,
        options: { // for tui-image-editor component's "options" prop
            cssMaxWidth: 700,
            cssMaxHeight: 500
        },
        imageUrl: '',
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
      addImage () {
        this.$refs.tuiImageEditor.invoke('addImageObject', this.imageUrl)
          .then(() => {
            console.log("loading....over....")
          })
      }
    }
  }
</script>