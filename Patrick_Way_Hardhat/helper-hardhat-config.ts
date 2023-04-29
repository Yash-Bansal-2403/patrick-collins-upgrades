export interface networkConfigItem {
    name?: string
    subscriptionId?: string
    gasLane?: string
    keepersUpdateInterval?: string
    raffleEntranceFee?: string
    callbackGasLimit?: string
    vrfCoordinatorV2?: string
}

export interface networkConfigInfo {
    [key: number]: networkConfigItem
}

export const networkConfig: networkConfigInfo = {
    31337: {
        name: "localhost",
    },
    11155111: {
        name: "sepolia",
    },
    1: {
        name: "mainnet",
    },
    80001:{
        name:"mumbai"
    }
}

export const developmentChains = ["hardhat", "localhost"]
export const VERIFICATION_BLOCK_CONFIRMATIONS = 6
