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
import App from './Login.vue';
import {
    Button,
    Form,
    FormItem,
    Alert,
    Input,
    Loading
} from 'element-ui';
import 'element-ui/lib/theme-default/index.css';

Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Alert);
Vue.use(Input);
Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service

axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
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
});