<template>
    <div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>投票</el-breadcrumb-item>
        <el-breadcrumb-item>Vote</el-breadcrumb-item>
    </el-breadcrumb>
    <h3>投票{{ songNo }}</h3>
    <el-select v-model="time" placeholder="选择时段" style="margin-bottom: 10px;">
        <el-option label="6:30" value="1"></el-option>
        <el-option label="7:00" value="2"></el-option>
        <el-option label="13:45" value="3"></el-option>
        <el-option label="18:40" value="4"></el-option>
        <el-option label="21:35" value="5"></el-option>
        <el-option label="22:30" value="6"></el-option>
    </el-select>
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
                time: '1',
                currentTime: 0,
                rate: 0,
                songNo: 0, 
                canVote: false,
                texts: ['非常不合适','不合适','合适','非常合适'],
                songs: ['***REMOVED***.mp3', '***REMOVED***.mp3']
            }
        },
        watch: {
            '$route' (to, from) {
                this.time = this.$route.params.time
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
    .yplayer {
        margin-bottom: 20px;
    }
</style>