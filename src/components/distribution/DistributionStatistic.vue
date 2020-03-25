<template>
  <el-row>
    <el-col :span="12">
      <div id="userCount" :style="{width: '100%', height: '500px'}"/>
    </el-col>
    <el-col :span="11" :offset="1">
      <div id="capitalCount" :style="{width: '100%', height: '500px'}"/>
    </el-col>
  </el-row>
</template>

<script>
    import {
      findDistributionUserCountAjax,
      findDistributionCapitalCountAjax,
    } from "../../api"
    import {mapActions, mapState} from "vuex"

    export default {
      data() {
            return {
              userCountOption: {
                title: {
                  text: '分销用户统计',
                  subtext: '',
                  left: 'center'
                },
                tooltip: {
                  trigger: 'item',
                  formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                series: [
                  {
                    name: '分销用户统计',
                    type: 'pie',
                    radius: '66%',
                    center: ['50%', '60%'],
                    data: [],
                    emphasis: {
                      itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                      }
                    }
                  }
                ]
              },
              capitalCountOption: {
                title: {
                  text: '分销资金统计',
                  subtext: '',
                  left: 'center'
                },
                tooltip: {
                  trigger: 'item',
                  formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                series: [
                  {
                    name: '分销资金统计',
                    type: 'pie',
                    radius: '80%',
                    center: ['50%', '60%'],
                    data: [],
                    emphasis: {
                      itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                      }
                    }
                  }
                ]
              }
            }
        },

        computed: {
            ...mapState(['loading', 'maijiUser', "pickerOptions"])
        },

        mounted() {
          this.findDistributionUserCount()
          this.findDistributionCapitalCount()
        },

        methods: {
          ...mapActions(["loadingOpen"]),

          async findDistributionUserCount () {
              const result = await findDistributionUserCountAjax()
              if (result.status == "SUCCESS") {
                this.userCountOption.title.subtext = `总用户：${result.data.sum} 人`
                this.userCountOption.series[0].data = [
                  {value: result.data.leaf, name: '叶子用户'},
                  {value: result.data.branch, name: '枝干用户'},
                ]
                const myChart = this.$echarts.init(document.getElementById("userCount"));
                myChart.setOption(this.userCountOption);
              }
              this.loading.close()
          },

          async findDistributionCapitalCount () {
              const result = await findDistributionCapitalCountAjax()
              if (result.status == "SUCCESS") {
                this.capitalCountOption.title.subtext = `总资金：${result.data.sum} 元`
                this.capitalCountOption.series[0].data = [
                  {value: result.data.frozen, name: '冻结中'},
                  {value: result.data.distribution, name: '可提现'},
                ]
                const myChart = this.$echarts.init(document.getElementById("capitalCount"));
                myChart.setOption(this.capitalCountOption);
              }
              this.loading.close()
          },
        }
    }
</script>

<style>
  .orderReturnRule .elDivider1 {
    margin-top: 0 !important;
  }
</style>
