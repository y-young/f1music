<template>
    <div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>投票</el-breadcrumb-item>
        <el-breadcrumb-item>Vote</el-breadcrumb-item>
    </el-breadcrumb>
    <h3>投票{{ songNo }}</h3>
    <el-collapse accordion @change="changeListener">
        <el-collapse-item title="No.1 未投票" name="1">
            <YPlayer src="/***REMOVED***.mp3" @progress="timeListener"></YPlayer>
            <div id="player1" class="aplayer"></div><br><hr>
            <transition name="el-fade-in-linear">
                <el-rate v-model="rate" :max="4" :colors="['#99A9BF', '#F7BA2A','#FF9900']" :low-threshold="2" :high-threshold="3" show-text :texts="texts" style="margin: 10px 20px; float: left;" v-show="canVote"></el-rate>
            </transition>
        </el-collapse-item>
        <el-collapse-item title="Song 2" name="2">
            <YPlayer src="/***REMOVED***.mp3" @progress="timeListener"></YPlayer>
        </el-collapse-item>
    </el-collapse>
    </div>
</template>

<script>
    import YPlayer from './YPlayer.vue';

    export default {
        data() {
            return {
                currentTime: 0,
                rate: 0,
                songNo: 0, 
                canVote: false,
                texts: ['非常不合适','不合适','合适','非常合适'],
                songs: ['***REMOVED***.mp3', '***REMOVED***.mp3']
            }
        },
        methods: {
            timeListener: function(time) {
                this.currentTime = time
                if(this.currentTime >= 15)
                    this.canVote = true
            },
            changeListener: function(name) {
                this.currentTime = 0
                this.rate = 0
                this.canVote = false
                this.songNo = name
                return name;
            }
        },
        components: {
            YPlayer
        }
    };
</script>

<style>
    .fa {
        margin-right: 0;
    }
    .yplayer {
        margin-bottom: 20px;
    }
</style>