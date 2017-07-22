@extends('layouts.app')
@section('title','上传')
@section('activeIndex',2)
@section('contents')
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>上传</el-breadcrumb-item>
        <el-breadcrumb-item>Upload</el-breadcrumb-item>
    </el-breadcrumb>
    <h3>上传</h3>
    <el-tabs active-name="netease">
        <el-tab-pane label="网易云音乐" name="netease">
            <el-input placeholder="搜索音乐" icon="search" v-model="keyword" :on-icon-click="search" @keyup.enter.native="search" style="margin-bottom: 10px;" required></el-input>
            <el-table :data="result" v-loading.body="formLoading" element-loading-text="加载中..." max-height="500" @expand="getMp3" style="width: 100%" stripe>
                <el-table-column prop="name" label="曲名"></el-table-column>
                <el-table-column prop="artist" label="歌手"></el-table-column>
                <el-table-column prop="album" label="专辑"></el-table-column>
                <el-table-column type="expand">
                    <template scope="props">
                        <el-form label-position="left" inline>
                            <el-form-item label="时段">
                                <span><el-select v-model="ruleForm.time" placeholder="请选择时段">
                                    <el-option label="6:30" value="1"></el-option>
                                    <el-option label="7:00" value="2"></el-option>
                                    <el-option label="13:45" value="3"></el-option>
                                    <el-option label="18:40" value="4"></el-option>
                                    <el-option label="21:35" value="5"></el-option>
                                    <el-option label="22:30" value="6"></el-option>
                                </el-select></span>
                            </el-form-item>
                            <el-form-item label="曲名">
                                <span><el-input v-model="props.row.name"></el-input></span>
                            </el-form-item>
                            <el-form-item label="来源">
                                <span><el-select v-model="ruleForm.source" placeholder="请选择来源" filterable allow-create>
                                    <el-option :label="props.row.artist.toString()" :value="props.row.artist.toString()"></el-option>
                                    <el-option :label="props.row.album" :value="props.row.album"></el-option>
                                </el-select></span>
                            </el-form-item>
                            <el-form-item label="试听">
                                <span><i class="el-icon-loading" v-if="!mp3"></i><yplayer :src="mp3" :detail="false" v-if="mp3"></yplayer></span>
                            </el-form-item>
                            <el-form-item label="上传">
                                <span><el-button type="primary">上传</el-button></span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="手动上传" name="manual">
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
                    <el-button type="primary" :loading="btnLoading" @click="submit">@{{ btnLoading ? "正在提交" : "提交" }}</el-button>
                </el-form-item>
            </el-form>
        </el-tab-pane>
    </el-tabs>
@endsection
@section('js')
<script src="https://cdn.bootcss.com/axios/0.16.2/axios.min.js"></script>
<script src="{{url('/assets/js/upload.js')}}"></script>
<script src="{{url('/assets/js/yplayer.js')}}"></script>
@endsection