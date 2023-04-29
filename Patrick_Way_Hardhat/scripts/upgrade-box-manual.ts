const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
import verify from "../utils/verify"

async function main() {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS

    log("----------------------------------------------------")

    const boxV2 = await deploy("BoxV2", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(boxV2.address, [])
    }
const accounts = await ethers.getSigners();
    // Upgrade!
    // Not "the hardhat-deploy way"
    const boxProxyAdmin = await ethers.getContract("BoxProxyAdmin")
    const boxProxyAdmin2 = await boxProxyAdmin.connect(accounts[1])
    const transparentProxy = await ethers.getContract("Box_Proxy")
    const txt = await boxProxyAdmin2.getProxyImplementation(transparentProxy.address)
    console.log("Proxy Inplementation is ",txt)
    console.log("boxV2 address is",boxV2.address)

   
    const proxyBox1 = await ethers.getContractAt("Box", transparentProxy.address)
    const version1 = await proxyBox1.version()
    // console.log(version1.toString())
    // console.log("failed XXXXXXXXXXXXXXXXX")
    // const upgradeTx = await boxProxyAdmin2.upgrade(transparentProxy.address, boxV2.address)
    // await upgradeTx.wait(1)
    const proxyBox2 = await ethers.getContractAt("BoxV2", transparentProxy.address)
    const version2 = await proxyBox2.version()
    // console.log(version2.toString())
    log("----------------------------------------------------")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })