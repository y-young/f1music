@extends('layouts.app')
@section('title','上传')
@section('activeIndex',2)
@section('contents')
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>上传</el-breadcrumb-item>
        <el-breadcrumb-item>Upload</el-breadcrumb-item>
    </el-breadcrumb>
    <h3>上传</h3>
    <el-form :model="ruleForm" label-position="left" :rules="rules" ref="ruleForm" label-width="80px" enctype="multipart/form-data">
        <el-form-item label="时段" prop="time">
            <el-select v-model="ruleForm.time" placeholder="请选择时段">
                <el-option label="6:30" value="1"></el-option>
                <el-option label="7:00" value="2"></el-option>
                <el-option label="13:45" value="3"></el-option>
                <el-option label="18:40" value="4"></el-option>
                <el-option label="21:35" value="5"></el-option>
                <el-option label="22:30" value="6"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="曲名" prop="name">
            <el-input v-model="ruleForm.name" placeholder="歌曲名称"></el-input>
        </el-form-item>
        <el-form-item label="来源" prop="source">
            <el-input v-model="ruleForm.source" placeholder="该曲目来自的专辑、音乐家或节目、游戏等，不是表示上传者，不明来源可以留空"></el-input>
        </el-form-item>
        <el-form-item label="上传文件" prop="file">
            <el-upload v-model="ruleForm.file" accept="audio/mpeg" :data="ruleForm" :before-upload="beforeUpload" :on-success="onSuccess" drag action="/Upload">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传mp3文件，且大小不超过20MB</div>
            </el-upload>
        </el-form-item><br>
        <el-form-item>
            <el-button type="primary" :loading="loading" @click="submit">@{{ loading ? "正在提交" : "提交" }}</el-button>
        </el-form-item>
@endsection
@section('js')
<script src="{{url('/assets/js/upload.js')}}"></script>
@endsection