import { Form } from "antd";

import styles from "./index.module.less";

const InlineForm = ({ children, ...props }) => (
  <Form className={styles.inlineForm} {...props}>
    {children}
  </Form>
);

export const InlineFormRow = ({ children }) => (
  <div className={styles.inlineFormRow}>{children}</div>
);

export default InlineForm;
