import factory from "../ethereum/factory"
import { Card, Button } from 'semantic-ui-react'
import Layout from "../components/Layout"
import Link from "next/link"

export default ({ campaigns }) => {
    const renderCampaigns = () => {
        const items = campaigns.map(address => {
            return {
                header: address,
                description: <Link href={`/campaigns/${address}`} passHref>
                        <a>View Campaign</a>
                    </Link>,
                fluid: true
            }
        })
        return <Card.Group items={items} />
    }
    return <Layout>
        <div>
            <h3>Open Campaigns</h3>
            <Link href="/campaigns/new" passHref>
                <Button as="a" floated="right" content="Create Campaign" icon="add circle" primary />
            </Link>
            {renderCampaigns()}

        </div>
    </Layout>
}

export async function getServerSideProps() {
    const factoryContract = await factory()
    let campaigns
    if (factoryContract) {
        campaigns = await factoryContract.getDeployedCampaigns()
        console.log("Serverside Rendered Campaigns", campaigns)
    }
    return {
        props: { campaigns }
    }
}