<template>
    <quill-editor v-model="content" :options="editorOption">
        <div id="toolbar1" slot="toolbar">
            <button class="ql-bold" title="加粗">Bold</button>
            <button class="ql-italic" title="斜体">Italic</button>
            <button class="ql-underline" title="下划线">underline</button>
            <button class="ql-strike" title="删除线">strike</button>
            <button class="ql-blockquote" title="引用"></button>
<!--            <button class="ql-header" value="1" title="标题1"></button>-->
<!--            <button class="ql-header" value="2" title="标题2"></button>-->
            <button class="ql-list" value="ordered" title="有序列表"></button>
            <button class="ql-list" value="bullet" title="无序列表"></button>
            <select class="ql-align" value="align" title="对齐"></select>
            <select class="ql-header" title="段落格式">
                <option selected>段落</option>
                <option value="1">标题1</option>
                <option value="2">标题2</option>
                <option value="3">标题3</option>
                <option value="4">标题4</option>
                <option value="5">标题5</option>
                <option value="6">标题6</option>
            </select>
            <select class="ql-size" title="字体大小">
                <option value="10px">10px</option>
                <option value="12px" selected>12px</option>
                <option value="14px">14px</option>
                <option value="16px">16px</option>
                <option value="18px">18px</option>
                <option value="20px">20px</option>
                <option value="22px">22px</option>
                <option value="24px">24px</option>
            </select>
            <select class="ql-font" title="字体">
                <option value="Microsoft-YaHei" selected="selected">微软雅黑</option>
            </select>
            <select class="ql-color" value="color" title="字体颜色"></select>
            <select class="ql-background" value="background" title="背景颜色"></select>
            <button class="ql-image" value="image" title="添加图片"><i class="iconfont icon-tupian"/></button>
        </div>
    </quill-editor>
</template>

<script>
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'
    import { Quill, quillEditor } from 'vue-quill-editor'

    // 图片可收缩
    import {ImageDrop} from './ImageDrop.js'
    import ImageResize from 'quill-image-resize-module'
    Quill.register('modules/imageDrop', ImageDrop)
    Quill.register('modules/imageResize', ImageResize)

    // 自定义字体大小
    let Size = Quill.import('attributors/style/size')
    Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '22px', '24px']
    Quill.register(Size, true)

    // 自定义字体类型
    var fonts = ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial', 'Times-New-Roman', 'sans-serif']
    var Font = Quill.import('formats/font')
    Font.whitelist = fonts  // 将字体加入到白名单
    Quill.register(Font, true)

    export default {
        components: {
            quillEditor,
        },

        data () {
            return {
                content: '',
                /*toolbarTips: [
                    {Choice:'.ql-bold',title:'加粗'},
                    {Choice:'.ql-italic',title:'倾斜'},
                    {Choice:'.ql-underline',title:'下划线'},
                    {Choice:'.ql-strike',title:'删除线'},
                    {Choice:'.ql-code-block',title:'插入代码段'},
                    {Choice:'.ql-size',title:'字体大小'},
                    {Choice:'.ql-list[value="ordered"]',title:'编号列表'},
                    {Choice:'.ql-list[value="bullet"]',title:'项目列表'},
                    {Choice:'.ql-align',title:'对齐方式'},
                    {Choice:'.ql-color',title:'字体颜色'},
                    {Choice:'.ql-background',title:'背景颜色'},
                    {Choice:'.ql-image',title:'添加图片'},
                    {Choice:'.ql-video',title:'视频'},
                    {Choice:'.ql-link',title:'添加链接'},
                    {Choice:'.ql-clean',title:'清除格式'},
                    {Choice:'.ql-indent[value="-1"]',title:'向左缩进'},
                    {Choice:'.ql-indent[value="+1"]',title:'向右缩进'},
                    {Choice:'.ql-header .ql-picker-label',title:'标题大小'},
                    {Choice:'.ql-font',title:'字体选择'},
                ],*/
                editorOption:{
                    modules:{
                        imageDrop: true, // 拖动加载图片组件
                        imageResize: {
                            displayStyles: {
                                backgroundColor: 'black',
                                border: 'none',
                                color: 'white'
                            },
                            modules: ['Resize', 'DisplaySize', 'Toolbar']
                        },
                        toolbar: '#toolbar1',
                        // toolbar1:[
                        //     ['bold', 'italic', 'underline', 'strike', 'code-block', {'size': ['small', false, 'large', 'huge']}, {'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'},
                        //         { 'font': [] }, {'align': []}, {'header': [1, 2, 3, 4, 5, 6, false]}, {'color': []}, {'background': []}, 'image', 'link', 'clean'
                        //     ],
                        // ],
                    },
                }
            }
        },

        watch: {
            content: function (value) {
                PubSub.publish('editorChange1', value)
            }
        },

        mounted() {
            /*for(let item of this.toolbarTips){
                let tip = document.querySelector('.quill-editor '+ item.Choice)
                if (! tip) continue
                tip.setAttribute('title', item.title)
            }*/
            PubSub.subscribe('editorInit1', (msg, value) => this.content = value)
        },
    }
</script>

<style>
    #toolbar1 .ql-snow.ql-toolbar1 button,
    #toolbar1 .ql-snow .ql-picker {
        border: 1px #b7b7b7 solid;
        margin-right: 5px;
    }
    #toolbar1 .ql-snow .ql-picker-label::before {
        position: relative;
        top: -9px;
    }
    #toolbar1 .ql-snow .ql-picker.ql-header {
        width: 90px;
    }
    #toolbar1 .ql-snow .ql-picker.ql-size {
        width: 65px;
    }
    #toolbar1 .ql-snow .ql-picker.ql-font {
        width: 90px;
    }
    #toolbar1 .ql-snow .ql-color-picker .ql-picker-label svg,
    #toolbar1 .ql-snow .ql-icon-picker .ql-picker-label svg {
        top: -8px;
        left: 0px;
        position: relative;
    }
</style>
