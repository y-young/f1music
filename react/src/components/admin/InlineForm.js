import styles from "./InlineForm.css";
import { Form } from "antd";

const InlineForm = ({ children, ...props }) => (
  <Form layout="inline" className={styles.inlineForm} {...props}>
    {children}
  </Form>
);

export const InlineFormRow = ({ children }) => (
  <div className={styles.inlineFormRow}>{children}</div>
);

export default InlineForm;
