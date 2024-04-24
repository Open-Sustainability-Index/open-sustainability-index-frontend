import React from 'react'
import { Company } from 'types/global'

// import { Company } from 'graphql/__generated__/graphql'
// import { useCreateCompany } from '../../graphql/collections/company/hooks'

interface CreateCompanyFormProps {
  inputs: Partial<Company>
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>
}

const useCreateCompanyForm = (): CreateCompanyFormProps => {
  const [inputs, setInputs] = React.useState<Partial<Company>>({ company_name: '' })
  // const createCompany = useCreateCompany()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event?.preventDefault()
    if (inputs.company_name === '') {
      window.alert('No name provided')
      return
    }
    // await createCompany({ variables: { input: { company: inputs } } })
    // Clear input form when done
    setInputs({ company_name: '' })
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.persist()
    setInputs(inputs => ({ ...inputs, [event.target.name]: event.target.value }))
  }

  return { inputs, handleInputChange, handleSubmit }
}

const CreateCompanyForm = (): React.ReactElement => {
  const { inputs, handleInputChange, handleSubmit } = useCreateCompanyForm()
  return (
    <form onSubmit={(event) => { void handleSubmit(event) }}>
      <input
        type='text'
        placeholder='Enter a company name'
        name='name'
        required
        value={inputs.company_name}
        onChange={handleInputChange}
      />
      <button type='submit'>Add company</button>
      <style jsx>{`
      form {
        margin-top: 1em
      }
    `}
      </style>
    </form>
  )
}
export default CreateCompanyForm
