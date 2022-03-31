import { provider, signer } from "./ethers";
import { ethers } from "ethers"

import Campaign from "./build/Campaign.json"

export default async (campaignAddress) => {
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
        return new ethers.Contract(campaignAddress, Campaign.abi, deployer)
    else return console.error("Please connect to metamask")
}


