const PlusIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      viewBox='0 0 16 16'
      height='16'
      width='16'
      focusable='false'
      aria-hidden='true'
      role='presentation'
      className={className}
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M7 1a1 1 0 0 1 2 0v14a1 1 0 1 1-2 0V1z'
      ></path>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M0 8a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H1a1 1 0 0 1-1-1z'
      ></path>
    </svg>
  )
}

export default PlusIcon
