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
                <a href="http://music.163.com/playlist/2064024722/" style="font-size: 13px; color: #777; text-decoration: none">前往网易云歌单 <i class="el-icon-arrow-right"></i></a>
                <router-link :to="{ name: 'Home' }" style="font-size: 13px; color: #777;">进入首页 <i class="el-icon-arrow-right"></i></router-link>
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
                    <template slot-scope="props">
                        <i class="el-icon-loading" v-if="!props.row.url"></i><YPlayer :src="props.row.url" :detail="false" v-if="props.row.url"></YPlayer>
                    </template>
                </el-table-column>
                <el-table-column label="下载">
                    <template slot-scope="props">
                        <el-button type="primary" @click="download(props.row.id)"><i class="fa fa-download" style="margin-right: 0px;"></i></el-button>
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
                rank: [{"id":296,"playtime":"1","name":"その恋は、少女漫画化されてゆく","origin":"橋本由香利","score":2.980769230769231,"url":"/uploads/9a9ae9bafc54223e36468fdad00c9fe6.mp3"},{"id":323,"playtime":"1","name":"希望を胸にのぼる丘","origin":"加藤達也","score":2.8846153846153846,"url":"/uploads/14901d5a10ad1960adb7328fc4b3bff3.mp3"},{"id":318,"playtime":"1","name":"Till The End","origin":"Capo Productions","score":1.8518518518518519,"url":"/uploads/51f704b531449204cd20e6f4736cce83.mp3"},{"id":321,"playtime":"1","name":"Inspire","origin":"Capo Productions","score":1.0416666666666667,"url":"/uploads/***REMOVED***.mp3"},{"id":12,"playtime":"1","name":"Run Away With Me","origin":"Omar Akram","score":0.7894736842105263,"url":"/uploads/4575b71f5f136ddf4fd58fd552d82de1.mp3"},{"id":295,"playtime":"1","name":"朝練","origin":"藤澤慶昌","score":0.5454545454545454,"url":"/uploads/4bc228984fc32cc16156e051fe80094a.mp3"},{"id":322,"playtime":"1","name":"Fresh Again","origin":"堤博明","score":-0.38461538461538464,"url":"/uploads/3b575979500a69677f5507a222e12be6.mp3"},{"id":4,"playtime":"2","name":"Guardiania for Shadowcat","origin":"JUSF周存","score":3.6666666666666665,"url":"/uploads/e0f6b17a87a7607f8400199d920be318.mp3"},{"id":55,"playtime":"2","name":"Trip","origin":"Axero","score":2.2,"url":"/uploads/1d501aa2c7e106594e03521e64c18715.mp3"},{"id":182,"playtime":"2","name":"二人セゾン - off-vocal -","origin":"欅坂46","score":2.051282051282051,"url":"/uploads/3394e556c38f760ec3daaee5dd759873.mp3"},{"id":102,"playtime":"2","name":"夢","origin":"Hallo","score":1.5853658536585367,"url":"/uploads/4b608007a0dde3b7d87cb690abb5f996.mp3"},{"id":109,"playtime":"2","name":"snow halation (钢琴版)","origin":"","score":1.1111111111111112,"url":"/uploads/3971ca72927fef70d758e47c1751e93c.mp3"},{"id":285,"playtime":"2","name":"Checkmate Knights (カラオケVer.)","origin":"Knights","score":1.0714285714285714,"url":"/uploads/b93e25fca83b9747574eade03abbff98.mp3"},{"id":170,"playtime":"2","name":"ハイキュー!!","origin":"林ゆうき","score":0.36585365853658536,"url":"/uploads/93aad723e33f04138e6f7a39795faf57.mp3"},{"id":58,"playtime":"2","name":"China-X","origin":"徐梦圆","score":-0.11627906976744186,"url":"/uploads/645cf5efdc3542728cbc98c5e7eee90c.mp3"},{"id":294,"playtime":"2","name":"光のはじまり","origin":"南條愛乃","score":-0.7142857142857143,"url":"/uploads/df1ed3a1261ae9145daaabc6eb6b06f6.mp3"},{"id":192,"playtime":"3","name":"夏野与暗恋","origin":"闫东炜","score":4.7368421052631575,"url":"/uploads/41256f96aef465244359a905b4335697.mp3"},{"id":199,"playtime":"3","name":"Feeling The Rain","origin":"MoreanP","score":4.166666666666667,"url":"/uploads/f716e32f91be91fc20d1b969b285078d.mp3"},{"id":171,"playtime":"3","name":"你并不是一个人","origin":"嵐","score":3.2432432432432434,"url":"/uploads/7abce388897f5551bd74ddfc9618caed.mp3"},{"id":133,"playtime":"3","name":"The Right Path","origin":"","score":2.142857142857143,"url":"/uploads/80072d0510a4dea06acfe82e13efb8f1.mp3"},{"id":232,"playtime":"3","name":"again","origin":"四月是你的谎言","score":1.935483870967742,"url":"/uploads/17fc3bf4d80c676cb7335f726712d1fe.mp3"},{"id":137,"playtime":"3","name":"Yuri on ICE","origin":"Yuri on ICE","score":0.5882352941176471,"url":"/uploads/cdd36f8d5f013ef885056e7591e9d8af.mp3"},{"id":11,"playtime":"3","name":"次回予告","origin":"橋本由香利","score":-0.2857142857142857,"url":"/uploads/7b140eec70b74a1275125334ae476697.mp3"},{"id":314,"playtime":"4","name":"Adagio for Summer Wind","origin":"清水準一","score":4.310344827586207,"url":"/uploads/f7df5e2727bde554b6d66925f728ea39.mp3"},{"id":15,"playtime":"4","name":"初秋与七夕","origin":"闫东炜","score":4.285714285714286,"url":"/uploads/442f4d94c947ae67f8e5eeba3ee21313.mp3"},{"id":64,"playtime":"4","name":"A New Day","origin":"Mark Petrie","score":3.392857142857143,"url":"/uploads/2b19d0f9b4ce62d3ea11e2a21e34874b.mp3"},{"id":77,"playtime":"4","name":"Who's Lovin' You","origin":"October","score":3.1666666666666665,"url":"/uploads/17f5035a5c65d71c5a4e1f3b6d5b4f0b.mp3"},{"id":178,"playtime":"4","name":"Last Kiss","origin":"Ken Arai","score":2.5,"url":"/uploads/81474e43ad136bb6076626fabdac4c28.mp3"},{"id":100,"playtime":"4","name":"mirror","origin":"DELA","score":2.142857142857143,"url":"/uploads/8322c095a51b84347d47f90583fac223.mp3"},{"id":71,"playtime":"4","name":"BLISS","origin":"Ken Arai","score":1.9642857142857142,"url":"/uploads/38b0332e0e4c3392945a751305ab1c96.mp3"},{"id":3,"playtime":"4","name":"what for?","origin":"sAr","score":1.6666666666666667,"url":"/uploads/e2543008d9290b77fd2702a79abe05f9.mp3"},{"id":140,"playtime":"4","name":"夏日","origin":"四季音色","score":0.2,"url":"/uploads/32c83e77090dcd92a777a85850a1f768.mp3"},{"id":267,"playtime":"4","name":"九重现实","origin":"","score":-1.1538461538461537,"url":"/uploads/6880cee82884b84d49501a80b7d2e98a.mp3"},{"id":14,"playtime":"5","name":"My Soul","origin":"July","score":4.324324324324325,"url":"/uploads/c4fc8bb33b942e806739ee2a0ccc1f03.mp3"},{"id":286,"playtime":"5","name":"Time To Love","origin":"October","score":2.3076923076923075,"url":"/uploads/a1ac72ea0f1973cc67818fd517cb81b0.mp3"},{"id":75,"playtime":"5","name":"Evolution Era","origin":"V.K克","score":2.1666666666666665,"url":"/uploads/0861415fd1879567456cc3bae529f5a7.mp3"},{"id":210,"playtime":"5","name":"Morning Haze Rearrange","origin":"1n,keeno,Cre-sc3NT","score":1.9230769230769231,"url":"/uploads/3d8393c355eaf37361bd3bbc1380feef.mp3"},{"id":160,"playtime":"5","name":"Paper Plane's Adventure","origin":"V.K克","score":1.7857142857142858,"url":"/uploads/822078b5d8ece035dcb031af4ea4a5d5.mp3"},{"id":198,"playtime":"5","name":"夜光","origin":"逆时针向","score":1.4,"url":"/uploads/f23c4828e7da3cbecf912bb9eb3d01de.mp3"},{"id":130,"playtime":"5","name":"岸","origin":"魏琮霏","score":0.625,"url":"/uploads/5dc733abc58e40b6969a3af7e95f0762.mp3"},{"id":292,"playtime":"5","name":"音频怪物 - 长安忆（伴奏）","origin":"长安忆（翻唱）","score":-0.4838709677419355,"url":"/uploads/8091d4cc380976122af40bb84107ec6a.mp3"},{"id":74,"playtime":"6","name":"青石巷","origin":"魏琮霏","score":4.310344827586207,"url":"/uploads/ca73b059d47c0f2eae5c1cd8dcc28298.mp3"},{"id":233,"playtime":"6","name":"Believe me","origin":"","score":3,"url":"/uploads/1f6b0ede7fbd19881a84a0960e450238.mp3"},{"id":52,"playtime":"6","name":"ヒナギク(orgel Ver)","origin":"Rewrite ORIGINAL SOUNDTRACK","score":2.9166666666666665,"url":"/uploads/157a93fce6dc68c8984558222616581a.mp3"},{"id":205,"playtime":"6","name":"Rainbow","origin":"Kitagawa Katsutoshi","score":2.8846153846153846,"url":"/uploads/77669582cfe14bab67f3e2f42b310091.mp3"},{"id":135,"playtime":"6","name":"WHITE ALBUM (Piano solo ver.)","origin":"TVアニメ「WHITE ALBUM2」ORIGINAL SOUNDTRACK","score":2.0833333333333335,"url":"/uploads/76e84053163059fb63dc187a27cb63b8.mp3"},{"id":38,"playtime":"6","name":"moon phase -月相-","origin":"流派未確定","score":0.9259259259259259,"url":"/uploads/26e92af1e564603a296ed3853eb1bbaf.mp3"},{"id":108,"playtime":"6","name":"【钢琴】捞月亮的人","origin":"昼夜","score":0.8695652173913043,"url":"/uploads/89660fa1069c07e4a0ab8c71cd7e02a7.mp3"},{"id":97,"playtime":"6","name":"私の嘘～PianoSolo","origin":"四月は君の嘘 ORIGINAL SONG & SOUNDTRACK","score":-0.2,"url":"/uploads/3baf33d9041f1b9c3f2eb72485de4836.mp3"},{"id":1,"playtime":"6","name":"願いが叶う場所","origin":"CLANNAD ORIGINAL SOUNDTRACK","score":-0.4,"url":"/uploads/fc9c700474b9209c0ec9c52957b080e4.mp3"}]
                }
        },
        methods: {
            filterPlaytime(value, row) {
                return row.playtime === value;
            },
            download(id) {
                window.open('/Download/' + id);
            }
        },
        components: {
            YPlayer
        }
    };
</script>
