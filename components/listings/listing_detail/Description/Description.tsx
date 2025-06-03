import styles from "./Description.module.css";

export type DescriptionProps = {
  description: string | null;
};

const Description: React.FC<DescriptionProps> = ({ description }) => {
  return (
    <div>
      <h4>Description</h4>
      <p className={styles.description}>{description}</p>
    </div>
  );
};

export default Description;
