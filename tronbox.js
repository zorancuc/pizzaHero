module.exports = {
  networks: {
    development: {
// For trontools/quickstart docker image
      // privateKey: 'da146374a75310b9666e834ee4ad0866d6f4035967bfc76217c5a495fff9f0d0',
      // consume_user_resource_percent: 30,
      // fee_limit: 100000000,
      // fullNode: "http://127.0.0.1:9090",
      // solidityNode: "http://127.0.0.1:9090",
      // eventServer: "http://127.0.0.1:9090",
      // network_id: "*"
      // privateKey: '4a7f9d3cac2b005979163418c62caf074f9d3533b27d3dc7cbfa732430566547',
    //  privateKey: 'd3c9322e5493fe9cd012d2a7f552b6c0514d20eec451970e1c0c5850546ea950',
      privateKey: '8e91bf8fabffb479a9b3541f6bbee310c8fc3e64c7c879fa899396056e30597a',
      // privateKey: '1f0a3fe6b37a6ac3970c322e0cba72183c8152c2afd0746a298dfe4eb14343e3',
      consume_user_resource_percent: 30,
      fee_limit: 1000000000,
      fullNode: "https://api.shasta.trongrid.io",
      solidityNode: "https://api.shasta.trongrid.io",
      eventServer: "https://api.shasta.trongrid.io",
      network_id: "*"
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
