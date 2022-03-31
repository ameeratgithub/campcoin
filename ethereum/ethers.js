import { ethers as _e } from "ethers"

let provider, signer;
if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined')

    provider = new _e.providers.Web3Provider(window.ethereum)

else {

    provider = new _e.providers.InfuraProvider('rinkeby', '07e17c859daf4b8dabfda54ab5f12608')

    /* For signing transactions programatically on infura */
    const wallet = new _e.Wallet(process.env.PRIVATE_KEY, provider);
    signer = wallet.connect(provider);
}

export { provider, signer }

