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
    Pagination
} from 'element-ui';
import 'element-ui/lib/theme-default/index.css';

import Index from './components/admin/Index.vue';
import Songs from './components/admin/Songs.vue';
import EditSong from './components/admin/EditSong.vue';
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
Vue.use(Pagination);
Vue.use(Loading.directive);
Vue.use(VueRouter);

Vue.prototype.$loading = Loading.service
Vue.prototype.$message = Message
Vue.prototype.$alert = MessageBox.alert

const router = new VueRouter({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Index,
            meta: {
                title: '首页',
                nav: '0'
            }
        },
        {
            path: '/Songs',
            name: 'Songs',
            component: Songs,
            meta: {
                title: '曲目',
                nav: '1-1'
            }
        },
        {
            path: '/Songs/Trashed',
            name: 'TrashedSongs',
            component: Songs,
            meta: {
                title: '曲目 - 回收站',
                type: 'trashed',
                nav: '1-2'
            }
        },
        {
            path: '/Song/Edit/:id',
            name: 'EditSong',
            component: EditSong,
            meta: {
                title: '编辑曲目'
            }
        },
        {
            path: '/Files',
            name: 'Files',
            component: Files,
            meta: {
                title: '文件',
                nav: '3'
            }
        },
        {
            path: '/Reports',
            name: 'Reports',
            component: Reports,
            meta: {
                title: '举报',
                nav: '4'
            }
        },
        {
            path: '/Votes',
            name: 'Votes',
            component: Votes,
            meta: {
                title: '投票',
                nav: '2'
            }
        },
        {
            path: '/Rank',
            name: 'Rank',
            component: Rank,
            meta: {
                title: '投票结果',
                nav: '5'
            }
        }
    ]
});
router.beforeEach((to, from, next) => {
    document.title = to.meta.title + ' - 福州一中 校园音乐征集管理系统'
    next()
})
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 403:
                    Message.error({
                        showClose: true,
                        message: '您没有此权限!'
                    })
                    break;
                case 500:
                    Message.error({
                        showClose: true,
                        message: 'Oops!出错了,我们会尽快修复这一问题~'
                    })
                    break;
                default:
                    Message.error({
                        showClose: true,
                        message: '加载失败了╭(╯ε╰)╮'
                    });
            }
        }
        return Promise.reject(error.response.data)
    }
);
const app = new Vue({
    el: '#app',
    render: h => h(App),
    router
});
