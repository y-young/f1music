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
import App from './App.vue';
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
    Collapse,
    CollapseItem,
    Form,
    FormItem,
    Tabs,
    TabPane,
    Alert,
    Icon,
    Upload,
    Rate,
    Input,
    Table,
    TableColumn,
    Select,
    Option,
    Loading,
    Message,
    MessageBox
} from 'element-ui';
import 'element-ui/lib/theme-default/index.css';

import Index from './components/Index.vue';
import Vote from './components/Vote.vue';
import UploadPage from './components/Upload.vue';
import Login from './components/Login.vue';
import NotFound from './components/404.vue';

Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Submenu);
Vue.use(Slider);
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Alert);
Vue.use(Icon);
Vue.use(Upload);
Vue.use(Rate);
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
            path: '/',
            name: 'Home',
            component: Index,
            meta: {
                title: '首页',
                nav: '1'
            }
        },
        {
            path: '/Vote/:time',
            component: Vote,
            meta: {
                title: '投票',
                requiresAuth: true
            }
        },
        {
            path: '/Upload',
            name: 'Upload',
            component: UploadPage,
            meta: {
                title: '上传',
                nav: '2',
                requiresAuth: true
            }
        },
        {
            path: '/Login',
            name: 'Login',
            component: Login,
            meta: {
                title: '登录',
                layout: 'login'
            }
        },
        {
            path: '/Logout',
            name: 'Logout',
            component: Login,
            meta: {
                title: '登出',
                layout: 'login',
                action: 'logout'
            }
        },
        {
            path: '*',
            name: '404',
            component: NotFound,
            meta: {
                title: '404 Page Not Found'
            }
        }
    ]
});
router.beforeEach((to, from, next) => {
    document.title = to.meta.title + ' - 福州一中 校园音乐征集'
    next()
})
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    Message.error({
                        showClose: true,
                        message: '您还未登录,正在跳转登录界面'
                    })
                    setTimeout("router.push({ name: 'Login' })", 1500);
                    break;
                case 500:
                    Message.error({
                        showClose: true,
                        message: 'Oops!出错了,我们会尽快修复这一问题~'
                    })
                    break;
                case 429:
                    Message.error({
                        showClose: true,
                        message: '操作过于频繁,请稍后再试'
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
