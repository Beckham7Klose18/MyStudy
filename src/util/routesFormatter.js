export default function routesFormatter(routes) {
    let fmRoutes = [];
    routes.forEach(router => {
        let {
            path,
            component,
            name,
            keepAlive,
            requireAuth,
            icon,
            childrens
        } = router;
        if (childrens && childrens instanceof Array)
            childrens = routesFormatter(childrens);
        let fmRouter = {
            path: path,
            component: resolve => {
                if (component.startsWith("Home"))
                    require(["../components/" + component], resolve);
                if (component.startsWith("Goods"))
                    require(["../components/goods/" + component], resolve);
                else if (component.startsWith("Order"))
                    require(["../components/order/" + component], resolve);
                else if (component.startsWith("AfterSale"))
                    require(["../components/afterSale/" + component], resolve);
                else if (component.startsWith("Recipe"))
                    require(["../components/recipe/" + component], resolve);
                else if (component.startsWith("Food"))
                    require(["../components/food/" + component], resolve);
                else if (component.startsWith("Manager"))
                    require(["../components/manager/" + component], resolve);
                else if (component.startsWith("Article"))
                    require(["../components/community/" + component], resolve);
                else if (component.startsWith("MaijiArticle"))
                    require(["../components/maijiArticle/" + component], resolve);
                else if (component.startsWith("AppUser"))
                    require(["../components/appUser/" + component], resolve);
                else if (component.startsWith("Distribution"))
                    require(["../components/distribution/" + component], resolve);
                else if (component.startsWith("Label"))
                    require(["../components/label/" + component], resolve);
                else if (component.startsWith("MaijiSettings"))
                    require(["../components/maijiSettings/" + component], resolve);
                else if (component.startsWith("Advice"))
                    require(["../components/advice/" + component], resolve);
            },
            name: name,
            meta: {icon, keepAlive, requireAuth},
            children: childrens
        };
        fmRoutes.push(fmRouter);
    });
    return fmRoutes;
}
