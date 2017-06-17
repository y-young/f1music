@extends('layouts.app')
@section('title','投票')
@section('contents')
      <div class="am-cf am-padding am-padding-bottom-0">
        <div class="am-fl am-cf"><strong class="am-text-primary am-text-lg">投票</strong> / <small>Vote</small></div>
      </div>

      <hr>
<div class="vote-main">
      <div class="am-g">
        <div class="am-u-sm-12 am-u-md-6">
          <div class="am-btn-toolbar">
            <div class="am-btn-group am-btn-group-xs">
              <button type="button" class="am-btn am-btn-default" href="/Upload"><span class="am-icon-upload"></span> 上传</button>
            </div>
          </div>
        </div>
        <div class="am-u-sm-12 am-u-md-3">
          <div class="am-form-group">
            <select data-am-selected="{btnSize: 'sm'}" v-bind:selected="type">
              <option value="1" {{ $type==1 ? "selected" : "" }}>6:30</option>
              <option value="2" {{ $type==2 ? "selected" : "" }}>7:00</option>
              <option value="3" {{ $type==3 ? "selected" : "" }}>13:45</option>
              <option value="4" {{ $type==4 ? "selected" : "" }}>18:40</option>
              <option value="5" {{ $type==5 ? "selected" : "" }}>21:35</option>
              <option value="6" {{ $type==6 ? "selected" : "" }}>22:30</option>
            </select>
          </div>
        </div>
      </div>
<br>
      <div class="am-g">
        <div class="am-u-sm-12">
          <div class="am-panel-group">
<div class="am-alert am-alert-secondary" data-am-alert v-show="loading">
<span class="am-icon-spinner am-icon-spin"></span>
加载中...
</div>
  <template v-for="item in files">
  <div class="am-panel am-panel-secondary">
    <div class="am-panel-hd">
      <h4 class="am-panel-title" data-am-collapse="{parent: '#songs', target: '#item1'}">
        #1 @{{ item.id }}<i class="am-icon-angle-right am-fr am-margin-right"></i>
      </h4>
    </div>
    <div id="item1" class="am-panel-collapse am-collapse">
      <div class="am-panel-bd">
       <audio v-bind:src="'../uploads/' + item.file + '.mp3'" controls="controls" preload="auto">您的浏览器不支持播放此音频</audio>
      </div>
    </div>
  </div>
  </template>
</div>
  <br>
            <div class="am-cf">
              共 1 条记录
              <div class="am-fr">
                <ul class="am-pagination">
                  <li class="am-disabled"><a href="#">«</a></li>
                  <li class="am-active"><a href="#">1</a></li>
                  <li><a href="#">2</a></li>
                  <li><a href="#">3</a></li>
                  <li><a href="#">4</a></li>
                  <li><a href="#">5</a></li>
                  <li><a href="#">»</a></li>
                </ul>
              </div>
            </div>
            <hr />
            <p>使用帮助：开始播放后10秒将会显示打分栏，请根据你的感受在打分栏相应位置点击，选择“非常不合适”、“不合适”、“合适”或“非常合适”。</p>
<p>开始播放后30秒将会在打分栏右侧显示“提交”链接，点击即可提交。</p>
<p>若已对歌曲进行打分，播放停止5秒后将会自动提交。</p>
<p>请勿同时对多首歌曲进行打分。</p>
        </div>

      </div>
    </div>
@endsection
@section('js')
<script src="{{url('/js/vue/vue.js')}}"></script>
<script src="{{url('/js/vue/vue-resource.min.js')}}"></script>
<script src="{{url('/js/vote.js')}}"></script>
<script src="{{url('/js/audiojs/audio.min.js')}}"></script>
<script>
      audiojs.events.ready(function() {
        audiojs.createAll();
      });
    </script>
@endsection
