import { Button, Table } from 'semantic-ui-react'
import { ethers } from 'ethers'
import campaign from '../ethereum/campaign'
import { useRouter } from 'next/router'
import { useState } from 'react'
export default ({ request, id, approversCount, address, canApprove, canFinalize }) => {
    const { Row, Cell } = Table
    const router = useRouter()
    const [approveLoading, setApproveLoading] = useState(false)
    const [finalizeLoading, setFinalizeLoading] = useState(false)
    const approveRequest = async () => {
        setApproveLoading(true)
        try {
            const campaignContract = await campaign(address)
            const tx = await campaignContract.approveRequest(id)
            await tx.wait()
            router.replace(`/campaigns/${address}/requests`)
        }
        catch (err) { }
        setApproveLoading(false)
    }
    const finalizeRequest = async () => {
        setFinalizeLoading(true)
        try {
            const campaignContract = await campaign(address)
            const tx = await campaignContract.finalizeRequest(id)
            await tx.wait()
            router.replace(`/campaigns/${address}/requests`)
        }
        catch (err) { }
        setFinalizeLoading(false)
    }
    return <Row disabled={request.complete} positive={canFinalize}>
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{ethers.utils.formatEther(request.value)}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>{request.approvalCount}/{approversCount}</Cell>
        {
            request.complete ? <Cell><h4>Completed</h4></Cell> : <>
                <Cell>
                    <Button color='green' loading={approveLoading} basic onClick={approveRequest} disabled={!canApprove}>Approve</Button>
                </Cell>
                <Cell>
                    <Button color='teal' loading={finalizeLoading} basic onClick={finalizeRequest} disabled={!canFinalize}>Finalize</Button>
                </Cell>
            </>
        }
    </Row>
}