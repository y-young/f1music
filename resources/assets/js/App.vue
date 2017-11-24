<template>
    <div class="app" v-bind:class="{ 'show-sidebar': collapsed }">
        <div v-if="$route.meta.layout != 'login'">
        <Sidebar :activeIndex="$route.meta.nav ? $route.meta.nav : ('4-'+$route.params.time)" :loggedIn="loggedIn"></Sidebar>
        <div class="container">
            <div class="container-inner">
                <Heading :title="$route.meta.title" v-on:collapse="collapse"></Heading>
                <div class="page">
                    <div class="page-inner">
                        <transition name="el-fade-in-linear">
                            <router-view></router-view>
                        </transition>
                    </div>
                </div>
                <Foot></Foot>
            </div>
        </div></div>
        <div v-else>
            <transition name="el-fade-in-linear">
                <router-view></router-view>
            </transition>
        </div>
    </div>
</template>

<script>
    import Sidebar from './components/Sidebar.vue';
    import Heading from './components/Header.vue';
    import Foot from './components/Footer.vue';

    const desktop = isDesktop();

    export default {
        name: 'app',
        data() {
            return {
                collapsed: desktop,
                loggedIn: false
            }
        },
        watch: {
            $route: function() {
                this.checkLogin()
                this.mobileCollapse()
            }
        },
        created() {
            this.checkLogin()
        },
        methods: {
            collapse: function(){
                this.collapsed = !this.collapsed
            },
            mobileCollapse: function() {
                if (!desktop) {
                    this.collapsed = false
                }
            },
            checkLogin: function() {
                this.loggedIn = getCookie('MusicAuth') != null
                if (this.$route.meta.requiresAuth == true && !this.loggedIn) {
                   this.$router.push({ path: 'Login', query: { redirect: this.$route.path}})
                }
            }
        },
        components: {
            Sidebar,
            Heading,
            Foot
        }
    };

    function isDesktop() {
        return window.innerWidth > 993;
    }

    function getCookie(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return (arr[2]);
        else
            return null;
    }
</script>

<style>
.app {
    position: relative;
    width: 100%;
    height: 100%;
}
.app.without-animation {
    -webkit-transition: none!important;
    -moz-transition: none!important;
    -o-transition: none!important;
    transition: none!important
}
@media (min-width:600px) {
    .app.show-sidebar .container {
        left: 300px;
    }
    .container-inner {
        min-height: calc(100% - 50px)
    }
}
@media (max-width:600px) {
    .app.show-sidebar {
        overflow: hidden;
    }
    .app.show-sidebar .container {
        -webkit-transform: translate(calc(100% - 60px),0);
        -moz-transform: translate(calc(100% - 60px),0);
        -ms-transform: translate(calc(100% - 60px),0);
        -o-transform: translate(calc(100% - 60px),0);
        transform: translate(calc(100% - 60px),0)
    }
}
.container {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    overflow-y: auto;
    -webkit-transition: all 250ms ease;
    -moz-transition: all 250ms ease;
    -o-transition: all 250ms ease;
    transition: all 250ms ease;
}
.container.without-animation {
    -webkit-transition: none!important;
    -moz-transition: none!important;
    -o-transition: none!important;
    transition: none!important
}

.container-inner {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    overflow-y: auto
}
.page {
    margin-top: 60px;
    position: relative;
    outline: 0;
}
.page-inner {
    position: relative;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px 15px 40px 15px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to {
  opacity: 0
}
</style>
