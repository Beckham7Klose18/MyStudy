import PubSub from "pubsub-js";

import df from "./dateFormatter";
import rf from "./routesFormatter";
import au from "./authentication";
import gp from "./getUrlParams";
import dI from "./dealImg";
import da from "./dealAddress";
import { getLodop } from "./lodopFuncs";

export const dateFormatter = (date, time) => df(date, time);

export const routesFormatter = routes => rf(routes);

export const authentication = (routes, path) => au(routes, path);

export const getUrlParams = url => gp(url);

export const dealImg = detailsText => dI(detailsText);

export const dealAdress = areaInfo => da(areaInfo);

export const printingOrder = (base64, order) => {
  let LODOP = getLodop();
  LODOP.PRINT_INIT("电子面单");
  LODOP.ADD_PRINT_IMAGE(0, 0, 360, "100%", base64);
  LODOP.SET_PRINT_STYLEA(0, "Stretch", 1); //(可变形)扩展缩放模式
  if (LODOP.SET_PRINTER_INDEXA(order || "HPRT D45")) {
    // LODOP.PREVIEW();  // 打印预览
    LODOP.PRINT();
} else PubSub.publish('789', order || "HPRT D45")
  // LODOP.PREVIEW();  // 打印预览
};

export const printingOrderSend = (sendInfo, bill) => {
  let LODOP = getLodop();
  LODOP.PRINT_INIT("麦吉出货单");
  LODOP.SET_PRINT_PAGESIZE(1,'100mm','100mm');
  LODOP.ADD_PRINT_TABLE(5, 0, "100%", "100%", sendInfo);
  if (LODOP.SET_PRINTER_INDEXA(bill || "TSC TTP-247")) {
    // LODOP.PREVIEW();  // 打印预览
    LODOP.PRINT();
  } else PubSub.publish('456', bill || "TSC TTP-247")
  // LODOP.PREVIEW();  // 打印预览
};
