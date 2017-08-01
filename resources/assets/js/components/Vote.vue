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
    <el-collapse accordion @change="changeListener" v-loading.fullscreen.lock="pageLoading">
        <el-collapse-item v-for="(song, index) in songs" :title="'# ' + index + ' 您的投票: ' + song.vote" :name="index" :key="song.id">
            <YPlayer :src="song.url" @progress="timeListener" ref="player"></YPlayer><br><hr>
            <transition name="el-fade-in-linear">
                <div v-show="canVote">
                    <el-rate v-model="rate" :max="4" :colors="['#99A9BF', '#F7BA2A','#FF9900']" :low-threshold="2" :high-threshold="3" show-text :texts="texts" style="margin: 10px 20px; float: left;"></el-rate>
                    <el-button type="primary" :loading="btnLoading" @click="vote(song.id)" style="float: right;">{{ btnLoading ? '正在提交' : '投票' }}</el-button>
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
                index: 0, 
                canVote: false,
                pageLoading: false,
                btnLoading: false,
                texts: ['非常不合适','不合适','合适','非常合适'],
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
                this.canVote = false
                if(this.index != '')
                    this.$refs.player[this.index - 1].stop();
                this.index = index
                return index;
            },
            vote: function(id) {
                if(this.rate == 0) {
                    this.$message.error('请选择您的评价!');
                    return;
                }
                this.btnLoading = true
                axios.post('/Vote',{
                    id: id,
                    vote: this.rate
                })
                .then((res) => {
                    this.btnLoading = false
                    if(res.data.error == 0) {
                        this.$message.success('投票成功!');
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })
                .catch((err) => {
                    this.btnLoading = false
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
                        this.$message.error(res.data.msg);
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
        margin-bottom: 20px;
    }
</style>