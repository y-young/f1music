import styles from "./index.module.less";
import { Form } from "antd";

const InlineForm = ({ children, ...props }) => (
  <Form className={styles.inlineForm} {...props}>
    {children}
  </Form>
);

export const InlineFormRow = ({ children }) => (
  <div className={styles.inlineFormRow}>{children}</div>
);

export default InlineForm;
