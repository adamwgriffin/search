import { useId } from 'react'
import styles from './RadioButton.module.css'
import { InputHTMLAttributes } from 'react'

export type RadioButtonProps = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  'name' | 'value' | 'checked' | 'onChange'
> & {
  label: string
}

const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  name,
  value,
  checked,
  onChange
}) => {
  const inputId = `${name}_${value}_${useId()}`

  return (
    <div className={styles.radioButton}>
      <input
        type='radio'
        name={name}
        id={inputId}
        className={styles.radioButtonInput}
        checked={checked}
        onChange={onChange}
        value={value}
      />
      <label htmlFor={inputId} className={styles.radioButtonLabel}>
        {label}
      </label>
    </div>
  )
}

export default RadioButton
