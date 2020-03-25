<template>
  <div>
    <el-row style="margin-bottom: 10px;">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item v-show="show('/goods')">商品管理</el-breadcrumb-item>
        <el-breadcrumb-item v-show="show('/order')">订单管理</el-breadcrumb-item>
        <el-breadcrumb-item v-show="show('/recipe')">食谱管理</el-breadcrumb-item>
        <el-breadcrumb-item v-show="show('/food')">食材管理</el-breadcrumb-item>
        <el-breadcrumb-item v-show="show('/afterSale')">售后管理</el-breadcrumb-item>
        <el-breadcrumb-item v-show="show('/rights')">权限管理</el-breadcrumb-item>
        <el-breadcrumb-item v-show="show('/community')">社区管理</el-breadcrumb-item>
        <el-breadcrumb-item v-show="show('/maijiSettings')">配置管理</el-breadcrumb-item>
        <el-breadcrumb-item v-show="show('/distribution')">分销管理</el-breadcrumb-item>
        <el-breadcrumb-item v-show="show('/appUser')">用户管理</el-breadcrumb-item>

        <el-breadcrumb-item v-show="show('/goods/')">商品列表</el-breadcrumb-item>
        <el-breadcrumb-item v-show="show('/order/')">订单列表</el-breadcrumb-item>
        <el-breadcrumb-item v-show="show('/recipe/')">食谱列表</el-breadcrumb-item>
        <el-breadcrumb-item v-show="show('/food/')">食材列表</el-breadcrumb-item>

        <el-breadcrumb-item v-show="show('/goods/add')">商品添加</el-breadcrumb-item>
        <el-breadcrumb-item v-show="show('/goods/comment')">评论管理</el-breadcrumb-item>

        <el-breadcrumb-item v-show="show('/order/print')">打印快递单</el-breadcrumb-item>
        <el-breadcrumb-item v-show="show('/order/send')">快递发货</el-breadcrumb-item>

        <el-breadcrumb-item v-show="show('/recipe/add')">食谱添加</el-breadcrumb-item>
        <el-breadcrumb-item v-show="show('/recipe/edit')">食谱编辑</el-breadcrumb-item>

        <el-breadcrumb-item v-show="show('/food/add')">食材添加</el-breadcrumb-item>
        <el-breadcrumb-item v-show="show('/food/edit')">食材编辑</el-breadcrumb-item>

        <el-breadcrumb-item v-show="show('/afterSale/applyRefund')">待审核退款</el-breadcrumb-item>
        <el-breadcrumb-item v-show="show('/afterSale/executeRefund')">待执行退款</el-breadcrumb-item>
        <el-breadcrumb-item v-show="show('/afterSale/doneRefund')">完成退款</el-breadcrumb-item>
        <el-breadcrumb-item v-show="show('/afterSale/refuseRefund')">拒绝申请</el-breadcrumb-item>

        <el-breadcrumb-item v-show="show('/rights/assignment')">分配权限</el-breadcrumb-item>

        <el-breadcrumb-item v-show="show('/community/List')">文章列表</el-breadcrumb-item>
        <el-breadcrumb-item v-show="show('/community/Hotact')">热门活动</el-breadcrumb-item>
        <el-breadcrumb-item v-show="show('/community/Publish')">发表文章</el-breadcrumb-item>

        <el-breadcrumb-item v-show="show('/maijiSettings/orderConfig')">订单返现分享助力页面配置</el-breadcrumb-item>
        <el-breadcrumb-item v-show="show('/maijiSettings/weightConfig')">减重分享助力页面配置</el-breadcrumb-item>

        <el-breadcrumb-item v-show="show('/distribution/record')">分销流水</el-breadcrumb-item>
        <el-breadcrumb-item v-show="show('/distribution/list')">分销用户</el-breadcrumb-item>
        <el-breadcrumb-item v-show="show('/distribution/rule')">分销规则</el-breadcrumb-item>
        <el-breadcrumb-item v-show="show('/distribution/statistic')">分销统计</el-breadcrumb-item>
        <el-breadcrumb-item v-show="show('/distribution/apply')">分销申请</el-breadcrumb-item>

        <el-breadcrumb-item v-show="show('/appUser/list')">用户列表</el-breadcrumb-item>
        <el-breadcrumb-item v-show="show('/appUser/weightCheck')">体重监测</el-breadcrumb-item>
        <el-breadcrumb-item v-show="show('/appUser/order')">订单返现流水</el-breadcrumb-item>
        <el-breadcrumb-item v-show="show('/appUser/distribution')">分销提成流水</el-breadcrumb-item>
        <el-breadcrumb-item v-show="show('/appUser/fund')">减肥基金流水</el-breadcrumb-item>
        <el-breadcrumb-item v-show="show('/appUser/integral')">积分流水</el-breadcrumb-item>
        <el-breadcrumb-item v-show="show('/appUser/statistic')">用户资金统计</el-breadcrumb-item>

        <el-breadcrumb-item />
      </el-breadcrumb>
    </el-row>
  </div>
</template>


<script>
export default {
  methods: {
    show(path) {
      return this.$route.path.startsWith(path);
    }
  }
};
</script>

<style>
.el-breadcrumb__inner {
  font-weight: 700;
  color: #303133;
}
.el-breadcrumb__item:last-child {
  font-weight: 700;
  color: #409eff;
}
</style>
