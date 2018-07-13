import React from 'react';
import { connect } from 'dva';
import { AutoComplete, Row, Col, Input, Table, Form, Button, Select, Spin, message } from 'antd';
import { YPlayer } from 'components';

const Search = Input.Search;
const FormItem = Form.Item;
const Option = Select.Option;

const CloudUpload = ({ upload, loading, dispatch }) => {

  const { searchResult } = upload;

  const columns = [
    { dataIndex: "name", title: "曲名" },
    { dataIndex: "artist", title: "歌手", render: (text, row) => { return { children: text.toString() }; } },
    { dataIndex: "album", title: "专辑" }
  ];

  const search = (keyword) => {
    if(keyword) {
      dispatch({ type: 'upload/search', payload: keyword });
    } else {
      message.error("请输入搜索词");
    }
  }

  const getMp3 = (expanded, row) => {
    if(row) {
      console.log(row);
      dispatch({ type: 'upload/fetchMp3', payload: row });
    }
  }

  const renderExpanded = (row) => {
    const source = [row.artist.toString(), row.album];
    return (
      <div>
        <Form layout="inline">
        {/*<Row>
          <Col span={4}>*/}
            <FormItem label="时段">
              <Select placeholder="选择时段" style={{width: "80px"}}>
            <Option value="1">6:30</Option>
            <Option value="2">7:00</Option>
            <Option value="3">13:45</Option>
            <Option value="4">18:40</Option>
            <Option value="5">21:35</Option>
            <Option value="6">22:30</Option>
              </Select>
            </FormItem>
          {/*</Col>
          <Col span={10}>*/}
            <FormItem label="曲名">
              <AutoComplete placeholder="请选择或输入曲名" style={{width: 160}}>
                <Option value={row.name}>{row.name}</Option>
               </AutoComplete>
             </FormItem>
           {/*</Col>
           <Col span={10}>*/}
               <FormItem label="来源" style={{marginLeft: "8px"}}>
                 <AutoComplete placeholder="请选择或输入来源" style={{width: 160}}>
                   <Option value={row.artist.toString()}>{row.artist.toString()}</Option>
                   <Option value={row.album}>{row.album}</Option>
                 </AutoComplete>
               </FormItem>
          {/*</Col>
        </Row>
        <Row>
          <Col span={12}>*/}<br/>
            <FormItem label="试听">
              <Spin spinning={!row.mp3}><YPlayer src={row.mp3} mini={true} /></Spin>
             </FormItem>
           {/*</Col>
           <Col span={12}>*/}
             <FormItem label="上传">
               <Button type="primary" icon="upload">上传</Button>
             </FormItem>
            {/*</Col>
          </Row>*/}
        </Form></div>
        )
      };

  return (
    <div>
      <Search placeholder="搜索音乐" enterButton onSearch={search} onPressEnter={(e) => search(e.target.value)} style={{marginBottom: "10px"}} required maxLength="30" />
    <Table
        dataSource={searchResult}
        columns={columns}
        expandedRowRender={renderExpanded}
        expandRowByClick={true}
        onExpand={getMp3}
        loading={loading.effects['upload/search']}
        rowKey="id"
        pagination={false}
        scroll={true}
        style={{width: "100%"}}
    />
    </div>
  );
};

export default connect(({upload, loading}) => ({upload, loading}))(CloudUpload);
