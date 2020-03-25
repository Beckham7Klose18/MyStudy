export default function (routes, path) {
    const paths = []
    routesMap(routes, paths)
    const pathsNew = paths.filter(p => {
        if (p.includes('/:')) p = p.substring(0, p.indexOf('/:'))
        return path.startsWith(p)
    })
  return pathsNew.length > 0
}

function routesMap(routes, paths) {
    routes.forEach(route => {
        if (route.children && route.children.length >0)
            routesMap(route.children, paths)
        else paths.push(route.path)
    })
}
