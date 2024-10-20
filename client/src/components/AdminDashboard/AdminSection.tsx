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
}: {
  buttonLabel: string
  inputs?: { placeholder: string; key: string; min?: number }[]
  onSubmit: (values: Record<string, number>) => void
}) => {
  const [inputValues, setInputValues] = useState<Record<string, number>>({})

  const handleInputChange = (key: string, value: number) => {
    setInputValues(prevValues => ({
      ...prevValues,
      [key]: value,
    }))
  }

  const handleSubmit = () => onSubmit(inputValues)

  return (
    <div
      style={{
        display: 'flex',
        border: '2px dotted black',
        marginBottom: '1rem',
        padding: '1rem',
      }}>
      <button onClick={handleSubmit}>{buttonLabel}</button>
      {inputs.map(input => (
        <div key={input.key}>
          <LineDivider />
          <NumberInput
            placeholder={input.placeholder}
            value={inputValues[input.key] ?? ''}
            min={input.min ?? 1}
            onChange={e =>
              handleInputChange(input.key, parseInt(e.target.value))
            }
          />
        </div>
      ))}
    </div>
  )
}

export default AdminSection
