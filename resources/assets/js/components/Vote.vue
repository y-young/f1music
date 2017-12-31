<template>
    <div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>投票</el-breadcrumb-item>
        <el-breadcrumb-item>Vote</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main">
    <el-alert title="温馨提示" type="info" description="试听30秒后显示评分栏,建议试听1分钟以上,详见首页投票说明" show-icon></el-alert>
    <el-select v-model="time" @change="redirect" placeholder="选择时段" style="width: 90px; margin-bottom: 10px;">
        <el-option label="6:30" value="1"></el-option>
        <el-option label="7:00" value="2"></el-option>
        <el-option label="13:45" value="3"></el-option>
        <el-option label="18:40" value="4"></el-option>
        <el-option label="21:35" value="5"></el-option>
        <el-option label="22:30" value="6"></el-option>
    </el-select>
    <div style="float: right; margin-top: 5px"><font style="color: #777;font-size: 14px">自动播放: </font><el-switch v-model="auto" on-text="" off-text=""></el-switch></div>
    <el-collapse accordion @change="changeListener" v-model="index" v-loading.fullscreen.lock="pageLoading" element-loading-text="Loading...">
        <el-collapse-item v-for="(song, index) in songs" :title="'# ' + index + ' 您的投票: ' + song.vote" :name="index" :key="song.id">
            <YPlayer :src="song.url" @progress="timeListener" @end="vote(song)" ref="player"></YPlayer><el-button size="small" style="float: right;" @click="showReport = !showReport">举报</el-button><br>
            <transition name="el-fade-in-linear">
                <div v-show="canVote" style="position: relative; margin-top: 10px;">
                    <hr><el-rate v-model="rate" @change="canSubmit = true" :max="5" :colors="['#99A9BF', '#F7BA2A','#FF9900']" :low-threshold="2" :high-threshold="4" show-text :texts="texts" style="margin: 15px 15px; float: left;"></el-rate>
                        <el-button type="primary" :loading="voteLoading" @click="vote(song)" style="float: right;">投票</el-button>
                </div>
            </transition>
            <transition name="el-fade-in-linear">
                <div v-show="showReport">
                    <br><el-input v-model="reason" placeholder="填写举报原因" style="width: 70%; float: left; margin-bottom: 10px;" :maxlength="50"></el-input>
                    <el-button type="primary" :loading="reportLoading" @click="report(song.id)" style="float: right;">提交</el-button>
                </div>
            </transition>
        </el-collapse-item>
    </el-collapse>
    </div>
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
                reason: '',
                index: '',
                lastIndex: '',
                canVote: false,
                canSubmit: false,
                showReport: false,
                auto: true,
                pageLoading: false,
                voteLoading: false,
                reportLoading: false,
                texts: ['非常不合适', '不合适', '中立', '合适', '非常合适'],
                songs: []
            }
        },
        created: function() {
            this.getSongs()
        },
        watch: {
            '$route': 'getSongs'
        },
        methods: {
            init: function() {
                this.currentTime = 0
                this.rate = 0
                this.reason = ''
                this.canVote = false
                this.canSubmit = false
                this.showReport = false
                this.reportLoading = false
                this.voteLoading = false
            },
            redirect: function() {
                if(this.lastIndex != '')
                    this.$refs.player[this.lastIndex - 1].stop();
                this.index = ''
                this.lastIndex = ''
                this.$router.push('/Vote/' + this.time);
            },
            timeListener: function(time) {
                this.currentTime = time
                if(this.currentTime >= 30)
                    this.canVote = true
            },
            changeListener: function(index) {
                if(this.lastIndex != '')
                    this.$refs.player[this.lastIndex - 1].stop()
                this.init()
                this.lastIndex = index
                if(this.auto && index != '') {
                    this.$refs.player[index - 1].play()
                }
                return index;
            },
            vote: function(song) {
                if(!this.canSubmit) {
                    this.$message.error({
                        showClose: true,
                        message: '选择或更改评价后才能提交'
                    });
                    return;
                }
                let newIndex =  String(Number(this.index) + 1)
                this.voteLoading = true
                // Try to solve the problem of 'play() can only be initiated by a user gesture by playing and immediately stoping it
                if(this.songs[newIndex] && this.auto) {
                    //this.$refs.player[newIndex - 1].play()
                    this.$refs.player[newIndex - 1].audio.play()
                    this.$refs.player[newIndex - 1].audio.pause()
                }
                axios.post('/Vote',{
                    id: song.id,
                    vote: this.rate
                })
                .then((res) => {
                    this.voteLoading = false
                    if(res.data.error == 0) {
                        this.$message.success({
                            showClose: true,
                            message: '投票成功!'
                        });
                        song.vote = this.texts[this.rate - 1]
                        this.canSubmit = false
                        if(this.songs[newIndex] && this.auto) {
                            this.index = newIndex
                            this.changeListener(this.index)
                        }
                    } else {
                        this.$message.error({
                            showClose: true,
                            message: res.data.msg
                        });
                    }
                })
                .catch((err) => {
                    this.voteLoading = false
                });
            },
            report: function(id) {
                if(this.reason == '') {
                    this.$message.error({
                        showClose: true,
                        message: '请填写举报原因!'
                    });
                    return;
                }
                this.reportLoading = true
                axios.post('/Report',{
                    id: id,
                    reason: this.reason
                })
                .then((res) => {
                    this.reportLoading = false
                    if(res.data.error == 0) {
                        this.$message.success({
                            showClose: true,
                            message: '举报成功!'
                        });
                        this.submitDisabled = true
                    } else {
                        this.$message.error({
                            showClose: true,
                            message: res.data.msg
                        });
                    }
                })
                .catch((err) => {
                    this.reportLoading = false
                });
            },
            getSongs: function() {
                this.time = this.$route.params.time
                this.pageLoading = true
                this.init()
                axios.post('/List',{
                    time: this.time
                })
                .then((res) => {
                    this.pageLoading = false
                    if(res.data.error == 0) {
                        this.songs = res.data.songs
                    } else {
                        this.$message.error({
                            showClose: true,
                            message: res.data.msg
                        });
                    }
                })
                .catch((err) => {
                    this.pageLoading = false
                });
            },
        },
        components: {
            YPlayer
        }
    };
</script>

<style>
    .yplayer {
        margin-bottom: 25px;
    }
</style>
