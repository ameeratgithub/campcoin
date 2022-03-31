import Layout from "../../components/Layout"
import { Form, Button, Input, Message } from 'semantic-ui-react'
import { useState } from "react"
import factory from "../../ethereum/factory"
import { ethers } from "ethers"
import { useRouter } from 'next/router'

export default () => {
    const router = useRouter()
    const [minimumContribution, setMinimumContribution] = useState('')
    const [err, setErr] = useState('')
    const [loading, setLoading] = useState(false)

    const onSubmit = async (ev) => {
        ev.preventDefault()
        setErr('')
        if (!minimumContribution.trim() || isNaN(minimumContribution)) {
            setErr('Please enter valid amount')
            return
        }
        
        setLoading(true)
        try {
            const factoryContract = await factory()
            const tx = await factoryContract.createCampaign(ethers.utils.parseEther(minimumContribution))
            await tx.wait()
            router.push('/')
        } catch (e) {
            console.log(e)
            setErr(e.message)
        }
        setLoading(false)
    }
    return <Layout>
        <h3>Create a Campaign</h3>
        <Form onSubmit={onSubmit} error={!!err}>
            <Form.Field>
                <label>Minimum Contribution</label>
                <Input label="ether" labelPosition="right" value={minimumContribution}
                    onChange={event => setMinimumContribution(event.target.value)} />
            </Form.Field>
            <Message error header="Oops!" content={err} />
            <Button loading={loading} primary>Create</Button>
        </Form>
    </Layout>
}