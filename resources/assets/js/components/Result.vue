<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>投票结果</el-breadcrumb-item>
            <el-breadcrumb-item>Result</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="main">
        <el-tabs v-model="tab">
        <el-tab-pane label="当选歌曲" name="songs">
            <div class="aplayer"><font style="text-align: center; font-size: 24px; color: #777">Loading...</font></div><br>
            <div>
                <a href="http://music.163.com" style="font-size: 13px; color: #777; text-decoration: none"><i class="el-icon-arrow-right"></i> 前往网易云歌单</a>
                <a href="/Index" style="font-size: 13px; color: #777; text-decoration: none"><i class="el-icon-arrow-right"></i> 进入首页</a>
            </div>
        </el-tab-pane>
        <el-tab-pane label="投票结果" name="rank">
            <div>
            <el-table :data="rank" element-loading-text="加载中..." max-height="500" style="width: 100%" stripe>
                <el-table-column prop="playtime" label="时段" :filters="filters" :filter-method="filterPlaytime" filter-placement="bottom-end" width="70px"></el-table-column>
                <el-table-column prop="name" label="曲名"></el-table-column>
                <el-table-column prop="origin" label="来源"></el-table-column>
                <el-table-column prop="score" label="得分" sortable></el-table-column>
                <el-table-column label="试听">
                    <template scope="props">
                        <i class="el-icon-loading" v-if="!props.row.url"></i><YPlayer :src="props.row.url" :detail="false" v-if="props.row.url"></YPlayer>
                    </template>
                </el-table-column>
            </el-table>
            </div>
        </el-tab-pane>
        </el-tabs>
        </div>
    </div>
</template>
<script>
    import YPlayer from './YPlayer.vue';
    var APlayer = require('APlayer');
    var aplayers=[];document.addEventListener("DOMContentLoaded",function(){function a(a,b){var c=[],d=a.dataset;c.element=a,c.music=b,c.showlrc=c.music[0].lrc?3:0,c.narrow="true"===d.narrow,c.autoplay="true"===d.autoplay,c.mutex="false"!==d.mutex,c.mode=d.mode||"circulation",c.preload=d.preload||"auto",c.listmaxheight=d.listmaxheight||"340px",c.theme=d.theme||"#20A0FF",aplayers.push(new APlayer(c))}var b="/Playlist";"undefined"!=typeof meting_api&&(b=meting_api);var c=document.querySelectorAll(".aplayer"),d=!0,e=!1,f=void 0;try{for(var g,h=function(){var c=g.value;var e=b;var f=new XMLHttpRequest;f.onreadystatechange=function(){if(4===f.readyState&&(200<=f.status&&300>f.status||304===f.status)){var b=JSON.parse(f.responseText);a(c,b)}},f.open("get",e,!0),f.send(null)},i=c[Symbol.iterator]();!(d=(g=i.next()).done);d=!0)h()}catch(a){e=!0,f=a}finally{try{!d&&i.return&&i.return()}finally{if(e)throw f}}},!1);

    export default {
        data() {
            return {
                tab: 'songs',
                filters: [
                    { text: '6:30', value: '1' },
                    { text: '7:00', value: '2' },
                    { text: '13:45', value: '3' },
                    { text: '18:40', value: '4' },
                    { text: '21:35', value: '5' },
                    { text: '22:30', value: '6' }
                ],
                rank: ***REMOVED***
                }
        },
        methods: {
            filterPlaytime(value, row) {
                return row.playtime === value;
            }
        },
        components: {
            YPlayer
        }
    };
</script>
