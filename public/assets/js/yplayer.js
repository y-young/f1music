Vue.component('yplayer', {
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
    template: '<div class="yplayer">\
                    <audio id="audio" @loadedmetadata="init" @timeupdate="progress" @ended="end" :src="src" ref="player" preload></audio>\
                    <div class="control" v-show="detail">\
                        <el-slider v-model="currentTime" :min="0" :max="audio.duration" :show-tooltip="false"></el-slider>\
                        <div style="font-size: 12px; color: #777; display: inline; float: right;">{{ played }} / {{ duration }}</div>\
                    </div>\
                    <el-button-group style="float: left; margin-right: 20px;">\
                        <el-button type="primary" @click="play"><i class="fa" v-bind:class="[isPlaying ? \'fa-pause\' : \'fa-play\']"></i></el-button>\
                        <el-button type="primary" @click="stop" v-show="detail"><i class="fa fa-stop"></i></el-button>\
                    </el-button-group>\
                    <div class="control" v-show="detail">\
                        <i class="fa" v-bind:class="[volume ? \'fa-volume-up\' : \'fa-volume-off\']" style="float: left; vertical-align: middle; margin-right: 15px; padding-top: 10px;"></i>\
                        <el-slider v-model="volume" :max="100" @change="changeVolume" style="width: 80px; float: left;"></el-slider>\
                    </div>\
                </div>',
    data: function () {
        return {
            currentTime: 0,
            totalTime: 0,
            isPlaying: false,
            duration: '00:00',
            played: '00:00',
            volume: 100,
            audio: ''
        }
    },
    methods: {
        init: function() {
            this.totalTime = this.audio.duration
            this.volume = this.audio.volume * 100
            this.duration = formatTime(this.totalTime)
        },
        progress: function() {
            this.currentTime = this.audio.currentTime
            this.played = formatTime(this.currentTime)
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
            this.isPlaying = false
        },
        changeVolume: function(volume) {
            this.audio.volume = volume / 100
            return volume;
        }
    },
    mounted() {
        this.audio = this.$refs.player
    }
 })
function add0(num) {
        return num < 10 ? '0' + num : '' + num;
};
function formatTime(seconds) {
    if (isNaN(seconds))
        return '00:00';
    const min = parseInt(seconds / 60);
    const sec = parseInt(seconds - min * 60);
    const hours = parseInt(min / 60);
    const newMin = parseInt((seconds / 60) - (60 * parseInt((seconds / 60) / 60)));
    return seconds >= 3600 ? add0(hours) + ':' + add0(newMin) + ':' + add0(sec) : add0(min) + ':' + add0(sec);
}