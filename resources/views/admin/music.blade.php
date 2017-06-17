@extends('layouts.app')
@section('title','音乐列表')
@section('contents')
      <div class="am-cf am-padding am-padding-bottom-0">
        <div class="am-fl am-cf"><strong class="am-text-primary am-text-lg">音乐列表</strong> / <small>List</small></div>
      </div>

      <hr>

      <div class="am-g">
        <div class="am-u-sm-12 am-u-md-6">
          <div class="am-btn-toolbar">
            <div class="am-btn-group am-btn-group-xs">
              <button type="button" class="am-btn am-btn-default" data-href="upload.php"><span class="am-icon-upload"></span> 上传</button>
              <button type="button" class="am-btn am-btn-default"><span class="am-icon-trash-o"></span> 删除</button>
            </div>
          </div>
        </div>
        <div class="am-u-sm-12 am-u-md-3">
          <div class="am-form-group">
            <select data-am-selected="{btnSize: 'sm'}">
              <option value="1">6:30</option>
              <option value="2">7:00</option>
              <option value="3">13:45</option>
              <option value="4">18:40</option>
              <option value="5">21:35</option>
              <option value="6">22:30</option>
            </select>
          </div>
        </div>
        <div class="am-u-sm-12 am-u-md-3">
          <div class="am-input-group am-input-group-sm">
            <input type="text" class="am-form-field">
          <span class="am-input-group-btn">
            <button class="am-btn am-btn-default" type="button">搜索</button>
          </span>
          </div>
        </div>
      </div>

      <div class="am-g">
        <div class="am-u-sm-12">
          <div class="am-scrollable-horizontal">
          <!--form class="am-form"-->
            <table class="am-table am-table-striped am-table-hover am-text-nowrap table-main">
              <thead>
              <tr>
                <th class="table-check"><input type="checkbox" /></th><th class="table-id">ID</th><th class="table-title">曲名</th><th class="table-type">来源</th><th class="table-audio">试听</th><th class="table-author">上传者</th><th class="table-date">日期</th><th class="table-set">操作</th>
              </tr>
              </thead>
              <tbody>
              <template v-for="item in files">
              <tr id="item1">
                <td><input type="checkbox" /></td>
                <td>1</td>
                <td><a href="#">@{{ item.title }}</a></td>
                <td>@{{ item.source }}</td>
                <td class=""><audio src="@{{ item.file }}.mp3"></audio></td>
                <td class="">@{{ item.id }}</td>
                <td class="">@{{ item.time }}</td>
                <td>
                  <div class="am-btn-toolbar">
                    <div class="am-btn-group am-btn-group-xs">
                      <button class="am-btn am-btn-default am-btn-xs am-text-secondary" href="/Edit/@{{ item.id }}"><span class="am-icon-pencil-square-o"></span> 编辑</button>
                      <button class="am-btn am-btn-default am-btn-xs am-hide-sm-only"><span class="am-icon-copy"></span> 复制</button>
                      <button class="am-btn am-btn-default am-btn-xs am-text-danger am-hide-sm-only"><span class="am-icon-trash-o"></span> 删除</button>
                    </div>
                  </div>
                </td>
              </tr>
              </template>
              </tbody>
            </table>
            </div>
            <div class="am-cf">
              共 15 条记录
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
            <p>注：.....</p>
          <!--/form-->
        </div>
      </div>

@endsection
@section('js')
<script src="{{url('/js/vue/vue.js')}}"></script>
<script src="{{url('/js/vue/vue-resource.min.js')}}"></script>
<script src="{{url('/js/list.js')}}"></script>
@endsection
