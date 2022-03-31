import { useState } from 'react'


import { Form, Input, Message, Button } from 'semantic-ui-react'
import campaign from '../ethereum/campaign'
import { ethers } from "ethers"
import { useRouter } from 'next/router'
import { provider } from '../ethereum/ethers'

export default ({ address, minimumContribution }) => {
    const router = useRouter()

    const [value, setValue] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const setInputValue = (e) => {
        setValue(e.target.value)
    }

    const submitForm = async (e) => {
        e.preventDefault()
        setError('')
        if (!value.trim() || isNaN(value)) {
            return setError('Please enter valid amount')
        }
        if (parseFloat(value)<parseFloat(minimumContribution)) {
            return setError(`Please enter at least ${minimumContribution} ether!`)
        }
        setLoading(true)
        
        try {
            const campaignContract = await campaign(address)
            
            const tx = await campaignContract.contribute({ value: ethers.utils.parseEther(value) })
            await tx.wait()

            router.replace(`/campaigns/${address}`) 
        } catch (e) {
            console.log(e)
            setError(e.message)
        }
        setLoading(false)
        setValue('')
    }

    return <Form onSubmit={submitForm} error={!!error}>
        <Form.Field>
            <label>Amount to contribute</label>
            <Input
                label="ether"
                labelPosition='right'
                value={value}
                onChange={setInputValue}
            />
        </Form.Field>
        <Message error header="Oops!" content={error}/>
        <Button loading={loading} primary>Contribute</Button>
    </Form>
}