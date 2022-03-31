import { provider, signer } from "./ethers";
import { ethers } from "ethers"

import CampaignFactory from "./build/CampaignFactory.json"

const rinkebyAddress = "0x03F69275D9b11b0bf25b9f9c01003465C74002b9"

export default async () => {
    if (!provider) {
        return console.error("Ethereum client not found! Please install metamask")
    }
    let deployer = signer;
    if (!signer) {
        await provider.send("eth_requestAccounts", []);
        deployer = provider.getSigner()
    }


    const deployerAddress = await deployer.getAddress()
    console.log(deployerAddress)

    if (deployer)
        return new ethers.Contract(rinkebyAddress, CampaignFactory.abi, deployer)
    else return console.error("Please connect to metamask")
}


