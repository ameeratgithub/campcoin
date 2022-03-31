// import { useRouter } from 'next/router'
import Layout from "../../../components/Layout"
import campaign from "../../../ethereum/campaign"
import { ethers } from "ethers"
import { Card, Grid, Button } from "semantic-ui-react"
import ContributeForm from "../../../components/ContributeForm"
import Link from "next/link"

export default (props) => {
    const {
        minimumContribution,
        balance,
        requestCount,
        approversCount,
        manager,
        address
    } = props;

    function renderCards() {
        const items = [
            {
                header: manager,
                meta: 'Address of manager',
                description: 'The manager created this campaign and can create request to withdraw money',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution (ether)',
                description: 'You must contribute at least this amount of ether to contribute',
            },
            {
                header: requestCount,
                meta: 'Number of requests',
                description: 'A request asks for voting to withdraw ether from campaign. Requests must be approved by approvers',
            },
            {
                header: approversCount,
                meta: 'Number of approvers',
                description: 'Number of people who have already donated to the campaign',
            },
            {
                header: balance,
                meta: 'Campaign Balance (ether)',
                description: 'The balance is how much money campaign has left to spend',
            },
        ]
        return <Card.Group items={items} />
    }
    return <Layout>
        <h3>Campaign Show</h3>
        <Grid>
            <Grid.Row>
                <Grid.Column width={10}>
                    {renderCards()}
                </Grid.Column>
                <Grid.Column width={6}> <ContributeForm address={address} minimumContribution={minimumContribution} /></Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <Link href={`/campaigns/${address}/requests`} passHref>
                        <a>
                            <Button primary>View Requests</Button>
                        </a>
                    </Link>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    </Layout>
}

export async function getServerSideProps({ params }) {
    const { address } = params
    const campaignContract = await campaign(address)
    const summary = await campaignContract.getSummary()
    return {
        props: {
            minimumContribution: ethers.utils.formatEther(summary[0]),
            balance: ethers.utils.formatEther(summary[1]),
            approversCount: summary[2].toString(),
            requestCount: summary[3].toString(),
            manager: summary[4],
            address
        }
    }
}