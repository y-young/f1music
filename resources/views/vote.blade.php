@extends('layouts.app')
@section('title','投票')
@section('css')
<style>
.bar-wrap {
    margin: 10px 0;
    padding: 4px 0;
    flex: 1;
}
.bar {
    position: relative;
    height: 4px;
    width: 100%;
    background: #cdcdcd;
}
.played {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    height: 4px;
    background: #20a0ff;
}
.thumb {
    position: absolute;
    top: 0;
    right: 5px;
    margin-top: -4px;
    margin-right: -10px;
    height: 12px;
    width: 12px;
    border-radius: 50%;
    vertical-align: middle;
    background: #20a0ff;
}
    .fa {
        margin-right: 0;
    }
    .yplayer {
        margin-bottom: 20px;
    }
</style>
@endsection
@section('activeIndex',4)
@section('contents')
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>投票</el-breadcrumb-item>
        <el-breadcrumb-item>Vote</el-breadcrumb-item>
    </el-breadcrumb>
    <h3>投票@{{ songNo }}</h3>
    <el-collapse accordion @change="changeListener">
        <el-collapse-item title="No.1 未投票" name="1">
            <yplayer src="{{url('/***REMOVED***.mp3')}}" @progress="timeListener"></yplayer>
            <div id="player1" class="aplayer"></div><br><hr>
            <transition name="el-fade-in-linear">
                <el-rate v-model="rate" :max="4" :colors="['#99A9BF', '#F7BA2A','#FF9900']" :low-threshold="2" :high-threshold="3" show-text :texts="texts" style="margin: 10px 20px; float: left;" v-show="canVote"></el-rate>
            </transition>
        </el-collapse-item>
        <el-collapse-item title="Song 2" name="2">
            <yplayer src="{{url('/***REMOVED***.mp3')}}" @progress="timeListener"></yplayer>
        </el-collapse-item>
    </el-collapse>
@endsection
@section('js')
<script src="https://cdn.bootcss.com/aplayer/1.6.0/APlayer.min.js"></script>
<script src="{{url('/assets/js/yplayer.js')}}"></script>
<script>
    var component = Vue.extend({
        data() {
            return {
                currentTime: 0,
                rate: 0,
                songNo: 0, 
                canVote: false,
                texts: ['非常不合适','不合适','合适','非常合适']
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
        mixins: [main]
    });
    var page = new component();
    page.$mount('.app');
</script>
@endsection
