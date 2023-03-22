import React from "react";
import { Link } from "dva/router";
import { ArrowRightOutlined } from "@ant-design/icons";

const UploadDescription = () => (
  <>
    <p>
      每位同学最多提交12首推荐曲目(歌曲数*时段数，如某一歌曲被推荐到两个时段计为两首曲目)。一首歌曲在一个时段只能被推荐一次，因此如果同一时段内已有同学推荐此歌曲，系统将予以提示，但仍可推荐到其他时段或提交另一版本。
    </p>

    <h3>硬性要求：</h3>
    <p>
      音频格式只能为 mp3，并请保证有一定质量。歌曲时长控制在2.5-6分钟(特别地，
      <strong>午出门铃声时长须在5分钟以内</strong>
      )，音频文件大小介于2MB-15MB为宜，禁止上传大小超过20MB或小于1MB的文件。
    </p>
    <p>原则上一首歌曲(包括不同版本)在三年内只能当选一次</p>
    <p>
      此外，曲目
      <strong>不得带有任何人声</strong>
      。同时，请各位在挑选音乐的时候明确自己对全体师生的责任，在依据自身审美标准的同时考虑广大人民群众的需求，即歌曲须符合当代中学生审美并且能被大多数同学所接受。
    </p>

    <h3>额外建议：(增加过审概率)</h3>
    <ul>
      <li>
        鉴于广播的音质不佳，
        <strong>不建议</strong>
        曲目带有过多特效音(如流水声、雨声)，播放时可能变为噪音
      </li>
      <li>同理，过于激烈的音乐可能导致破音，不建议上传</li>
      <li>最重要的是想象实际播放情景进行判断</li>
    </ul>
    <hr />

    <h3>手动上传：</h3>
    <p>
      在提交新曲目时，需要参考各时段音乐要求选择一个推荐的播放时段，并填入曲名。“来源”一项表示此曲目的出处，可以填写该曲目来自的专辑、音乐家或节目、游戏等，
      <strong>不是表示上传者</strong>
      。如果不明来源可留空。手动上传时
      <strong>请先填写信息再上传文件</strong>。
    </p>

    <h3>网易云音乐上传(上传不消耗流量):</h3>
    <p>
      请在搜索框内输入要搜索的歌曲名称，按回车键或点击右侧搜索按钮进行搜索，选择曲目时请确保歌曲不带有非伴奏性人声，否则一经发现将直接删除。
    </p>
    <p>
      搜索结果加载完毕后请根据歌曲信息找到您要推荐的曲目，点击左侧“+”符号或点击表格行展开表单，“曲名”和“来源”两项可根据歌曲信息在下拉框中选择，其中“来源”一项将给出歌手名称和专辑名称两个选项，如您发现歌曲信息不准确亦可手动输入或进行修改。
    </p>
    <p>
      <strong>不支持上传无版权或付费歌曲</strong>
      ，上传时将予以提示，请手动上传或更换版本。
    </p>

    <hr />
    <p>
      出于公平性考虑，投票时将隐藏歌曲信息，因此将预先进行审核，对于严重恶搞、不符合要求、以及重复上传的内容，将直接删除。如果投票过程中发现上述情况，请点击播放器右下方的反馈按钮进行反馈，我们会尽快处理。此外，出于同样目的，上传时曲目的标签信息将被删除。但此操作耗时较多，因此上传进度到达100%后可能出现几秒的停顿，请耐心等待。
    </p>

    <p>
      <strong>应德育处要求，鼓励同学们上传优秀的国产歌曲。</strong>
    </p>
    <Link to="/upload" className="redirect">
      <ArrowRightOutlined /> 前往上传
    </Link>
  </>
);

export default UploadDescription;
