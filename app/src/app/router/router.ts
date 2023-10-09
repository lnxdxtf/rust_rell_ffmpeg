import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import routes from './routes.json'

function LazyLoaderPage(pageName: string, import_path: string) {
    if (import_path == "" || import_path == undefined) {
        return () => import(`../../pages/${pageName}.vue`)
    }
    return () => import(`../../pages/${import_path}/${pageName}.vue`)
}
export interface RouteApp {
    path: string
    name: string
    auth: boolean
    import_path: string
    component: string
    dynamic: boolean
    meta: object
    sidebar_name: string
    icon: string
    category: string | null
}



const dynamicRoutes: RouteRecordRaw[] = routes.map((r: RouteApp) => {
    return {
        path: r.dynamic ? `${r.path}/:id` : r.path,
        name: r.name,
        component: LazyLoaderPage(r.component, r.import_path),
        meta: r.meta,
        beforeEnter: (_: any, __: any, next: any) => {
            if (r.auth) {
                next()
            } else {
                next()
            }
        }
    }
}) as RouteRecordRaw[]

export default createRouter({
    history: createWebHistory(),
    routes: [...dynamicRoutes, { path: '/:pathMatch(.*)*', redirect: "/", }]
})