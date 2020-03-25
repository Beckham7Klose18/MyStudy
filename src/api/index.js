/*
包含n个接口请求函数的模块
函数的返回值: promise对象
 */
import ajax from './ajax'

const BASE_URL = '/api'

// 登录
export const login = formData => ajax(BASE_URL + '/login', formData)

// 登出
export const logout = () => ajax(BASE_URL + '/logout')

// 初始化菜单
export const initMenu = () => ajax(BASE_URL + '/config/sysmenu')

// 获取用户列表
export const findAllUsersAjax = (data, metaData) => ajax(BASE_URL + '/manager/findAllUsers', {data, metaData})

// 修改用户数据
export const updUserAjax = (data) => ajax(BASE_URL + '/manager/updUser', {data})

// 添加用户
export const addUserAjax = (data) => ajax(BASE_URL + '/manager/addUser', {data})

// 编辑用户角色
export const editUserRoleAjax = (data) => ajax(BASE_URL + '/manager/editUserRole', {data})

// 编辑角色用户
export const editRoleUserAjax = (data) => ajax(BASE_URL + '/manager/editRoleUser', {data})

// 获取角色列表
export const findAllRolesAjax = (data, metaData) => ajax(BASE_URL + '/manager/findAllRoles', {data, metaData})

// 修改角色数据
export const updRoleAjax = (data) => ajax(BASE_URL + '/manager/updRole', {data})

// 添加角色
export const addRoleAjax = (data) => ajax(BASE_URL + '/manager/addRole', {data})

// 删除角色
export const delRoleAjax = (data) => ajax(BASE_URL + '/manager/delRole', {data})

// 获取角色的权限菜单
export const findAllMenusAjax = (data) => ajax(BASE_URL + '/manager/findAllMenus', {data})

// 编辑角色的权限菜单
export const editRoleMenuAjax = (data) => ajax(BASE_URL + '/manager/editRoleMenu', {data})

// 根据标签ID[]获取商品列表
export const findAllGoodsAjax = (data, metaData) => ajax(BASE_URL + '/goods/findAllGoods', {data, metaData})

// 根据商品ID获取商品
export const findGoodsById = ({data}) =>
  ajax(BASE_URL + '/goods/findGoodsById', {data})

// 添加商品
export const addGoods = (data) => ajax(BASE_URL + '/goods/addGoods', {data})

// 根据商品id获得产品参数列表
export const getParamConfigAjax= (data) => ajax(BASE_URL + '/goods/getParamConfigByGoodsId', {data})

// 编辑商品参数类型
export const editParamConfigsAjax= (data) => ajax(BASE_URL + '/goods/editParamConfigs', {data})

// 删除商品参数类型
export const delParamConfigsAjax= (data) => ajax(BASE_URL + '/goods/delParamConfigs', {data})

// 编辑商品
export const updateGoodsAjax = (data, userId) =>
  ajax(BASE_URL + '/goods/updateGoods', {data: Object.assign(data, {userId})})

// 获取商品的标签
export const findAllLabelsByGoodsId = ({data}) =>
  ajax(BASE_URL + '/goods/findAllLabelsByGoodsId', {data})

// 统计需要及时增加库存的商品数量
export const IncreasestockVolumeCountAjax = (data) =>
  ajax(BASE_URL + '/goods/IncreasestockVolumeCount', {data})

// 编辑商品的标签
export const updateBelongLabels = (userId, belongId, delLabelIds, addLabelIds) =>
  ajax(BASE_URL + '/goods/updateGoodsLabels', {data: {userId, belongId, delLabelIds, addLabelIds}})

// 编辑商品的图片
export const updateGoodsImages = (goodsId, goodsCarouselImgs) =>
  ajax(BASE_URL + '/goods/updateGoodsImages', {data: {goodsId, goodsCarouselImgs}})

// 根据标签来源获取标签列表
export const findAllLabelBySourceAjax = (source, listShow) =>
  ajax(BASE_URL + '/common/findAllLabelsBySource', {data: {source, listShow}})

// 获取标签列表
export const findAllLabelsAjax = (data, metaData) => ajax(BASE_URL + '/common/findAllLabels', {data, metaData})

// 添加标签
export const addEditLabelAjax = (data) => ajax(BASE_URL + '/common/addEditLabel', {data})

// 批量上传商品图片
export const uploadGoodsImagesAjax = data =>
  ajax('https://upload.imaiji.cn/uploadGoodsImages', data)

// 上传标签图片
export const uploadLabelImagesAjax = data => ajax('https://upload.imaiji.cn/uploadLabelImages', data)

// 批量上传食材图片
export const uploadFoodImages = data => ajax('https://upload.imaiji.cn/uploadFoodImages', data)

// 批量上传食谱图片
export const uploadRecipeImages = data =>
  ajax('https://upload.imaiji.cn/uploadRecipeImages', data)

// 批量上传文章图片
export const uploadArticleImagesAjax = data => ajax('https://upload.imaiji.cn/uploadArticleImages', data)

// 编辑订单
export const editOrderAjax = data => ajax(BASE_URL + '/order/editOrder', {data})

// 获取所有订单列表
export const findAllOrdersAjax = (data, metaData) => ajax(BASE_URL + '/order/findAllOrders', {data, metaData})

// 获取所有订单列表：待发货
export const findAllOrders1Ajax = (data) => ajax(BASE_URL + '/order/findAllOrders1', {data})

// 获取订单修改记录列表
export const findAllShopingOrderEditLogsAjax = (data, metaData) =>
  ajax(BASE_URL + '/order/findAllShopingOrderEditLogs', {
  data,
  metaData
})

// 查看订单返现活动列表
export const findAllShareOrderHelpLogsAjax = (data, metaData) =>
  ajax(BASE_URL + '/order/findAllShareOrderHelpLogs', {data, metaData})

// 查看订单返现分享助力详情
export const findShareOrderHelpByIdAjax = (data) =>
  ajax(BASE_URL + '/order/findShareOrderHelpById', {data})

// 打印订单快递电子面单
export const printAllOrdersAjax = data => ajax(BASE_URL + '/order/orderPrint', {data})

// 打印订单发货的电子面单_增加分单
export const printOrderAddAjax = data => ajax(BASE_URL + '/order/orderPrintAdd', {data})

// 手动发货
export const printOrderManualAjax = data => ajax(BASE_URL + '/order/orderPrintManual', {data})

// 手动发货修改
export const printOrderUpdateAjax = data => ajax(BASE_URL + '/order/orderPrintUpdate', {data})

// 打印订单发货的电子面单 - 增加分单
export const orderPrintNewAjax = data => ajax(BASE_URL + '/order/orderPrintNew', {data})

// 获取订单发货信息列表（已打印电子面单 / 代发货）
export const findAllPrintInfosAjax = data => ajax(BASE_URL + '/order/findAllShipmentsInfos', {data})

// 订单发货
export const orderSend = data =>
  ajax(BASE_URL + '/order/orderSend', {data})

// 获取订单详情
export const findOrderByIdAjax = data => ajax(BASE_URL + '/order/findOrderById', {data})

// 获取各个状态的订单数量
export const shopingOrderStatusCountAjax = () =>
  ajax(BASE_URL + '/order/findAllShopingOrderStatusCount')

// 获取打印快递单代发货数量
export const shopingOrderSendStatusCountAjax = () =>
  ajax(BASE_URL + '/order/findAllShopingOrderSendStatusCount')

// 根据订单ID获取运单编号集合
export const findAllExpressNosByOrderIdAjax = data =>
  ajax(BASE_URL + '/order/getTrackingNumberByOrderId', {data})

// 根据运单号获取物流轨迹
export const findLogisticsByExpressNoAjax = data =>
  ajax(BASE_URL + '/order/getLogisticsInfoByExpressNo', {data})

// 获取用户反馈列表
export const findAllAdviceFeedbacksAjax = (data, metaData) =>
  ajax(BASE_URL + '/common/findAllAdviceFeedbacks', {data, metaData})

// 获取用户反馈列表
export const replyAdviceFeedbackAjax = (data) =>
  ajax(BASE_URL + '/common/replyAdviceFeedback', {data})

// 根据标签ID获取食谱列表
export const findAllRecipesAjax = (data, metaData) =>
  ajax(BASE_URL + '/recipe/findAllRecipes', {data, metaData})

// 获取美食推荐食谱列表
export const findAllRecommendRecipesAjax = (metaData) =>
  ajax(BASE_URL + '/recipe/findAllRecommendRecipes', {metaData})

// 批量逻辑删除食谱
export const delRecipesByIdsAjax = data =>
  ajax(BASE_URL + '/recipe/delRecipesByIds', {data})

// 添加食谱
export const addRecipeAjax = data =>
  ajax(BASE_URL + '/recipe/addRecipe', {data})

// 编辑食谱
export const editRecipeAjax = data =>
  ajax(BASE_URL + '/recipe/editRecipe', {data})

// 根据食谱ID获取食谱详情
export const findRecipeByIdAjax = ({data}) =>
  ajax(BASE_URL + '/recipe/findRecipeById', {data})

// 根据食谱ID获取食谱的标签
export const findAllLabelsByRecipeIdAjax = ({data}) =>
  ajax(BASE_URL + '/recipe/findAllLabelsByRecipeId', {data})

// 导入食谱
export const uploadRecipesAjax = data =>
  ajax(BASE_URL + '/recipe/uploadRecipes', data)

// 导入食谱
export const addOrCancelRecommendAjax = data =>
  ajax(BASE_URL + '/recipe/addOrCancelRecommend', {data})

// 获取食材分类分级列表
export const findAllFoodTypesAjax = data => ajax(BASE_URL + '/food/findAllFoodTypes', {data})

// 编辑食材分类分级
export const editFoodTypeAjax = data => ajax(BASE_URL + '/food/editFoodType', {data})

// 获取食谱列表
export const findAllFoodsAjax = (data, metaData) =>
  ajax(BASE_URL + '/food/findAllFoods', {data, metaData})

// 批量逻辑删除食材
export const delFoodsByIdsAjax = data =>
  ajax(BASE_URL + '/food/delFoodsByIds', {data})

// 添加食材
export const addFoodAjax = data =>
  ajax(BASE_URL + '/food/addFood', {data})

// 根据食材ID获取食材详情
export const findFoodByIdAjax = data =>
  ajax(BASE_URL + '/food/findFoodById', {data})

// 根据食材ID获取相关商品列表
export const findAllGoodsByFoodIdAjax = data =>
  ajax(BASE_URL + '/food/findAllGoodsByFoodId', {data, metaData: {page: 1, size: 99}})

// 根据食材ID获取食材的标签
export const findAllLabelsByFoodIdAjax = data =>
  ajax(BASE_URL + '/food/findAllLabelsByFoodId', {data})

// 编辑食材
export const editFoodAjax = data =>
  ajax(BASE_URL + '/food/editFood', {data})

// 导入食材
export const uploadFoodsAjax = data =>
  ajax(BASE_URL + '/food/uploadFoods', data)

// 根据商品ID[]获取商品评论列表
export const findAllGoodsCommentAjax = (data, metaData) =>
  ajax(BASE_URL + '/goodsComment/findAllGoodsComment', {data, metaData})

// 删除商品评论
export const delGoodsCommentAjax = data =>
  ajax(BASE_URL + '/goodsComment/delGoodsComment', {data})

// 审核商品评论
export const shieldGoodsCommentAjax = (goodsId, gcId, shield) =>
  ajax(BASE_URL + '/goodsComment/shieldGoodsComment', {data: {goodsId, gcId, shield}})

// 商家回复评论
export const replyGoodsCommentAjax = data =>
  ajax(BASE_URL + '/goodsComment/replyGoodsComment', {data})

// 统计未审核商品评论数量
export const goodsCommentShieldCountAjax = () =>
  ajax(BASE_URL + '/goodsComment/goodsCommentShieldCount', {}, 'GET')

// 获取用户退款申请列表
export const findAllOrderRefundsAjax = (data, metaData) =>
  ajax(BASE_URL + '/orderRefund/findAllOrderRefunds', {data, metaData})

// 统计退款类型数量
export const findAllOrderRefundsTypeCountAjax = () =>
  ajax(BASE_URL + '/orderRefund/findAllOrderRefundsTypeCount', {}, 'GET')

// 客服审核申请退款
export const agreeApplyRefundAjax = data => ajax(BASE_URL + '/capital/agreeApplyRefund', {data})

// 退货退款确认收货
export const confirmReceivedAjax = data => ajax(BASE_URL + '/capital/confirmReceived', {data})

// 客服执行退款
export const executeRefundAjax = data => ajax(BASE_URL + '/capital/executeRefund', {data})

// 获得用户提现记录列表
export const findAllWithdrawalRecordsAjax = (data, metaData) =>
  ajax(BASE_URL + '/capital/findAllWithdrawalRecords', {data, metaData})

//根据token获取用户订单
export const queryUserOrderAjax = (data, metaData, maijiToken) =>
  ajax(BASE_URL + '/order/findUserOrdersByToken',{data, metaData},'POST', maijiToken)

//禁止用户登录
export const banAppUserAjax = (data) => ajax(BASE_URL + '/userInterface/banAppUser',{data})

//获取体重记录
export const queryWeightAjax = maijiToken => ajax(BASE_URL + '/userInterface/getWeightChangeLogList',{},'POST', maijiToken)

//查询用户阶段天数   用户信息
export const queryStepDateAjax = maijiToken => ajax(BASE_URL + '/userInterface/getUserInfo',{},'POST', maijiToken)

//获取用户饮食记录
export const queryDietAjax = (data, maijiToken) => ajax(BASE_URL + '/deitInterface/getDietLog',{data},'POST', maijiToken)

//获取尿酮记录
export const queryKetonuriaAjax = (data, maijiToken) => ajax(BASE_URL + '/userInterface/getKetonuria',{data},'POST', maijiToken)

//发表文章
export const articlePublishAjax = (data) => ajax(BASE_URL + '/community/publish', {data})

// 获取用户Token
export const getMaijiAppOfficialTokenAjax = () => ajax(BASE_URL + '/config/getMaijiAppOfficialToken', {}, 'GET')

//文章列表查询
export const findAllComMsgInfosAjax = (data, metaData) => ajax(BASE_URL + '/community/findAllComMsgInfos', {data, metaData})

//获取转发得积分基本规则
export const findMsgTransmitRuleAjax = (data) => ajax(BASE_URL + '/community/findMsgTransmitRule', {data})

//编辑转发得积分基本规则
export const editComMsgTransmitRuleAjax = (data) => ajax(BASE_URL + '/community/editComMsgTransmitRule', {data})

//获取转发得积分基本规则编辑记录
export const findAllComMsgTransmitRuleLogsAjax = (data) => ajax(BASE_URL + '/community/findAllComMsgTransmitRuleLogs', {data})

//获取动态详细信息
export const findComMsgByIdAjax = (data) => ajax(BASE_URL + '/community/findComMsgById', {data})

//编辑动态
export const editComMsgInfoAjax = (data) => ajax(BASE_URL + '/community/editComMsgInfo', {data})

//编辑动态标签
export const editComMiddleLabelAjax = (data) => ajax(BASE_URL + '/community/editComMiddleLabel', {data})

//活动列表
export const getActDataAjax = metaData => ajax(BASE_URL + '/community/hotActs', {metaData})

//搜索活动列表
export const searchActDataAjax = (data, metaData) => ajax(BASE_URL + '/community/searchAct', {data, metaData})

//添加活动
export const addActDataAjax = (data, metaData) => ajax(BASE_URL + '/community/addHotAct', {data, metaData})

//删除活动
export const deleteActAjax = (data, metaData) => ajax(BASE_URL + '/community/deleteAct', {data, metaData})

//修改活动
export const updateActAjax = (data, metaData) => ajax(BASE_URL + '/community/updateAct', {data, metaData})

//收藏
export const isCollectAjax = (data, metaData) => ajax(BASE_URL + '/community/collect', {data, metaData})

//点赞
export const isPraiseAjax = (data, metaData) => ajax(BASE_URL + '/community/praise', {data, metaData})

//获取动态列表 - 评论统计 - pc
export const findAllMsgsAjax = (data, metaData) => ajax(BASE_URL + '/community/findAllMsgs', {data, metaData})

//获取动态的评论列表
export const findAllCommentsAjax = (data, metaData) => ajax(BASE_URL + '/community/findAllComments', {data, metaData})

//读取审核评论
export const readCommentAjax = (data) => ajax(BASE_URL + '/community/readComment', {data})

//动态评论
export const commentMsgAjax = (data) => ajax(BASE_URL + '/community/commentMsg', {data})

//动态评论的评论回复
export const commentReplyAjax = (data) => ajax(BASE_URL + '/community/commentReply', {data})

//动态评论的回复
export const commentCommentAjax = (data) => ajax(BASE_URL + '/community/commentComment', {data})

//获取精品商品
export const getSelectGoodsAjax = (data, metaData) => ajax(BASE_URL + '/goods/findAllRecommendGoods', {data, metaData})

//快捷添加/取消商品标签
export const editLabelMidGoodsAjax = (data) => ajax(BASE_URL + '/goods/editLabelMidGoods', {data})

//获取积分商品
export const getIntegralGoodsAjax = (data, metaData) => ajax(BASE_URL + '/goods/findAllExchangeGoods', {data, metaData})

//获取新品推荐商品列表
export const getNewGoodsAjax = (data, metaData) => ajax(BASE_URL + '/goods/findAllNewGoods', {data, metaData})

//获取特惠专区商品列表
export const getPreferentialGoodsAjax = (data, metaData) =>
  ajax(BASE_URL + '/goods/findAllPreferentialGoods', {data, metaData})

//根据标签ID获取麦吉简介文章列表
export const findAllMaijiArticleByLabelIdAjax = (data) => ajax(BASE_URL + '/maijiArticle/findAllMaijiArticleByLabelId', {data})

// 删除麦吉简介文章
export const delMaijiArticleByIdAjax = data => ajax(BASE_URL + '/maijiArticle/delMaijiArticleById', {data})

// 修改麦吉简介文章的标签
export const updMaijiArticleLabelAjax = data => ajax(BASE_URL + '/maijiArticle/updMaijiArticleLabel', {data})

// 添加或编辑麦吉简介文章
export const add_editMaijiArticleAjax = data => ajax(BASE_URL + '/maijiArticle/add_updMaijiArticle', {data})

// 获取麦吉简介文章评论列表
export const findAllArticleCommentsAjax = (data, metaData) => ajax(BASE_URL + '/maijiArticle/findAllArticleComments', {data, metaData})

// 文章评论/评论回复
export const articleCommentAjax = (data) => ajax(BASE_URL + '/maijiArticle/articleComment', {data})

// 删除屏蔽麦吉简介文章评论
export const delArticleCommentsAjax = (data) => ajax(BASE_URL + '/maijiArticle/delArticleComments', {data})

// 删除屏蔽麦吉简介文章评论
export const del_updMaijiArticleByIdAjax = data => ajax(BASE_URL + '/maijiArticle/del_updMaijiArticleById', {data})

// 添加或编辑麦吉简介文章
export const findAllMaijiUsersAjax = (data, metaData) => ajax(BASE_URL + '/userInterface/findAllMaijiUsers', {data, metaData})

// 获取用户资金统计数据
export const findCapitalMainCountAjax = (data, metaData) => ajax(BASE_URL + '/userInterface/findCapitalMainCount', {data, metaData})

// 获取用户资金流水列表
export const findAllCapitalMainLogsAjax = (data, metaData) => ajax(BASE_URL + '/userInterface/findAllCapitalMainLogs', {data, metaData})

//根据活动名称查询文章列表
export const commonMsgsAjax = (data, metaData) => ajax(BASE_URL + '/community/commonMsgs', {data, metaData})

// 获取分销流水列表
export const findAllDistributionLogsAjax = (data, metaData) => ajax(BASE_URL + '/distribution/findAllDistributionLogs', {data, metaData})

// 获取分销用户列表
export const findAllDistributionUsersAjax = (data, metaData) => ajax(BASE_URL + '/distribution/findAllDistributionUsers', {data, metaData})

// 编辑分销用户
export const editDistributionUserAjax = (data) => ajax(BASE_URL + '/distribution/editDistributionUser', {data})

// 获取分销公共规则
export const findDistributionComRuleAjax = (data) => ajax(BASE_URL + '/distribution/findDistributionComRule', {data})

// 修改分销公共规则
export const editDistributionComRuleAjax = (data) => ajax(BASE_URL + '/distribution/editDistributionComRule', {data})

// 获取分销公共规则修改记录列表
export const findAllDistributionComRuleLogsAjax = (data) => ajax(BASE_URL + '/distribution/findAllDistributionComRuleLogs', {data})

// 获取分销用户个人规则修改记录列表
export const findAllDistributionUserRuleLogsAjax = (data) => ajax(BASE_URL + '/distribution/findAllDistributionUserRuleLogs', {data})

// 获取用户的账户信息
export const findCapitalMainByUserIdAjax = (data) => ajax(BASE_URL + '/distribution/findCapitalMainByUserId', {data})

// 获取分销申请信息列表
export const findAllDbApplysAjax = (data, metaData) => ajax(BASE_URL + '/distribution/findAllDbApplyInfos', {data, metaData})

// 审核分销申请
export const examineDbApplyAjax = (data) => ajax(BASE_URL + '/distribution/examineDbApply', {data})

// 获取分销用户统计
export const findDistributionUserCountAjax = () => ajax(BASE_URL + '/distribution/findDistributionUserCount', {})

// 获取分销资金统计
export const findDistributionCapitalCountAjax = () => ajax(BASE_URL + '/distribution/findDistributionCapitalCount', {})

// 获取订单返现分享助力规则修改记录列表
export const findAllShareOrderRuleLogsAjax = (data) => ajax(BASE_URL + '/order/findAllShareOrderRuleLogs', {data})

// 修改订单返现分享助力规则
export const updShareOrderRuleAjax = (data) => ajax(BASE_URL + '/order/updShareOrderRule', {data})

// 获取订单返现分享助力规则
export const findShareOrderRuleAjax = (data) => ajax(BASE_URL + '/order/findShareOrderRule', {data})

// 设置打印机型号
export const find_setPrinterModelAjax = (data) => ajax(BASE_URL + '/maijiSettings/find_setPrinterModel', {data})

// 获取基础减肥基金规则修改记录列表
export const findAllShareWeightRuleLogsAjax = (data) => ajax(BASE_URL + '/maijiSettings/findAllShareWeightRuleLogs', {data})

// 修改基础减肥基金规则
export const updShareWeightRuleAjax = (data) => ajax(BASE_URL + '/maijiSettings/updShareWeightRule', {data})

// 获取基础减肥基金规则
export const findShareWeightRuleAjax = (data) => ajax(BASE_URL + '/maijiSettings/findShareWeightRule', {data})

// 获取减重分享规则修改记录列表
export const findAllShareWeightHelpRuleLogsAjax = (data) => ajax(BASE_URL + '/maijiSettings/findAllShareWeightHelpRuleLogs', {data})

// 修改基础减肥基金规则
export const updShareWeightHelpRuleAjax = (data) => ajax(BASE_URL + '/maijiSettings/updShareWeightHelpRule', {data})

// 获取减重分享规则
export const findShareWeightHelpRuleAjax = () => ajax(BASE_URL + '/maijiSettings/findShareWeightHelpRule', {})

// 设置订单自动收货设置
export const findAndSetOrderAutoSetAjax = (data) => ajax(BASE_URL + '/maijiSettings/findAndSetOrderAutoSet', {data})

// 获取分享封面和页面配置
export const findShareRuleConfigAjax = (data) => ajax(BASE_URL + '/maijiSettings/findShareRuleConfig', {data})

// 修改分享封面和页面配置
export const add_updShareRuleConfigAjax = (data) => ajax(BASE_URL + '/maijiSettings/add_updShareRuleConfig', {data})

// 获取运费规则列表
export const findAllRuleFreightsAjax = (data, metaData) => ajax(BASE_URL + '/settings/findAllRuleFreights', {data, metaData})

// 添加/修改运费规则
export const add_updRuleFreightAjax = (data) => ajax(BASE_URL + '/settings/add_updRuleFreight', {data})

// 获取全国省市列表
export const findAllProvinceCityAjax = () => ajax(BASE_URL + '/settings/findAllProvinceCity', {})

// 获取减重分享规则修改记录列表
export const findAllRuleFundIntegral_logsAjax = (data, metaData) => ajax(BASE_URL + '/maijiSettings/findAllRuleFundIntegral_logs', {data, metaData})

// 编辑基金或积分使用规则
export const editRuleFundIntegralAjax = (data) => ajax(BASE_URL + '/maijiSettings/editRuleFundIntegral', {data})

// 获取基金或积分使用规则列表
export const findAllRuleFundIntegralsAjax = (data, metaData) => ajax(BASE_URL + '/maijiSettings/findAllRuleFundIntegrals', {data, metaData})

// 获取优惠券规则修改记录列表
export const findAllDiscountCouponLogsAjax = (data, metaData) => ajax(BASE_URL + '/maijiSettings/findAllDiscountCouponLogs', {data, metaData})

// 编辑优惠券使用规则
export const editDiscountCouponAjax = (data) => ajax(BASE_URL + '/maijiSettings/editDiscountCoupon', {data})

// 获取优惠券规则列表
export const findAllDiscountCouponsAjax = (data, metaData) => ajax(BASE_URL + '/maijiSettings/findAllDiscountCoupons', {data, metaData})

// 获取积分分发修改记录列表
export const findAllTaskLogsAjax = (metaData) => ajax(BASE_URL + '/maijiSettings/findAllTaskLogs', {metaData})

// 编辑积分分发规则
export const editTaskAjax = (data) => ajax(BASE_URL + '/maijiSettings/editTask', {data})

// 获取积分分发规则列表
export const findAllTasksAjax = (metaData) => ajax(BASE_URL + '/maijiSettings/findAllTasks', {metaData})

// 获取连续签到得积分规则修改记录列表
export const findAllSignInDeployLogsAjax = () => ajax(BASE_URL + '/maijiSettings/findAllSignInDeployLogs', {})

// 修改连续签到得积分规则
export const editSignInDeployAjax = (data) => ajax(BASE_URL + '/maijiSettings/editSignInDeploy', {data})

// 获取连续签到得积分规则
export const findAllSignInDeploysAjax = (metaData) => ajax(BASE_URL + '/maijiSettings/findAllSignInDeploys', {metaData})

// 获取提现金额限制数据
export const findAllWithdrawalAmountLimitConfigLogsAjax = (data) => ajax(BASE_URL + '/maijiSettings/findAllWithdrawalAmountLimitConfigLogs', {data})

// 获取提现金额限制数据编辑记录
export const findWithdrawalAmountLimitConfigAjax = (data) => ajax(BASE_URL + '/maijiSettings/findWithdrawalAmountLimitConfig', {data})

// 配置提现金额
export const editWithdrawalAmountLimitConfigAjax = (data) => ajax(BASE_URL + '/maijiSettings/editWithdrawalAmountLimitConfig', {data})
