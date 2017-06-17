@extends('layouts.app')
@section('title','系统日志')
@section('contents')
      <div class="am-cf am-padding am-padding-bottom-0">
        <div class="am-fl"><strong class="am-text-primary am-text-lg">系统日志</strong> / <small>Log</small></div>
      </div>

      <hr/>

      <div class="am-g error-log">
        <div class="am-u-sm-12 am-u-sm-centered">
        <pre class="am-pre-scrollable">
<span class="am-text-success">[Tue Jan 11 17:32:52 2013]</span> <span class="am-text-danger">[error]</span> [google 123.124.2.2] client denied by server: /export/home/macadmin/testdoc
        </pre>
          <p>这里是静态页面展示，使用时结合代码高亮插件</p>
        </div>
      </div>
    </div>

@endsection
