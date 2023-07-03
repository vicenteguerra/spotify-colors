import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Auth from '../views/Auth.vue'
import Colours from '../views/Colours.vue'
import Playlist from '../views/Playlist.vue'
import Song from '../views/Song.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/callback',
    name: 'Auth',
    component: Auth
  },
  {
    path: '/colours',
    name: 'Colours',
    component: Colours
  },
  {
    path: '/playlist/:playlistId',
    name: 'Playlist',
    component: Playlist
  },
  {
    path: '/song/:songId',
    name: 'Song',
    component: Song
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
