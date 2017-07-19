@extends('layouts.app')
@section('title','首页')
@section('activeIndex',1)
@section('contents')
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>Index</el-breadcrumb-item>
    </el-breadcrumb>
    <h3>上传说明</h3>

    <p>上传需进入相应页面。<strong>上传前请确认您推荐的歌曲别人尚未推荐</strong>，尽量不要重复上传。只能上传 mp3格式的音频，并请保证有一定质量，歌曲时间控制在3-5分钟，大小介于1MB-15MB为宜，不能上传超过20MB的歌曲。此外，曲子<strong>最好不要带有非伴奏性人声</strong>，否则播出的时候可能很雷人……同时，请各位在挑选音乐的时候明确自己对全体师生的责任，在应用自身审美标准的同时适当考虑最广大人民群众的需求。</p>
    <p>在提交新音乐时，需要点击选择一个推荐的播放时段，并填入曲名。“来源”一项表示此曲目的出处，可以填写该曲目来自的专辑、音乐家或节目、游戏等，<strong>不是表示上传者</strong>。如果不明来源的可以留空。上传文件时点击“文件”按钮并选择即可。</p>
    <p><strong>提交音乐时请注意选择相应的时段！</strong></p>
    <hr/>

    <h3>各时段音乐要求</h3>

    <ol>
        <li>起床音乐：能使人逐渐清醒，最重要的是最好不要有催眠效果。</li>
        <li>早出门音乐：一定要能使同学们清醒！</li>
        <li>午出门音乐：能提醒午睡的同学及时起床，同时不要给在班上的同学带来太大噪音。</li>
        <li>晚出门音乐：暂没有额外要求。</li>
        <li>自习结束音乐：暂没有额外要求。</li>
        <li>熄灯音乐：能让想睡的人睡觉，让想继续夜读的人能夜读。</li>
    </ol>
    <p>出于公平性考虑，本次征集投票时将隐藏歌曲相关信息，因此将预先进行审核，对于严重恶搞、不符合要求、以及重复上传的内容，将直接删除。如果发现以上情况，请点击音乐旁的举报，我们会尽快处理。此外，出于同样目的，上传时曲目的标签信息将被删除。但此操作耗时较多，因此上传进度到达100%后可能出现几秒的停顿，请耐心等待。</p>
@endsection
@section('js')
    <script src="{{url('/assets/js/index.js')}}"></script>
@endsection