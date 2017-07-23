<template>
	<div class="header">
        <div class="header-inner">
            <a class="show-btn" @click="collapse">
                <i class="fa fa-align-justify"></i>
            </a>
            <div class="title">{{ title }}</div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['title'],
        methods: {
            collapse: function(){
                this.collapsed = !this.collapsed;
                this.$emit('collapse')
            }
        }
    };
</script>

<style>
.header {
    position: fixed;
    overflow: visible;
    top: 0;
    height: 60px;
    width: 100%;
    padding: 0 8px;
    z-index: 2;
    color: #fff;
    background: #20a0ff;
}
.header-inner {
    position: relative;
}
.show-btn {
    display: block;
    height: 60px;
    padding: 0 15px;
    line-height: 60px;
    border-bottom: none;
    color: #fff;
    -webkit-box-shadow: none!important;
    box-shadow: none!important;
    position: relative;
    float: left;
    z-index: 1;
    cursor: pointer;
    text-decoration: none;
}
.title {
    display: block;
    height: 60px;
    padding: 0 20px;
    border-bottom: none;
    color: #fff;
    line-height: 60px;
    -webkit-box-shadow: none!important;
    box-shadow: none!important;
    position: relative;
    font-size: 18px;
}
</style>