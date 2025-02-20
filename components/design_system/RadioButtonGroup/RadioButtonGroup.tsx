import Fieldset from '../Fieldset/Fieldset'
import Legend from '../Legend/Legend'
import styles from './RadioButtonGroup.module.css'

export type RadioButtonGroupProps = {
  label: string
  children: React.ReactNode
}

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
  label,
  children
}) => {
  return (
    <Fieldset>
      <Legend>{label}</Legend>
      <div className={styles.radioButtonGroup}>{children}</div>
    </Fieldset>
  )
}

export default RadioButtonGroup
