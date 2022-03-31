import Link from 'next/link';
import Layout from '../../../../components/Layout'
import { Button, Table } from 'semantic-ui-react'
import campaign from "../../../../ethereum/campaign"
import RequestRow from '../../../../components/RequestRow';
import { useEffect, useState } from 'react';

import { provider } from '../../../../ethereum/ethers';

export default ({ address, requests, requestsCount, approversCount }) => {
    const { Header, Row, HeaderCell, Body } = Table
    const [summary, setSummary] = useState()
    useEffect(() => {
        checkApproved()
    }, [])

    const checkApproved = async () => {
        const campaignContract = await campaign(address)
        const requestSummary = await Promise.all(
            requests.map((req, index) => campaignContract.getRequestSummary(index))
        )
        setSummary(requestSummary)
        console.log(requestSummary)
    }
    const renderRows = () => {
        return requests.map((req, index) => {
            return <RequestRow key={index} request={req} canApprove={summary && summary[index][0]} canFinalize={summary && summary[index][1]} id={index} address={address} approversCount={approversCount} />
        })
    }
    return <Layout>
        <h3>Requests</h3>
        <Link href={`/campaigns/${address}/requests/new`} passHref>
            <a>
                <Button primary floated='right' style={{marginBottom:'10px'}}>Add Request</Button>
            </a>
        </Link>
        <Table>
            <Header>
                <Row>
                    <HeaderCell>ID</HeaderCell>
                    <HeaderCell>Description</HeaderCell>
                    <HeaderCell>Amount</HeaderCell>
                    <HeaderCell>Recipient</HeaderCell>
                    <HeaderCell>Approval Count</HeaderCell>
                    <HeaderCell>Approve</HeaderCell>
                    <HeaderCell>Finalize</HeaderCell>
                </Row>
            </Header>
            <Body>
                {renderRows()}
            </Body>
        </Table>
        <div>
            Found {requestsCount} requests
        </div>
    </Layout>
}

export async function getServerSideProps({ params }) {
    const { address } = params
    const campaignContract = await campaign(address)
    const requestsCount = await campaignContract.getRequestsCount()
    const approversCount = await campaignContract.approversCount()
    const emptyArr = Array(parseInt(requestsCount.toString())).fill();

    let requests = await Promise.all(
        emptyArr.map((element, index) => {
            return campaignContract.requests(index)
        })
    )
    
    requests = requests.map(({ description, value, recipient, complete, approvalCount }) => {
        return { description, value: value.toString(), recipient, complete, approvalCount: approvalCount.toString() }
    })
    return {
        props: {
            address, requests, requestsCount: requestsCount.toString(), approversCount: approversCount.toString()
        }
    }

}

