import type { NextPage } from 'next'
import type { ChangeEvent } from 'react'
import Fieldset from '../../design_system/Fieldset/Fieldset'
import formStyles from '../../../styles/forms.module.css'

interface IncludePendingProps {
  includePending: boolean
  onChange?: (includePending: boolean) => void
}

const IncludePending: NextPage<IncludePendingProps> = ({
  includePending,
  onChange
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked)
  }

  return (
    <Fieldset>
      <input
        type='checkbox'
        name='include_pending'
        id='include_pending'
        className={formStyles.checkbox}
        checked={includePending}
        onChange={handleChange}
      />
      <label htmlFor='include_pending' className={formStyles.inputListLabel}>
        Include Pending
      </label>
    </Fieldset>
  )
}

export default IncludePending
