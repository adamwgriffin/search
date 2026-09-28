import styles from "./Fieldset.module.css";

export type FieldsetProps = React.FieldsetHTMLAttributes<HTMLFieldSetElement>;

const Fieldset: React.FC<FieldsetProps> = ({ children, ...props }) => {
  return (
    <fieldset className={styles.fieldset} {...props}>
      {children}
    </fieldset>
  );
};

export default Fieldset;
