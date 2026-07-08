import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import HeroPage from '../views/HeroPage.vue';
import EditorPage from '../views/EditorPage.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Hero', component: HeroPage },
  { path: '/editor', name: 'Editor', component: EditorPage },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
