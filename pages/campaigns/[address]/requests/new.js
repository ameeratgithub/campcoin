import { useRouter } from 'next/router'
import { Form, Button, Message, Input } from "semantic-ui-react"

import { provider } from "../../../../ethereum/ethers"
import { ethers } from 'ethers'

import Link from 'next/link'

import Layout from '../../../../components/Layout'
import { useState } from 'react'
import campaign from '../../../../ethereum/campaign'

export default ({ address, balance }) => {
    const router = useRouter()
    // const { address } = router.query;

    const [description, setDescription] = useState('')
    const [value, setValue] = useState('')
    const [recipient, setRecipient] = useState('')

    const [error, setError] = useState('')
    const [loading, setLoading] = useState('')

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        if (validateInputs()) {
            try {
                const campaignContract = await campaign(address)
                const tx = await campaignContract.createRequest(description, ethers.utils.parseEther(value), recipient)
                const reciept = await tx.wait()
                router.replace(`/campaigns/${address}/requests`)
            } catch (err) {
                setError(err.message)
            }
        }

        setLoading(false)
    }
    const validateInputs = () => {
        setError('')
        if (!description.trim())
            return setError('Please enter description')
        if (!value.trim() || isNaN(value))
            return setError('Please enter valid amount')
        if (parseFloat(value) > parseFloat(balance))
            return setError(`Campaign has just ${balance} ethers!`)
        if (!recipient.trim())
            return setError('Please enter valid recipient')
        return true;
    }
    return <Layout>
        <Link href={`/campaigns/${address}/requests`} passHref>
            <a>
                Back
            </a>
        </Link>
        <h3>Create a Request</h3>
        <Form onSubmit={onSubmit} error={!!error}>
            <Form.Field>
                <label>Description</label>
                <Input value={description} onChange={e => setDescription(e.target.value)} />
            </Form.Field>
            <Form.Field>
                <label>Amount in Ether</label>
                <Input label="ether" labelPosition='right' value={value} onChange={e => setValue(e.target.value)} />
            </Form.Field>
            <Form.Field>
                <label>Recipient</label>
                <Input value={recipient} onChange={e => setRecipient(e.target.value)} />
            </Form.Field>
            <Message error header="Oops!" content={error} />
            <Button primary loading={loading}>Create</Button>
        </Form>
    </Layout>
}

export async function getServerSideProps({ params }) {
    const { address } = params
    let balance = await provider.getBalance(address)
    balance = ethers.utils.formatEther(balance)

    return {
        props: { address, balance }
    }
}
