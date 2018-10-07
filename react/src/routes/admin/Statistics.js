import React from "react";
import { connect } from "dva";
import { Col, Row, Card, Icon } from "antd";
import styles from "./Statistics.css";

const Statistics = ({ statistics, loading }) => {
  const { data } = statistics;

  const statusIcon = open => {
    return (
      <Icon
        type={open ? "check" : "close"}
        style={{ color: open ? "green" : "red" }}
      />
    );
  };

  const DataCard = ({ title, children }) => {
    return (
      <Card loading={loading.effects["statistics/fetch"]} bodyStyle={{ padding: "20px 24px 8px 24px" }}>
        <div className={styles.card}>
          <div className={styles.cardTop}>
            <div className={styles.metaWrap}>
              <div className={styles.meta}>
                <span>{title}</span>
              </div>
            </div>
          </div>
          <div className={styles.cardContent}>{children}</div>
        </div>
      </Card>
    );
  };

  const colProps = {
    xs: 24,
    sm: 12,
    md: 12,
    lg: 12,
    xl: 6,
    style: { marginBottom: 20 }
  };

  return (
    <div>
      <Row gutter={16}>
        <Col {...colProps}>
          <DataCard title="统计时间">{data.time}</DataCard>
        </Col>
        <Col {...colProps}>
          <DataCard title="状态">
            上传 {statusIcon(data.open_upload)} 投票 {statusIcon(data.open_vote)}
          </DataCard>
        </Col>
        <Col {...colProps}>
          <DataCard title="曲目总数">{data.songs}</DataCard>
        </Col>
        <Col {...colProps}>
          <DataCard title="文件总数">{data.files}</DataCard>
        </Col>
        <Col {...colProps}>
          <DataCard title="上传人数">{data.uploaders}</DataCard>
        </Col>
        <Col {...colProps}>
          <DataCard title="投票总数">{data.votes}</DataCard>
        </Col>
        <Col {...colProps}>
          <DataCard title="投票人数">{data.voters}</DataCard>
        </Col>
        <Col {...colProps}>
          <DataCard title="投票页面访问人数">{data.viewers}</DataCard>
        </Col>
      </Row>
    </div>
  );
};

export default connect(({ statistics, loading }) => ({ statistics, loading }))(
  Statistics
);
