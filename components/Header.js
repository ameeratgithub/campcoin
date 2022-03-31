import { Menu } from 'semantic-ui-react'
import Link from 'next/link'


export default () => {
    return <Menu style={{ marginTop: '10px' }}>
        <Link href="/" passHref>
            <Menu.Item as="a">CampCoin</Menu.Item>
        </Link>
        <Menu.Menu position='right'>
            <Link href="/" passHref>
                <Menu.Item as="a">Campaigns</Menu.Item>
            </Link>
            <Link href="/campaigns/new" passHref>
                <Menu.Item as="a">+</Menu.Item>
            </Link>
        </Menu.Menu>
    </Menu>
}