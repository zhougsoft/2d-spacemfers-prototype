import { forwardRef, useState, type InputHTMLAttributes } from 'react'

const LineDivider = () => <span>&nbsp;|&nbsp;</span>

const NumberInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ ...props }, ref) => (
  <input ref={ref} type="number" style={{ maxWidth: '10rem' }} {...props} />
))

const AdminSection = ({
  buttonLabel,
  inputs = [],
  onSubmit,
  className = 'outline-light',
}: {
  buttonLabel: string
  inputs?: { placeholder: string; key: string; min?: number }[]
  onSubmit: (values: Record<string, number>) => void
  className?: string
}) => {
  const [inputValues, setInputValues] = useState<
    Record<string, number | undefined>
  >(() => {
    const initialValues: Record<string, number | undefined> = {}
    inputs.forEach(input => {
      initialValues[input.key] = undefined
    })
    return initialValues
  })

  const handleInputChange = (key: string, value: number | undefined) => {
    setInputValues(prevValues => ({
      ...prevValues,
      [key]: value,
    }))
  }

  const handleSubmit = () => {
    const definedValues: Record<string, number> = {}
    Object.entries(inputValues).forEach(([key, value]) => {
      definedValues[key] = value ?? 0
    })
    onSubmit(definedValues)
  }

  return (
    <div
      style={{
        display: 'flex',
        marginBottom: '1rem',
        padding: '1rem',
      }}
      className={className}>
      <button onClick={handleSubmit}>{buttonLabel}</button>
      {inputs.map(input => (
        <div key={input.key}>
          <LineDivider />
          <NumberInput
            placeholder={input.placeholder}
            value={
              inputValues[input.key] === undefined ? '' : inputValues[input.key]
            }
            min={input.min ?? 1}
            onChange={e => {
              const val =
                e.target.value === '' ? undefined : parseInt(e.target.value)
              handleInputChange(input.key, val)
            }}
          />
        </div>
      ))}
    </div>
  )
}

export default AdminSection
