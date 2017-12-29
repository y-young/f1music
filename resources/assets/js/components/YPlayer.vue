<template>
    <div class="yplayer">
        <audio id="audio" @durationchange="init" @timeupdate="progress" @progress="onLoad" @ended="end" @error="error" :src="src" ref="player" preload="metadata"></audio>
        <div class="control" v-if="detail">
            <el-slider v-model="currentTime" :min="0" :max="audio.duration" :show-tooltip="false"></el-slider>
            <div id="timeDetail">{{ played }} / {{ duration }}</div>
        </div>
        <el-button-group id="controls">
            <el-button type="primary" @click="play"><i class="fa" v-bind:class="[isPlaying ? 'fa-pause' : 'fa-play']" style="margin-right: 0;"></i></el-button>
            <el-button type="primary" @click="stop" v-if="detail"><i class="fa fa-stop" style="margin-right: 0;"></i></el-button>
        </el-button-group>
        <!--<div class="control" v-if="detail">
           {{ loaded }}
        </div>-->
    </div>
</template>

<script>
    export default {
        props: {
            src: {
                type: String,
                required: true
            },
            detail: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                currentTime: 0,
                totalTime: 0,
                isPlaying: false,
                loaded: 0,
                audio: ''
            }
        },
        mounted() {
            this.audio = this.$refs.player
        },
        computed: {
            played: function() {
                return formatTime(this.currentTime)
            },
            duration: function() {
                return formatTime(this.totalTime)
            }
        },
        methods: {
            init: function() {
                this.totalTime = this.audio.duration
                //this.$set(this, 'duration', formatTime(this.totalTime)) //this.duration = formatTime(this.totalTime)
            },
            progress: function() {
                this.currentTime = this.audio.currentTime
                this.$emit('progress', Number(this.currentTime))
            },
            play: function() {
                if(!this.isPlaying) {
                    this.audio.play();
                } else {
                    this.audio.pause();
                }
                this.isPlaying = !this.isPlaying;
            },
            stop: function() {
                this.audio.pause();
                this.isPlaying = false;
                this.audio.currentTime = 0;
            },
            end: function() {
                this.audio.pause();
                this.isPlaying = false;
                this.$emit('end')
            },
            onLoad: function() {
                this.loaded = this.audio.buffered.length ? this.audio.buffered.end(this.audio.buffered.length - 1) / this.audio.duration : 0
            },
            error: function() {
                this.$message.error({
                    showClose: true,
                    message: '播放出错了,请重试'
                });
                this.audio.pause()
            },
            changeVolume: function(volume) {
                this.audio.volume = volume / 100
                return volume;
            }
        }
    };

    function formatTime(seconds) {
        if (isNaN(seconds))
            return '00:00';
        const min = parseInt(seconds / 60);
        const sec = parseInt(seconds - min * 60);
        const hours = parseInt(min / 60);
        const newMin = parseInt((seconds / 60) - (60 * parseInt((seconds / 60) / 60)));
        const add0 = (num) => {
            return num < 10 ? '0' + num : '' + num;
        };
        return seconds >= 3600 ? add0(hours) + ':' + add0(newMin) + ':' + add0(sec) : add0(min) + ':' + add0(sec);
    }
</script>

<style>
    #controls {
        float: left;
        margin-right: 20px;
    }
    #volume {
        float: left;
        vertical-align: middle;
        margin-right: 15px;
        padding-top: 10px;
    }
    #changeVolume {
        width: 80px;
        float: left;
    }
    #timeDetail {
        font-size: 12px;
        color: #777;
        display: inline;
        float: right;
    }
</style>
