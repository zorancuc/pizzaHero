module.exports = {
  networks: {
    development: {
      from: 'TWR1yKXx7RkLBdci5dXEhKULvykRx9Ec7K',
      privateKey: '9dc46ee4d29fbeddaac396bb66d232a74a5e24c9c763f38f4b04e832cb09b983',
      userFeePercentage: 30,
      feeLimit: 1e9,
      originEnergyLimit: 1e7,
      fullHost: "https://api.shasta.trongrid.io",
      network_id: "*" // Match any network id
  },
    shasta: {
      privateKey: 'd3c9322e5493fe9cd012d2a7f552b6c0514d20eec451970e1c0c5850546ea950',
      consume_user_resource_percent: 30,
      fee_limit: 100000000,
      fullNode: "https://api.shasta.trongrid.io",
      solidityNode: "https://api.shasta.trongrid.io",
      eventServer: "https://api.shasta.trongrid.io",
      network_id: "*"
    },
    mainnet: {
// Don't put your private key here, pass it using an env variable, like:
// PK=da146374a75310b9666e834ee4ad0866d6f4035967bfc76217c5a495fff9f0d0 tronbox migrate --network mainnet
      privateKey: 'f77a614301b3dcaa631d27704d3670f73789206d7ec7cf9ee4aaab027bd32c0e',
      consume_user_resource_percent: 30,
      fee_limit: 100000000,
      fullNode: "https://api.trongrid.io",
      solidityNode: "https://api.trongrid.io",
      eventServer: "https://api.trongrid.io",
      network_id: "*"
    }
  }
};
