<template>
    <div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>投票</el-breadcrumb-item>
        <el-breadcrumb-item>Vote</el-breadcrumb-item>
    </el-breadcrumb>
    <h3>投票</h3>
    <el-select v-model="time" @change="redirect" placeholder="选择时段" style="margin-bottom: 10px;">
        <el-option label="6:30" value="1"></el-option>
        <el-option label="7:00" value="2"></el-option>
        <el-option label="13:45" value="3"></el-option>
        <el-option label="18:40" value="4"></el-option>
        <el-option label="21:35" value="5"></el-option>
        <el-option label="22:30" value="6"></el-option>
    </el-select>
    <el-collapse accordion @change="changeListener" v-loading.fullscreen.lock="pageLoading" element-loading-text="Loading...">
        <el-collapse-item v-for="(song, index) in songs" :title="'# ' + index + ' 您的投票: ' + song.vote" :name="index" :key="song.id">
            <YPlayer :src="song.url" @progress="timeListener" ref="player"></YPlayer><el-button size="small" style="float: right;" @click="showReport = !showReport">举报</el-button><br>
            <transition name="el-fade-in-linear">
                <div v-show="true" style="position: relative; margin-top: 10px;">
                    <hr><el-rate v-model="rate" :max="5" :colors="['#99A9BF', '#F7BA2A','#FF9900']" :low-threshold="2" :high-threshold="4" show-text :texts="texts" style="margin: 15px 20px; width: 200px; float: left;"></el-rate>
                    <el-button type="primary" :loading="voteLoading" @click="vote(song.id)" style="float: right;">{{ voteLoading ? '正在提交' : '投票' }}</el-button>
                </div>
            </transition>
            <transition name="el-fade-in-linear">
                <div v-show="showReport">
                    <br><el-input v-model="reason" placeholder="填写举报原因" style="width: 70%; float: left; margin-bottom: 10px;"></el-input>
                    <el-button type="primary" :loading="reportLoading" @click="report(song.id)" style="float: right;">提交</el-button>
                </div>
            </transition>
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
                reason: '',
                index: 0, 
                canVote: false,
                showReport: false,
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
            redirect: function() {
                this.$router.push('/Vote/' + this.time);
            },
            timeListener: function(time) {
                this.currentTime = time
                if(this.currentTime >= 15)
                    this.canVote = true
            },
            changeListener: function(index) {
                this.currentTime = 0
                this.rate = 0
                this.reason = ''
                this.canVote = false
                this.showReport = false
                if(this.index != '')
                    this.$refs.player[this.index - 1].stop();
                this.index = index
                return index;
            },
            vote: function(id) {
                if(this.rate == 0) {
                    this.$message.error({
                        showClose: true,
                        message: '请选择您的评价!'
                    });
                    return;
                }
                this.voteLoading = true
                axios.post('/Vote',{
                    id: id,
                    vote: this.rate
                })
                .then((res) => {
                    this.voteLoading = false
                    if(res.data.error == 0) {
                        this.$message.success({
                            showClose: true,
                            message: '投票成功!'
                        });
                    } else {
                        this.$message.error({
                            showClose: true,
                            message: res.data.msg
                        });
                    }
                })
                .catch((err) => {
                    this.voteLoading = false
                    console.log(err);
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
                    } else {
                        this.$message.error({
                            showClose: true,
                            message: res.data.msg
                        });
                    }
                })
                .catch((err) => {
                    this.reportLoading = false
                    console.log(err);
                });
            },
            getSongs: function() {
                this.time = this.$route.params.time
                this.pageLoading = true
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
                    console.log(err);
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