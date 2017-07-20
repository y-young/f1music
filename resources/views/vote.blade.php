@extends('layouts.app')
@section('title','投票')
@section('activeIndex',3)
@section('contents')
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>投票</el-breadcrumb-item>
        <el-breadcrumb-item>Vote</el-breadcrumb-item>
    </el-breadcrumb>
    <h3>投票</h3>
    <audio src="{{url('/***REMOVED***.mp3')}}" controls="controls"></audio>
@endsection
@section('js')
<script>
    var component = Vue.extend({
        mixins: [main]
    });
    var page = new component();
    page.$mount('.app');
</script>
@endsection
