<template>
  <div>
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
      <el-row style="text-align:right">
        <el-button type="success" @click="showCalendar">日历</el-button>
      </el-row>
      <el-row>
        <el-calendar v-show="showCalendarTF">
          <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
          <template slot="dateCell" slot-scope="{date, data}">
            <p
              :class="data.isSelected ? 'is-selected' : ''"
            >{{ data.day.split('-').slice(1).join('-') }} {{ data.isSelected ? '✔️' : ''}}</p>
          </template>
        </el-calendar>
      </el-row>
      <el-row style="margin-top:10px" v-for="(item,index) in dietList" :key="index">
        <el-card v-if="item.length != 0">
          <el-row>{{item[0].date}}</el-row>
          <el-row v-for="(item1,index1) in item" :key="index1" style="margin-top:30px">
            <el-row v-if="item1.type==1">
              <el-row style="font-weight:700">早餐</el-row>
              <hr />
              <el-row style="margin-top:10px">{{item1.content}}</el-row>
              <el-row v-for="(item2,index2) in item1.imgDatas" :key="index2">
                <el-col :span="8">
                  <img :src="item2.smallUrl" style="width: 100%;"/>
                </el-col>
              </el-row>
            </el-row>
            <el-row v-else-if="item1.type==2">
              <el-row style="font-weight:700">中餐</el-row>
              <hr />
              <el-row style="margin-top:10px">{{item1.content}}</el-row>
              <el-row v-for="(item2,index2) in item1.imgDatas" :key="index2">
                <el-col :span="8">
                  <img :src="item2.smallUrl" style="width: 100%;"/>
                </el-col>
              </el-row>
            </el-row>
            <el-row v-else-if="item1.type==3">
              <el-row style="font-weight:700">晚餐</el-row>
              <hr />
              <el-row style="margin-top:10px">{{item1.content}}</el-row>
              <el-row v-for="(item2,index2) in item1.imgDatas" :key="index2">
                <el-col :span="8">
                  <img :src="item2.smallUrl" style="width: 100%;"/>
                </el-col>
              </el-row>
            </el-row>
            <el-row v-else-if="item1.type==4">
              <el-row style="font-weight:700">加餐</el-row>
              <hr />
              <el-row style="margin-top:10px">{{item1.content}}</el-row>
              <el-row v-for="(item2,index2) in item1.imgDatas" :key="index2">
                <el-col :span="8">
                  <img :src="item2.smallUrl" style="width: 100%;"/>
                </el-col>
              </el-row>
            </el-row>
          </el-row>
        </el-card>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  import moment from "moment"
  import { queryDietAjax, queryStepDateAjax } from "../../api"
  import { getUrlParams } from "../../util"

  export default {
    data() {
      return {
        dietList: [],
        showCalendarTF: false,
        userMessage: {}
      };
    },

    mounted() {
      this.queryUserMsg();
      this.queryDiet();
    },

    methods: {
      //用户信息
      async queryUserMsg() {
        const res = await queryStepDateAjax(getUrlParams());
        if (res.status == "SUCCESS") {
          this.userMessage = res.data;
        }
      },

      //饮食记录
      async queryDiet() {
        const date = moment(new Date()).format("YYYY-MM-DD");
        const yDate = moment(new Date() - 24 * 60 * 60 * 1000).format(
          "YYYY-MM-DD"
        );
        const BYDate = moment(new Date() - 24 * 60 * 60 * 1000 * 2).format(
          "YYYY-MM-DD"
        );

        const result = await queryDietAjax(
          {
            data: {
              maijiToken: getUrlParams(),
              time: date
            }
          },
          getUrlParams()
        );
        if (result.status == "SUCCESS") {
          this.dietList = result.data;
          this.dietList.todyList[0]
            ? (this.dietList.todyList[0].date = date)
            : "";
          this.dietList.yesterdayList[0]
            ? (this.dietList.yesterdayList[0].date = yDate)
            : "";
          this.dietList.beforeYesterdayList[0]
            ? (this.dietList.beforeYesterdayList[0].date = BYDate)
            : "";

          // console.log(this.dietList);
        }
      },
      //展示日历组件
      showCalendar() {
        this.showCalendarTF = !this.showCalendarTF;
      }
    }
  };
</script>

<style >
.is-selected {
  color: #1989fa;
}
</style>
