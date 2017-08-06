/**
 * First we will load all of this project's JavaScript dependencies which
 * include Vue and Vue Resource. This gives a great starting point for
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the body of the page. From here, you may begin adding components to
 * the application, or feel free to tweak this setup for your needs.
 */
import App from './Admin.vue';
import VueRouter from 'vue-router';
import {
    Breadcrumb,
    BreadcrumbItem,
    Menu,
    MenuItem,
    Submenu,
    Slider,
    Button,
    ButtonGroup,
    Form,
    FormItem,
    Alert,
    Icon,
    Input,
    Table,
    TableColumn,
    Select,
    Option,
    Loading,
    Message,
    MessageBox,
} from 'element-ui';
import 'element-ui/lib/theme-default/index.css';

import Songs from './components/admin/Songs.vue';
import Files from './components/admin/Files.vue';
import Reports from './components/admin/Reports.vue';
import Votes from './components/admin/Votes.vue';
import Rank from './components/admin/Rank.vue';

Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Submenu);
Vue.use(Slider);
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Alert);
Vue.use(Icon);
Vue.use(Input);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Select);
Vue.use(Option);
Vue.use(Loading.directive);
Vue.use(VueRouter);

Vue.prototype.$loading = Loading.service
Vue.prototype.$message = Message
Vue.prototype.$alert = MessageBox.alert

const router = new VueRouter({
    routes: [
        {
            path: '/Songs',
            component: Songs,
            meta: {
                title: "曲目"
            }
        },
        {
            path: '/Songs/Trashed',
            component: Songs,
            meta: {
                title: "曲目 - 回收站",
                type: 'trashed'
            }
        },
        {
            path: '/Files',
            component: Files,
            meta: {
                title: "文件"
            }
        },
        {
            path: '/Files/Trashed',
            component: Files,
            meta: {
                title: "文件 - 回收站",
                type: 'trashed'
            }
        },
        {
            path: '/Reports',
            component: Reports,
            meta: {
                title: "举报"
            }
        },
        {
            path: '/Votes',
            component: Votes,
            meta: {
                title: "投票"
            }
        },
        {
            path: '/Rank',
            component: Rank,
            meta: {
                title: "投票结果"
            }
        }
    ]
});
router.beforeEach((to, from, next) => {
    document.title = to.meta.title + ' - 福州一中 校园音乐征集管理系统'
    next()
})
axios.interceptors.response.use(data => {
    // loadinginstace.close()
    return data
}, error => {
    // loadinginstace.close()
    Message.error({
        message: '加载失败'
    })
    return Promise.reject(error)
})
const app = new Vue({
    el: '#app',
    render: h => h(App),
    router
});