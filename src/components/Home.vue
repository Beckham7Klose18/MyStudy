<template>
    <el-container class="homeContainer">
        <el-header height="70" style="padding: 0;">
            <MJHeader/>
        </el-header>
        <el-container class="homeContainer" style="height: 100%;">
            <el-aside :width="isc? '65px': '180px'" style="overflow-x: hidden;">
                <div class="toggle_btn" @click="isc = ! isc">
                    <i class="el-icon-s-unfold" v-show="isc"/>
                    <i class="el-icon-s-fold" v-show="! isc"/>
                </div>
                <el-menu router background-color="#f3f3f3" text-color="#666" active-text-color="#fff"
                     :collapse-transition="false" :default-active="$route.matched[1] && $route.matched[1].path"
                     :collapse="isc" @select="loadingOpen" @open="menuOpen" :default-openeds="['1']">
                  <!--          :default-openeds="['11']"    -->
                    <template v-for="(item,index) in routes">
                        <el-submenu :index="index.toString()">
                            <template slot="title">
                                <i :class="item.meta.icon"/>
                                <span slot="title" style="font-weight: bold;">{{item.name}}</span>
                            </template>
                            <el-menu-item v-for="(child, index) in item.children" :index="child.path" :class="{even: index%2 == 1}">
                                <el-badge v-if="elBadgeValue(item.name, child.name)" :value="elBadgeValue(item.name, child.name)" style="color: #a2a21a;">{{child.name}}</el-badge>
                                <span v-if="! elBadgeValue(item.name, child.name)" style="color: #a2a21a;">{{child.name}}</span>
                            </el-menu-item>
                        </el-submenu>
                    </template>
                </el-menu>
            </el-aside>
            <el-main>
                <el-row style="margin-bottom: 10px;">
                    <MJ_BreadCrumb/>
                </el-row>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import {mapState, mapActions} from "vuex";
    const MJHeader = () => import('./container/MJ_Header.vue')
    const MJ_BreadCrumb = () => import('./common/MJ_BreadCrumb.vue')

    export default {
        components: {
            MJHeader,
            MJ_BreadCrumb
        },

        data() {
            return {
                isc: false
            }
        },

        computed: {
            ...mapState(["loading", "routes"]),
            ...mapState("goods", ["gcShieldCount", "increasestockVolumeCount"]),
            ...mapState("order", [
                "orderStatus1Count",
                "orderPrintCount",
                "orderSendCount",
                "refundStatus0Count",
                "refundStatus1Count",
                "refundStatus2Count"
            ])
        },

        mounted() {
            this.gcShieldCountChange()
            this.IncreasestockVolumeCountChange()
            this.orderStatusCountChange()
            this.orderRefundsTypeCountChange()
            this.countIntervalId = setInterval(() => {
                this.gcShieldCountChange()
                this.IncreasestockVolumeCountChange()
                this.orderStatusCountChange()
                this.orderRefundsTypeCountChange()
            }, 1000*60*5)
          PubSub.subscribe('onlyRead', () => {
            this.$message.warning(`权限不足，当前账号为只读权限`)
            this.loading.close()
          })
        },

        methods: {
            ...mapActions(["loadingOpen", "logoutAction"]),
            ...mapActions("goods", ["gcShieldCountChange", "IncreasestockVolumeCountChange"]),
            ...mapActions("order", ["orderRefundsTypeCountChange","orderStatusCountChange"]),

            menuOpen(index) {
                if (this.routes[index].name == '商品管理') {
                    this.gcShieldCountChange()
                    this.IncreasestockVolumeCountChange()
                }
                if (this.routes[index].name == '订单管理') this.orderStatusCountChange()
                if (this.routes[index].name == '售后管理') {
                    this.orderStatusCountChange()
                    this.orderRefundsTypeCountChange()
                }
            },

            elBadgeValue(pn, name) {
                switch (name) {
                    case "上架商品":
                        return this.increasestockVolumeCount != 0 ? this.increasestockVolumeCount : false;
                    case "评论管理":
                        return this.gcShieldCount != 0 && pn == '商品管理' ? this.gcShieldCount : false;
                    case "订单列表":
                        return this.orderStatus1Count != 0 ? this.orderStatus1Count : false;
                    case "打印快递单":
                        return this.orderPrintCount != 0 ? this.orderPrintCount : false;
                    case "快递发货":
                        return this.orderSendCount != 0 ? this.orderSendCount : false;
                    case "待审核退款":
                        return this.refundStatus0Count != 0 ? this.refundStatus0Count : false;
                    case "待执行退款":
                        const refundStatus1_2Count =
                            this.refundStatus1Count + this.refundStatus2Count;
                        return refundStatus1_2Count != 0 ? refundStatus1_2Count : false;
                }
            },
        },

        beforeDestroy() {
          clearInterval(this.countIntervalId)
          PubSub.unsubscribe("onlyRead")
          this.logoutAction()
        }
    };
</script>

<style>
    .even {
        background-color: #ebebeb !important;
    }
    .even:hover {
        background-color: #c2c2c2 !important;
    }

    .el-dialog__header {
        background-color: #ebfaff;
    }

    .searchButton {
        padding: 19px 8px;
    }

    .homeContainer {
        height: 100%;
    }

    .el-badge__content.is-fixed {
        position: absolute !important;
        top: 25px !important;
        right: -5px !important;
        transform: translateY(-50%) translateX(100%) !important;
    }

    .el-aside {
        color: #333;
        background-color: #f3f3f3;
    }

    .el-menu-item.is-active {
        background-color: #6ccfff85 !important;
    }

    .el-menu--collapse{
        width: 100%;
    }

    .toggle_btn {
        background-color: #eee;
        font-size: x-large;
        line-height: 30px;
        color: #848484;
        letter-spacing: 0.2em;
        cursor: pointer;
        padding: 0 23px;
    }

  .mjn {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .el-tooltip__popper.is-dark {
    background: rgba(102, 177, 255, 0.8) !important;
    color: #FFF !important;
  }
</style>


