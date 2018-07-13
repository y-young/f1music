import React from 'react';
import { Form, Input, Icon, Select, Upload, message } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class ManualUpload extends React.Component {
//({ upload, loading,form }) => {

  state = {
    fileList: []
  }

  getFormData = () => {
    const { getFieldsValue } = this.props.form;
    const data = getFieldsValue();
    return data;
  };

  beforeUpload = (file) => {
    const { validateFieldsAndScroll } = this.props.form;
    let error = false;
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        message.error('请修正所有错误后再上传');
        error = true;
        return;
      }
    });
    this.setState({ fileList: [] });
    if(error) {
      return false;
    }

    const isMp3 = file.type === 'audio/mp3';
    const tooBig = file.size / 1024 / 1024 > 20;
    const tooSmall = file.size / 1024 / 1024 < 1;
      
    if(!isMp3) {
      message.error('只能上传mp3文件');
      return false;
    }
    if (tooBig) {
      message.error('上传歌曲大小不能超过 20MB!');
      return false;
    }
    if (tooSmall) {
      message.error('为保证音乐质量，请上传一个至少 1MB的文件!');
      return false;
    }
    return true;
  }

  onChange = (info) => {
    let { file } = info;
    const { response } = file;
    if (file.status !== 'uploading') {
      console.log(file, info.fileList);
    }
    if (file.status === 'done') {
      console.log(response);
      if(response.error === 0) {
        message.success('上传成功');
      } else {
        message.error(response.msg);
        file.status = 'error';
      }
    } else if (file.status === 'error') {
        message.error('文件上传失败');
    }
    this.setState({ fileList: [ file ] });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 20 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <Form>
        <FormItem {...formItemLayout} label="时段" hasFeedback>
        {getFieldDecorator('time', {
          rules: [
            { required: true, message: '请选择时段' },
          ]
        })(
          <Select placeholder="选择时段" style={{width: "120px"}}>
            <Option value="1">6:30</Option>
            <Option value="2">7:00</Option>
            <Option value="3">13:45</Option>
            <Option value="4">18:40</Option>
            <Option value="5">21:35</Option>
            <Option value="6">22:30</Option>
          </Select>)}
        </FormItem>
        <FormItem {...formItemLayout} label="曲名" hasFeedback>
        {getFieldDecorator('name', {
          rules: [
            { required: true, message: '请填写曲名' },
          ]
        })(
          <Input placeholder="歌曲名称" maxLength="30"/>)}
        </FormItem>
        <FormItem {...formItemLayout} label="来源" hasFeedback>
        {getFieldDecorator('origin')(
          <Input placeholder="该曲目来自的专辑,音乐家或节目,游戏等,不是表示上传者,可以留空" maxLength="50"/>)}
        </FormItem>
        <FormItem {...formItemLayout} label="上传文件">
        {/* {getFieldDecorator('file')( */}
          <Upload.Dragger
            fileList={this.state.fileList}
            action="/api/Upload"
            data={this.getFormData}
            accept="audio/mpeg"
            beforeUpload={this.beforeUpload}
            onChange={this.onChange}
            with-credentials={true}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">将文件拖到此处，或<em>点击上传</em></p>
            <p className="ant-upload-hint">只能上传mp3文件，且大小不超过20MB</p>
          </Upload.Dragger>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(ManualUpload);