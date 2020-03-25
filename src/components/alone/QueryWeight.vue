<template>
  <el-card>
    <el-row>
      <el-col :span="2" :offset="1">
        <img :src="userMessage.headUrl" alt width="100%" />
      </el-col>
      <el-col :span="11" style="line-height:50px">
        <div style="margin-left:10px">用户名：{{userMessage.nickName}}</div>
      </el-col>
      <el-col :span="10" style="line-height:50px">性别：{{userMessage.sex && (userMessage.sex==1?"男":'女') || "未填"}}</el-col>
    </el-row>
    <el-row style="text-align:center">
      第&nbsp;&nbsp;
      <span style="color:#67C23A;font-size:20px">{{userMessage.day}}</span>&nbsp;&nbsp;天
    </el-row>
    <el-row style="margin-top:15px;margin-bottom:15px">
      <el-steps
        :active="userMessage.stage-1"
        finish-status="success"
        align-center
        style="color:#AC2FEC"
      >
        <el-step title="第一阶段"></el-step>
        <el-step title="第二阶段"></el-step>
        <el-step title="第三阶段"></el-step>
        <el-step title="第四阶段"></el-step>
      </el-steps>
    </el-row>
    <el-row>
      <div id="weightChart" :style="{width: '100%', height: '300px'}"></div>
    </el-row>
    <el-row>
      <el-row style="margin-top:15px;margin-bottom:15px">
        <el-col :span="8" style="text-align:center">
          <el-col>当前（kg）：</el-col>
          <el-col style="margin-top:10px">
            <el-tag type="success" style="font-size:20px">{{userMessage.currentWeight}}</el-tag>
          </el-col>
        </el-col>
        <el-col :span="8" style="text-align:center">
          <el-col>已减重（kg）：</el-col>
          <el-col style="margin-top:10px">
            <el-tag type="danger" style="font-size:20px">{{reduceWeight}}</el-tag>
          </el-col>
        </el-col>
        <el-col :span="8" style="text-align:center">
          <el-col>目标（kg）：</el-col>
          <el-col style="margin-top:10px">
            <el-tag style="font-size:20px">{{userMessage.targetWeight}}</el-tag>
          </el-col>
        </el-col>
      </el-row>
      <!-- 里面写eleCalendar组件-->
      <ele-calendar :render-content="renderContent" :data="datedef" :prop="prop" border></ele-calendar>
    </el-row>
    <el-row>
      <el-row style="margin-top:15px">尿酮检测</el-row>
      <el-row style="margin-top:15px">
        <el-col :span="6">
          <div style="  width: 60%;height: 100px;background-color: #F7E7FF; margin:0 auto;"></div>
          <div style=" width: 100%;margin-top:15px;text-align:center" v-show="todayKetonuria==1">
            <el-tag style="color:#AC2FEC">当前尿酮</el-tag>
          </div>
        </el-col>
        <el-col :span="6" style="text-align:center">
          <div style="  width: 60%;height: 100px;background-color:#D9BAE9; margin:0 auto;"></div>
          <div style=" width: 100%;margin-top:15px;text-align:center" v-show="todayKetonuria==2">
            <el-tag style="color:#AC2FEC">当前尿酮</el-tag>
          </div>
        </el-col>
        <el-col :span="6" style="text-align:center">
          <div style="  width: 60%;height: 100px;background-color: #C984ED; margin:0 auto;"></div>
          <div style=" width: 100%;margin-top:15px;text-align:center" v-show="todayKetonuria==3">
            <el-tag style="color:#AC2FEC">当前尿酮</el-tag>
          </div>
        </el-col>
        <el-col :span="6" style="text-align:center">
          <div style="  width: 60%;height: 100px;background-color: #AC2FEC; margin:0 auto;"></div>
          <div style=" width: 100%;margin-top:15px;text-align:center" v-show="todayKetonuria==4">
            <el-tag style="color:#AC2FEC">当前尿酮</el-tag>
          </div>
        </el-col>
      </el-row>
    </el-row>
  </el-card>
</template>

<script>
  import moment from "moment"; //导入文件
  import eleCalendar from "ele-calendar";
  import "ele-calendar/dist/vue-calendar.css"; //引入css
  import {
    queryWeightAjax,
    queryStepDateAjax,
    queryKetonuriaAjax
  } from "../../api";
  import { getUrlParams, dateFormatter } from "../../util";

  export default {
    components: {
      eleCalendar
    },

    data() {
      return {
        token: "",
        datedef: [],
        prop: "date", //对应日期字段名
        todayKetonuria: 0,
        ketonuria: [],
        ketonuriaTime: [],
        reduceWeight: 0,
        userMessage: {},
        userWeight: [],
        recordTime: [],
        currentWeight: [],
        options: {
          title: {
            text: "体重记录",
            textStyle: { color: "#04DAE2" }
          },
          tooltip: {},
          xAxis: {
            data: []
          },
          yAxis: {
            type: "value",
            min: ""
          },
          series: [
            {
              name: "体重",
              type: "line",
              data: [],
              itemStyle: {
                normal: {
                  color: "#04DAE2"
                }
              }
            }
          ]
        } //日历参数
      };
    },

    mounted() {
      this.queryWeight();
      this.weightChartLine();
      this.queryKetonuria();
    },

    methods: {
      dateFormatter,

      //用户信息
      async queryWeight() {
        const res = await queryStepDateAjax(getUrlParams());
        if (res.status == "SUCCESS") {
          this.userMessage = res.data;
        }
      },

      //表格
      async weightChartLine() {
        const result = await queryWeightAjax(getUrlParams());
        if (result.status == "SUCCESS") {
          this.userWeight = result.data;
          this.userWeight.forEach((item, index) => {
            this.recordTime.push(dateFormatter(item.recordTime).slice(0, 10));
            this.currentWeight.push(item.currentWeight);
          });
          this.options.xAxis.data = this.recordTime;
          this.options.series[0].data = this.currentWeight;
          this.options.yAxis.min = this.mathMin(this.currentWeight) - 1;
          this.reduceWeight = Math.ceil(
            this.mathMax(this.currentWeight) - this.mathMin(this.currentWeight)
          );
        }
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById("weightChart"));
        // 绘制图表
        myChart.setOption(this.options);
      },

      //最小值
      mathMin(arrs) {
        var min = arrs[0];
        for (var i = 1, ilen = arrs.length; i < ilen; i += 1) {
          if (arrs[i] < min) {
            min = arrs[i];
          }
        }
        return min;
      }, //最大值

      mathMax(arrs) {
        var max = arrs[0];
        for (var i = 1, ilen = arrs.length; i < ilen; i += 1) {
          if (arrs[i] > max) {
            max = arrs[i];
          }
        }
        return max;
      },

      //获取尿酮记录
      async queryKetonuria() {
        const date = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
        const result = await queryKetonuriaAjax(
          {
            data: {
              endTime: date,
              startTime: "2000-00-00 00:00:00"
            }
          },
          getUrlParams()
        );
        if (result.status == "SUCCESS") {
          this.todayKetonuria =
            result.data.length != 0 ? result.data[0].ketonuria : 0;
          result.data.forEach((item, index) => {
            this.ketonuriaTime.push(dateFormatter(item.inTime).slice(0, 10));
            this.ketonuria.push(item.ketonuria);
          });
        }
      },

      //渲染日历内容
      renderContent(h, { defdate, ...parmas }) {
        //把时间转成时间戳
        const imoment = moment(defdate);
        //把时间进行格式化
        const geshi = imoment.format("YYYY-MM-DD");
        //体重
        var index;
        for (var i = 0; i < this.recordTime.length; i++) {
          if (this.recordTime[i] == geshi) {
            index = i;
          }
        }
        var weight = this.currentWeight[index];
        //尿酮
        var index1;
        for (var i = 0; i < this.ketonuriaTime.length; i++) {
          if (this.ketonuriaTime[i] == geshi) {
            index1 = i;
          }
        }
        var ket = this.ketonuria[index1];
        switch (ket) {
          case "1":
            return (
              <div style="min-height:70px;font-weight:700">
                {imoment.date()}
                <br />
                <div style="color:#04DAE2">
                  <div>{weight}</div>
                  <div style="width: 100%;height: 20px;background-color: #F7E7FF; margin:0 auto;"></div>
                </div>
              </div>
            );
            break;
          case "2":
            return (
              <div style="min-height:70px;font-weight:700">
                {imoment.date()}
                <br />
                <div style="color:#04DAE2">
                  <div>{weight}</div>
                  <div style="width: 100%;height: 20px;background-color: #D9BAE9; margin:0 auto;"></div>
                </div>
              </div>
            );
            break;
          case "3":
            return (
              <div style="min-height:70px;font-weight:700">
                {imoment.date()}
                <br />
                <div style="color:#04DAE2">
                  <div>{weight}</div>
                  <div style="width: 100%;height: 20px;background-color: #C984ED; margin:0 auto;"></div>
                </div>
              </div>
            );
            break;
          case "4":
            return (
              <div style="min-height:70px;font-weight:700">
                {imoment.date()}
                <br />
                <div style="color:#04DAE2">
                  <div>{weight}</div>
                  <div style="width: 100%;height: 20px;background-color: #AC2FEC; margin:0 auto;"></div>
                </div>
              </div>
            );
            break;
          default:
            return (
              <div style="min-height:70px;font-weight:700">
                {imoment.date()}
                <br />
                <div style="color:#04DAE2">
                  <div>{weight}</div>
                </div>
              </div>
            );
            break;
        }
        // return (
        //   <div style="min-height:70px;font-weight:700">
        //     {imoment.date()}
        //     <br />{" "}
        //     <div style="color:#04DAE2">
        //       <div>{weight}</div> <div>{ket}</div>
        //     </div>
        //   </div>
        // );
      }
    }
  };
</script>

<style >
</style>
