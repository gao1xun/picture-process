<template>
<el-image
    style="width: 100%; height: 100%"
    :src="src"
    :fit="fit"
    @click="imgClick"
>
    <div slot="error" class="image-slotsss" style="display: flex;justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #f5f7fa;
    color: #909399">
    <i class="el-icon-picture-outline"></i>
    </div>
</el-image>
</template>
<script>
export default {
    name: "imageview",
    props: ['src', 'fit'],
    data () {
        return {}
    },
    methods: {
        imgClick () {
            if (this.src && this.src.length > 0) {
                this.$emit("imageSelection")
            }
        }
    }
}
</script>
<style scoped>
   .image-slotsss {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #f5f7fa;
    color: #909399
}
</style>
