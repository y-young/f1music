import { BulbOutlined } from "@ant-design/icons";
import styles from "./index.module.less";

const BottomTips = ({ children }) => (
  <div className={styles.tips}>
    <BulbOutlined /> {children}
  </div>
);

export default BottomTips;
