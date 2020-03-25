<template>
    <el-pagination background
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page.sync="metaData.page"
                   :page-sizes="[5, 10, 25, 50, 100]"
                   :page-size="metaData.size"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="metaData.total"/>
</template>

<script>
    import {mapState, mapActions} from "vuex";

    export default {
        computed: mapState(["metaData"]),

        methods: {
            ...mapActions(["updateMetaData"]),

            // 监听分页数量改变
            handleSizeChange(val) {
                this.metaData.page = 1
                this.metaData.size = val
                PubSub.publish("updateMetaData")
            },

            // 监听分页页码改变
            handleCurrentChange(val) {
                this.metaData.page = val
                PubSub.publish("updateMetaData")
            }
        }
    };
</script>

<style scoped>
</style>