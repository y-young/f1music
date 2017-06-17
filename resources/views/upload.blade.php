@extends('layouts.app')
@section('title','上传')
@section('css')
<link rel="stylesheet" href="{{ url('css/uploader/jquery.fileupload.css') }}">
<link rel="stylesheet" href="{{ url('css/uploader/jquery.fileupload-ui.css') }}">
<!-- CSS adjustments for browsers with JavaScript disabled -->
<noscript><link rel="stylesheet" href="{{ url('css/uploader/jquery.fileupload-noscript.css') }}"></noscript>
<noscript><link rel="stylesheet" href="{{ url('css/uploader/jquery.fileupload-ui-noscript.css') }}"></noscript>
@endsection('css')
@section('contents')
<div class="am-cf am-padding am-padding-bottom-0">
      <div class="am-fl am-cf">
        <strong class="am-text-primary am-text-lg">上传</strong> /
        <small>Upload</small>
      </div>
    </div>
<hr>
<!--div class="am-container"-->
<form class="am-form" id="fileupload" enctype="multipart/form-data">
      <fieldset>
      <legend>上传音乐</legend>

      <div class="am-form-group" id="time">
        <div class="am-g am-margin-top">
          <div class="am-u-sm-4 am-u-md-2 am-text-right">
             时间
           </div>
           <div class="am-u-sm-8 am-u-md-10">
             <select data-am-selected="{btnSize: 'sm'}" name="time">
               <option value="1">6:30</option>
               <option value="2">7:00</option>
               <option value="3">13:45</option>
               <option value="4">18:40</option>
               <option value="5">21:35</option>
               <option value="6">22:30</option>
             </select>
           </div>
         </div><!-- End Margintop -->
       </div><!-- End Formgroup -->

       <div class="am-form-group" id="name">
         <div class="am-g am-margin-top">
           <div class="am-u-sm-4 am-u-md-2 am-text-right">
             曲名
           </div>
           <div class="am-u-sm-8 am-u-md-4">
             <input type="text" class="am-input-sm" name="title" placeholder="歌曲名称">
           </div>
           <div class="am-hide-sm-only am-u-md-6">*必填</div>
         </div><!-- End Margintop -->
       </div><!-- End Fromgroup -->

       <div class="am-form-group">
         <div class="am-g am-margin-top">
           <div class="am-u-sm-4 am-u-md-2 am-text-right">
             来源
           </div>
           <div class="am-u-sm-8 am-u-md-4 am-u-end col-end">
             <input type="text" class="am-input-sm" name="origin" placeholder="填写曲目来自的专辑,音乐家或节目,游戏等">
           </div>
           <div class="am-hide-sm-only am-u-md-6">填写曲目来自的专辑、音乐家或节目、游戏等,<strong>不是表示上传者</strong>,如果不明来源的可以留空
           </div>
         </div><!-- End Margintop -->
       </div><!-- End Formgroup -->

    <div class="am-form-group">
           <div class="am-g am-margin-top">
        <div class="am-u-sm-4 am-u-md-2 am-text-right">
             上传
           </div>
        <div class="fileupload-buttonbar">
            <div class="am-u-sm-7">
                <span class="am-btn am-btn-success fileinput-button">
                    <i class="am-icon-plus"></i>
                    <span>添加文件...</span>
                    <input type="file" name="files[]">
                </span>
                <!--button class="am-btn am-btn-primary start">
                    <i class="am-icon-upload"></i>
                    <span>开始上传</span>
                </button-->
                <button type="reset" class="am-btn am-btn-warning cancel">
                    <i class="am-icon-ban"></i>
                    <span>取消上传</span>
                </button>
                <!--button type="button" class="am-btn am-btn-danger delete">
                    <i class="am-icon-trash"></i>
                    <span>删除</span>
                </button--></div>
                <input type="checkbox" class="toggle">
                <!-- The global file processing state -->
                <span class="fileupload-process"></span>
            <!-- The global progress state -->
           <br> <div class="am-u-sm-7 fileupload-progress">
                <!-- The global progress bar -->
                <div class="am-progress am-progress-striped am-active progress" role="progressbar" aria-valuemin="0" aria-valuemax="100">
                    <div class="am-progress-bar am-progress-bar-success progress-bar" style="width:0%;"></div>
                </div>
                <!-- The extended global progress state -->
                <div class="progress-extended">&nbsp;</div>
            </div>
        </div>

        <table class="am-table am-table-striped" style="table-layout:fixed;">
<tbody class="files"></tbody></table>
</div></div>
    </fieldset></form>
<!-- The template to display files available for upload -->
<script id="template-upload" type="text/x-tmpl">
{% for (var i=0, file; file=o.files[i]; i++) { %}
    <tr class="template-upload">
        <!--td>
            <span class="preview"></span>
        </td-->
        <td style="text-overflow:ellipsis; overflow:ellipsis;">
            <p class="am-monospace">{%=file.name%}</p>
            <strong class="am-text am-text-danger"></strong>
        </td>
        <td>
            <p class="size">上传中...</p>
            <!--div class="am-progress am-progress-striped am-active" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="am-progress-bar am-progress-bar-success" style="width:0%;"></div></div-->
        </td>
        <td>
            {% if (!i && !o.options.autoUpload) { %}
                <button class="am-btn am-btn-primary start" disabled>
                    <i class="am-icon-upload"></i>
                    <span>开始</span>
                </button>
            {% } %}
            {% if (!i) { %}
                <button class="am-btn am-btn-warning cancel">
                    <i class="am-icon-ban"></i>
                    <span>取消</span>
                </button>
            {% } %}
        </td>
    </tr>
{% } %}
</script>
<!-- The template to display files available for download -->
<script id="template-download" type="text/x-tmpl">
{% for (var i=0, file; file=o.files[i]; i++) { %}
    <tr class="template-download">
        <!--td>
            <span class="preview">
                {% if (file.thumbnailUrl) { %}
                    <a href="#" data-gallery><img src="{%=file.thumbnailUrl%}"></a>
                {% } %}
            </span>
        </td-->
        <td style="text-overflow:ellipsis; overflow:ellipsis;">
            <p class="am-monospace">
                {% if (file.url) { %}
                    <a href="{%=file.url%}">{%=file.name%}</a>
                {% } else { %}
                    <span>{%=file.name%}</span>
                {% } %}
            </p>
            {% if (file.error) { %}
                <div><span class="am-badge am-badge-danger">错误</span> {%=file.error%}</div>
            {% } %}
        </td>
        <td>
            <span class="size">{%=o.formatFileSize(file.size)%}</span>
        </td>
        <td>
            {% if (file.deleteUrl) { %}
                <button class="am-btn am-btn-danger cancel" data-type="{%=file.deleteType%}" data-url="{%=file.deleteUrl%}"{% if (file.deleteWithCredentials) { %} data-xhr-fields='{"withCredentials":true}'{% } %}>
                    <i class="am-icon-trash"></i>
                    <span>删除</span>
                </button>
                <input type="checkbox" name="delete" value="1" class="toggle">
            {% } else { %}
                <button class="am-btn am-btn-warning cancel">
                    <i class="am-icon-ban"></i>
                    <span>取消</span>
                </button>
            {% } %}
        </td>
    </tr>
{% } %}
</script>
@endsection
@section('js')
<script src="//cdn.bootcss.com/jquery/1.11.3/jquery.min.js"></script>
<!-- The jQuery UI widget factory, can be omitted if jQuery UI is already included -->
<script src="{{ url('js/uploader/vendor/jquery.ui.widget.js') }}"></script>
<!-- The Templates plugin is included to render the upload/download listings -->
<script src="{{ url('js/uploader/tmpl.min.js') }}"></script>
<!-- The Load Image plugin is included for the preview images and image resizing functionality -->
<script src="{{ url('js/uploader/load-image.all.min.js') }}"></script>
<!-- The Canvas to Blob plugin is included for image resizing functionality -->
<!--script src="{{ url('js/uploader/canvas-to-blob.min.js') }}"></script-->
<!-- The Iframe Transport is required for browsers without support for XHR file uploads -->
<script src="{{ url('js/uploader/jquery.iframe-transport.js') }}"></script>
<!-- The basic File Upload plugin -->
<script src="{{ url('js/uploader/jquery.fileupload.js') }}"></script>
<!-- The File Upload processing plugin -->
<script src="{{ url('js/uploader/jquery.fileupload-process.js') }}"></script>
<!-- The File Upload image preview & resize plugin -->
<script src="{{ url('js/uploader/jquery.fileupload-image.js') }}"></script>
<!-- The File Upload audio preview plugin -->
<script src="{{ url('js/uploader/jquery.fileupload-audio.js') }}"></script>
<!-- The File Upload video preview plugin -->
<script src="{{ url('js/uploader/jquery.fileupload-video.js') }}"></script>
<!-- The File Upload validation plugin -->
<script src="{{ url('js/uploader/jquery.fileupload-validate.js') }}"></script>
<!-- The File Upload user interface plugin -->
<script src="{{ url('js/uploader/jquery.fileupload-ui.js') }}"></script>
<!-- The main application script -->
<script src="{{ url('js/uploader/main.js') }}"></script>
<!-- The XDomainRequest Transport is included for cross-domain file deletion for IE 8 and IE 9 -->
<!--[if (gte IE 8)&(lt IE 10)]>
<script src="{{ url('js/uploader/cors/jquery.xdr-transport.js') }}"></script>
<![endif]-->
@endsection
