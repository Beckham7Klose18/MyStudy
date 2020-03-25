<template>
  <el-row>
    <el-row style="border: 1px seagreen solid;">
      <el-col :span="12" style="text-align: center; border-right: 1px seagreen solid; line-height: 50px;">
        减肥基金：{{capitalMain.fund}} 元</el-col>
      <el-col :span="12" style="text-align: center; line-height: 50px;">
        可用积分：{{capitalMain.integral}} 分</el-col>
    </el-row>
    <el-row style="border: 1px seagreen solid;">
      <el-col :span="6" style="text-align: center; border-right: 1px seagreen solid; line-height: 50px;">
        可用余额：{{capitalMain.money}} 元
      </el-col>
      <el-col :span="9" style="text-align: center; border-right: 1px seagreen solid; line-height: 50px;">
        <el-row><el-col :span="14" style="text-align: right; line-height: 25px;">订单返现：</el-col><el-col :span="10" style="text-align: left; line-height: 25px;">{{capitalMain.returnMoney}} 元</el-col></el-row>
        <el-row><el-col :span="14" style="text-align: right; line-height: 25px;">分销提成(可提现)：</el-col><el-col :span="10" style="text-align: left; line-height: 25px;">{{capitalMain.distribution}} 元</el-col></el-row>
      </el-col>
      <el-col :span="9" style="text-align: center; line-height: 50px;">
        分销提成(冻结中)：{{capitalMain.frozen}} 元</el-col>
    </el-row>
    <div id="capitalCount" :style="{width: '100%', height: '500px'}"/>
  </el-row>
</template>

<script>
    import {
      findCapitalMainCountAjax,
    } from "../../api"
    import {mapState} from "vuex"

    export default {
      data() {
            return {
              capitalMain: {},
              userCountOption: {
                tooltip: {
                  trigger: 'item',
                  formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                series: [
                  {
                    name: "用户总资金",
                    type: 'pie',
                    radius: '66%',
                    center: ['50%', '250px'],
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
            }
        },

        computed: {
            ...mapState(['loading'])
        },

        mounted() {
          this.findCapitalMainCount()
        },

        methods: {
          async findCapitalMainCount () {
              const result = await findCapitalMainCountAjax()
              if (result.status == "SUCCESS") {
                this.capitalMain = result.data
                this.userCountOption.series[0].data = [
                  {value: result.data.returnMoney, name: '订单返现'},
                  {value: result.data.distribution, name: '分销提成(可提现)'},
                  {value: result.data.frozen, name: '分销提成(冻结中)'},
                ]
                const myChart = this.$echarts.init(document.getElementById("capitalCount"));
                myChart.setOption(this.userCountOption);
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
