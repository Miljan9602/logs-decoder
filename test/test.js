const expect = require("chai").expect;
const LogsDecoder = require("../index.js");

// Test Params
const testABI = [{"inputs": [{"type": "address", "name": ""}], "constant": true, "name": "isInstantiation", "payable": false, "outputs": [{"type": "bool", "name": ""}], "type": "function"}, {"inputs": [{"type": "address[]", "name": "_owners"}, {"type": "uint256", "name": "_required"}, {"type": "uint256", "name": "_dailyLimit"}], "constant": false, "name": "create", "payable": false, "outputs": [{"type": "address", "name": "wallet"}], "type": "function"}, {"inputs": [{"type": "address", "name": ""}, {"type": "uint256", "name": ""}], "constant": true, "name": "instantiations", "payable": false, "outputs": [{"type": "address", "name": ""}], "type": "function"}, {"inputs": [{"type": "address", "name": "creator"}], "constant": true, "name": "getInstantiationCount", "payable": false, "outputs": [{"type": "uint256", "name": ""}], "type": "function"}, {"inputs": [{"indexed": false, "type": "address", "name": "sender"}, {"indexed": false, "type": "address", "name": "instantiation"}], "type": "event", "name": "ContractInstantiation", "anonymous": false}];
const testArrNumbersABI = [{"constant":false,"inputs":[{"name":"n","type":"uint256[]"}],"name":"numbers","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"}];
const abiV2 = [{"constant":false,"inputs":[{"components":[{"components":[{"internalType":"address","name":"target","type":"address"},{"internalType":"uint256","name":"gasLimit","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"bytes","name":"encodedFunction","type":"bytes"}],"internalType":"struct EIP712Sig.CallData","name":"callData","type":"tuple"},{"components":[{"internalType":"address","name":"senderAccount","type":"address"},{"internalType":"uint256","name":"senderNonce","type":"uint256"},{"internalType":"address","name":"relayAddress","type":"address"},{"internalType":"uint256","name":"pctRelayFee","type":"uint256"}],"internalType":"struct EIP712Sig.RelayData","name":"relayData","type":"tuple"}],"internalType":"struct EIP712Sig.RelayRequest","name":"relayRequest","type":"tuple"},{"internalType":"bytes","name":"signature","type":"bytes"},{"internalType":"bytes","name":"approvalData","type":"bytes"}],"name":"relayCall","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];

const logsDecoder = LogsDecoder.create();

describe("abi decoder", function () {
  it("get abis", () => {
    const abis = logsDecoder.getABIs();
    expect(abis).to.be.an("array");
    expect(abis).to.have.length(0);
  });

  it("add abis", () => {
    logsDecoder.addABI(testABI);
    const abis = logsDecoder.getABIs();
    expect(abis).to.be.an("array");
    expect(abis).to.have.length(5);
    const methodIDs = logsDecoder.getMethodIDs();
    expect(methodIDs).to.be.an("object");
    expect(Object.keys(methodIDs)).to.have.length(5);
  });

  it("add abis generated by ABIEncoderV2", () => {
    logsDecoder.addABI(abiV2);
    const methodIDs = logsDecoder.getMethodIDs();
    const abis = logsDecoder.getABIs();
    expect(abis).to.have.length(6);
    expect(Object.keys(methodIDs)[5]).to.be.equal("d4f8f131");
  });

  it("decode data for ABIEncoderV2 abi", () => {
    logsDecoder.addABI(abiV2);
    const testData = "0xd4f8f1310000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000022000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000050a5cf333fc36a18c8f96b1d1e7a2b013c6267ac000000000000000000000000000000000000000000000000000000000000000000000000000000000000000046dccf96fe3f3beef51c72c68a1f3ad9183a6561000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000254dffcd3277c0b1660f6d42efbb754edababc2b00000000000000000000000000000000000000000000000000000000000f4240000000000000000000000000000000000000000000000000000000059682f000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000642ac0df260000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b68656c6c6f20776f726c640000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000411de3d1ce0d680d92171da7852a1df1a655280126d809b6f10d046a60e257c187684da02cf3fb67e6939ac48459e26f6c0bfdedf70a1e8f6921a4a0ff331448641b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
    const decodedData = logsDecoder.decodeMethod(testData);
    expect(decodedData).to.be.an("object");
    expect(decodedData).to.have.all.keys("name", "params");
    expect(decodedData.name).to.be.a("string");
    expect(decodedData.params).to.be.a("array");
    expect(decodedData.params).to.have.length(3);
    expect(decodedData.params[0].value).to.deep.equal([["0x254dffcd3277C0b1660F6d42EFbB754edaBAbC2B", "1000000", "24000000000", "0x2ac0df260000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b68656c6c6f20776f726c64000000000000000000000000000000000000000000"], ["0x50A5cf333FC36A18c8F96B1D1e7a2B013C6267aC", "0", "0x46DCcF96Fe3f3bEEf51c72c68A1F3Ad9183a6561", "12"]]);
  });

  it("decode data", () => {
    logsDecoder.addABI(testABI);
    const testData = "0x53d9d9100000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000a6d9c5f7d4de3cef51ad3b7235d79ccc95114de5000000000000000000000000a6d9c5f7d4de3cef51ad3b7235d79ccc95114daa";
    const decodedData = logsDecoder.decodeMethod(testData);
    expect(decodedData).to.be.an("object");
    expect(decodedData).to.have.all.keys("name", "params");
    expect(decodedData.name).to.be.a("string");
    expect(decodedData.params).to.be.a("array");
    expect(decodedData.params).to.have.length(3);
    expect(decodedData.params[0].value).to.deep.equal(["0xa6d9c5f7d4de3cef51ad3b7235d79ccc95114de5", "0xa6d9c5f7d4de3cef51ad3b7235d79ccc95114daa"]);
    expect(decodedData.params[0].name).to.equal("_owners");
    expect(decodedData.params[0].type).to.equal("address[]");
    expect(decodedData.params[1].value).to.equal("1");
    expect(decodedData.params[1].name).to.equal("_required");
    expect(decodedData.params[1].type).to.equal("uint256");
    expect(decodedData.params[2].value).to.equal("0");
    expect(decodedData.params[2].name).to.equal("_dailyLimit");
    expect(decodedData.params[2].type).to.equal("uint256");
  });

  it("decode data with arrays", () => {
    logsDecoder.addABI(testArrNumbersABI);
    const testData = "0x3727308100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003";
    const decodedData = logsDecoder.decodeMethod(testData);
    expect(decodedData).to.be.an("object");
    expect(decodedData).to.have.all.keys("name", "params");
    expect(decodedData.name).to.be.a("string");
    expect(decodedData.params).to.be.a("array");
    expect(decodedData.params).to.have.length(1);
    expect(decodedData.params[0].value[0]).to.equal("1");
    expect(decodedData.params[0].value[1]).to.equal("2");
    expect(decodedData.params[0].value[2]).to.equal("3");
    expect(decodedData.params[0].name).to.equal("n");
    expect(decodedData.params[0].type).to.equal("uint256[]");
  });

  it("decode logs without indexed", () => {
    const testLogs = [
      {
        data: "0x00000000000000000000000065039084cc6f4773291a6ed7dcf5bc3a2e894ff3000000000000000000000000435a4167bc34107bd03e267f9d6b869255151a27",
        topics: ["0x4fb057ad4a26ed17a57957fa69c306f11987596069b89521c511fc9a894e6161"],
        address: "0x0457874Bb0a346962128a0C01310d00Fc5bb6a83"
      }
    ];

    const decodedLogs = logsDecoder.decodeLogs(testLogs);
    expect(decodedLogs).to.be.an("array");
    expect(decodedLogs).to.have.length(1);
    expect(decodedLogs[0].name).to.equal("ContractInstantiation");
    expect(decodedLogs[0].events).to.have.length(2);
    expect(decodedLogs[0].address).to.equal("0x0457874Bb0a346962128a0C01310d00Fc5bb6a83");
    expect(decodedLogs[0].events[0].name).to.equal("sender");
    expect(decodedLogs[0].events[0].value).to.equal("0x65039084cc6f4773291a6ed7dcf5bc3a2e894ff3");
    expect(decodedLogs[0].events[0].type).to.equal("address");
    expect(decodedLogs[0].events[1].name).to.equal("instantiation");
    expect(decodedLogs[0].events[1].value).to.equal("0x435a4167bc34107bd03e267f9d6b869255151a27");
    expect(decodedLogs[0].events[1].type).to.equal("address");
  });

  it("decode logs with indexed param", () => {
    const walletABI = [{"inputs": [{"type": "uint256", "name": ""}], "constant": true, "name": "owners", "payable": false, "outputs": [{"type": "address", "name": ""}], "type": "function"}, {"inputs": [{"type": "address", "name": "owner"}], "constant": false, "name": "removeOwner", "payable": false, "outputs": [], "type": "function"}, {"inputs": [{"type": "uint256", "name": "transactionId"}], "constant": false, "name": "revokeConfirmation", "payable": false, "outputs": [], "type": "function"}, {"inputs": [{"type": "address", "name": ""}], "constant": true, "name": "isOwner", "payable": false, "outputs": [{"type": "bool", "name": ""}], "type": "function"}, {"inputs": [{"type": "uint256", "name": ""}, {"type": "address", "name": ""}], "constant": true, "name": "confirmations", "payable": false, "outputs": [{"type": "bool", "name": ""}], "type": "function"}, {"inputs": [], "constant": true, "name": "calcMaxWithdraw", "payable": false, "outputs": [{"type": "uint256", "name": ""}], "type": "function"}, {"inputs": [{"type": "bool", "name": "pending"}, {"type": "bool", "name": "executed"}], "constant": true, "name": "getTransactionCount", "payable": false, "outputs": [{"type": "uint256", "name": "count"}], "type": "function"}, {"inputs": [], "constant": true, "name": "dailyLimit", "payable": false, "outputs": [{"type": "uint256", "name": ""}], "type": "function"}, {"inputs": [], "constant": true, "name": "lastDay", "payable": false, "outputs": [{"type": "uint256", "name": ""}], "type": "function"}, {"inputs": [{"type": "address", "name": "owner"}], "constant": false, "name": "addOwner", "payable": false, "outputs": [], "type": "function"}, {"inputs": [{"type": "uint256", "name": "transactionId"}], "constant": true, "name": "isConfirmed", "payable": false, "outputs": [{"type": "bool", "name": ""}], "type": "function"}, {"inputs": [{"type": "uint256", "name": "transactionId"}], "constant": true, "name": "getConfirmationCount", "payable": false, "outputs": [{"type": "uint256", "name": "count"}], "type": "function"}, {"inputs": [{"type": "uint256", "name": ""}], "constant": true, "name": "transactions", "payable": false, "outputs": [{"type": "address", "name": "destination"}, {"type": "uint256", "name": "value"}, {"type": "bytes", "name": "data"}, {"type": "bool", "name": "executed"}], "type": "function"}, {"inputs": [], "constant": true, "name": "getOwners", "payable": false, "outputs": [{"type": "address[]", "name": ""}], "type": "function"}, {"inputs": [{"type": "uint256", "name": "from"}, {"type": "uint256", "name": "to"}, {"type": "bool", "name": "pending"}, {"type": "bool", "name": "executed"}], "constant": true, "name": "getTransactionIds", "payable": false, "outputs": [{"type": "uint256[]", "name": "_transactionIds"}], "type": "function"}, {"inputs": [{"type": "uint256", "name": "transactionId"}], "constant": true, "name": "getConfirmations", "payable": false, "outputs": [{"type": "address[]", "name": "_confirmations"}], "type": "function"}, {"inputs": [], "constant": true, "name": "transactionCount", "payable": false, "outputs": [{"type": "uint256", "name": ""}], "type": "function"}, {"inputs": [{"type": "uint256", "name": "_required"}], "constant": false, "name": "changeRequirement", "payable": false, "outputs": [], "type": "function"}, {"inputs": [{"type": "uint256", "name": "transactionId"}], "constant": false, "name": "confirmTransaction", "payable": false, "outputs": [], "type": "function"}, {"inputs": [{"type": "address", "name": "destination"}, {"type": "uint256", "name": "value"}, {"type": "bytes", "name": "data"}], "constant": false, "name": "submitTransaction", "payable": false, "outputs": [{"type": "uint256", "name": "transactionId"}], "type": "function"}, {"inputs": [{"type": "uint256", "name": "_dailyLimit"}], "constant": false, "name": "changeDailyLimit", "payable": false, "outputs": [], "type": "function"}, {"inputs": [], "constant": true, "name": "MAX_OWNER_COUNT", "payable": false, "outputs": [{"type": "uint256", "name": ""}], "type": "function"}, {"inputs": [], "constant": true, "name": "required", "payable": false, "outputs": [{"type": "uint256", "name": ""}], "type": "function"}, {"inputs": [{"type": "address", "name": "owner"}, {"type": "address", "name": "newOwner"}], "constant": false, "name": "replaceOwner", "payable": false, "outputs": [], "type": "function"}, {"inputs": [{"type": "uint256", "name": "transactionId"}], "constant": false, "name": "executeTransaction", "payable": false, "outputs": [], "type": "function"}, {"inputs": [], "constant": true, "name": "spentToday", "payable": false, "outputs": [{"type": "uint256", "name": ""}], "type": "function"}, {"inputs": [{"type": "address[]", "name": "_owners"}, {"type": "uint256", "name": "_required"}, {"type": "uint256", "name": "_dailyLimit"}], "type": "constructor"}, {"payable": true, "type": "fallback"}, {"inputs": [{"indexed": false, "type": "uint256", "name": "dailyLimit"}], "type": "event", "name": "DailyLimitChange", "anonymous": false}, {"inputs": [{"indexed": true, "type": "address", "name": "sender"}, {"indexed": true, "type": "uint256", "name": "transactionId"}], "type": "event", "name": "Confirmation", "anonymous": false}, {"inputs": [{"indexed": true, "type": "address", "name": "sender"}, {"indexed": true, "type": "uint256", "name": "transactionId"}], "type": "event", "name": "Revocation", "anonymous": false}, {"inputs": [{"indexed": true, "type": "uint256", "name": "transactionId"}], "type": "event", "name": "Submission", "anonymous": false}, {"inputs": [{"indexed": true, "type": "uint256", "name": "transactionId"}], "type": "event", "name": "Execution", "anonymous": false}, {"inputs": [{"indexed": true, "type": "uint256", "name": "transactionId"}], "type": "event", "name": "ExecutionFailure", "anonymous": false}, {"inputs": [{"indexed": true, "type": "address", "name": "sender"}, {"indexed": false, "type": "uint256", "name": "value"}], "type": "event", "name": "Deposit", "anonymous": false}, {"inputs": [{"indexed": true, "type": "address", "name": "owner"}], "type": "event", "name": "OwnerAddition", "anonymous": false}, {"inputs": [{"indexed": true, "type": "address", "name": "owner"}], "type": "event", "name": "OwnerRemoval", "anonymous": false}, {"inputs": [{"indexed": false, "type": "uint256", "name": "required"}], "type": "event", "name": "RequirementChange", "anonymous": false}];
    logsDecoder.addABI(walletABI);
    const testLogs = [
      {
        data: "0x00000000000000000000000000000000000000000000000000038d7ea4c68000",
        topics: ["0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c", "0x00000000000000000000000005039084cc6f4773291a6ed7dcf5bc3a2e894ff3"],
        address: "0x0457874Bb0a346962128a0C01310d00Fc5bb6a81"
      }
    ];
    const decodedLogs = logsDecoder.decodeLogs(testLogs);
    expect(decodedLogs).to.be.an("array");
    expect(decodedLogs).to.have.length(1);
    expect(decodedLogs[0].name).to.equal("Deposit");
    expect(decodedLogs[0].events).to.have.length(2);
    expect(decodedLogs[0].address).to.equal("0x0457874Bb0a346962128a0C01310d00Fc5bb6a81");
    expect(decodedLogs[0].events[0].name).to.equal("sender");
    expect(decodedLogs[0].events[0].type).to.equal("address");
    expect(decodedLogs[0].events[0].value).to.equal("0x05039084cc6f4773291a6ed7dcf5bc3a2e894ff3");
    expect(decodedLogs[0].events[1].name).to.equal("value");
    expect(decodedLogs[0].events[1].value).to.equal("1000000000000000");
    expect(decodedLogs[0].events[1].type).to.equal("uint256");
  });

  it("decode logs with indexed param and uint value", () => {
    const testABI = [{"anonymous":false,"inputs":[{"indexed":true,"name":"voter","type":"address"},{"indexed":true,"name":"pollId","type":"uint256"},{"indexed":true,"name":"optionId","type":"uint256"}],"name":"Voted","type":"event"}];
    logsDecoder.addABI(testABI);
    const testLogs = [
      {
        data: "0x",
        "topics": [
          "0xea66f58e474bc09f580000e81f31b334d171db387d0c6098ba47bd897741679b",
          "0x00000000000000000000000014341f81df14ca86e1420ec9e6abd343fb1c5bfc",
          "0x0000000000000000000000000000000000000000000000000000000000000022",
          "0x00000000000000000000000000000000000000000000000000000000000000f1"
        ],
        address: "0xF9be8F0945acDdeeDaA64DFCA5Fe9629D0CF8E5D"
      }
    ];
    const decodedLogs = logsDecoder.decodeLogs(testLogs);
    expect(decodedLogs).to.be.an("array");
    expect(decodedLogs).to.have.length(1);
    expect(decodedLogs[0].name).to.equal("Voted");
    expect(decodedLogs[0].events).to.have.length(3);
    expect(decodedLogs[0].address).to.equal("0xF9be8F0945acDdeeDaA64DFCA5Fe9629D0CF8E5D");
    expect(decodedLogs[0].events[0].name).to.equal("voter");
    expect(decodedLogs[0].events[0].type).to.equal("address");
    expect(decodedLogs[0].events[0].value).to.equal("0x14341f81df14ca86e1420ec9e6abd343fb1c5bfc");
    expect(decodedLogs[0].events[1].name).to.equal("pollId");
    expect(decodedLogs[0].events[1].value).to.equal("34");
    expect(decodedLogs[0].events[1].type).to.equal("uint256");
    expect(decodedLogs[0].events[2].name).to.equal("optionId");
    expect(decodedLogs[0].events[2].value).to.equal("241");
    expect(decodedLogs[0].events[2].type).to.equal("uint256");
  });

  it("remove ABI", () => {
    let methods = logsDecoder.getMethodIDs();
    expect(methods).to.be.an("object");
    expect(Object.keys(methods)).to.have.length(44);

    logsDecoder.removeABI(testABI);

    methods = logsDecoder.getMethodIDs();
    expect(methods).to.be.an("object");
    expect(Object.keys(methods)).to.have.length(39);
  });

  it("decode logs for tuple input", () => {
    const testABIWithTuple= [{"anonymous":false,"inputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"}],"indexed":false,"internalType":"struct TestEvent.EventInfo","name":"eventInfo","type":"tuple"}],"name":"Event","type":"event"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"string","name":"_name","type":"string"}],"name":"fireEvent","outputs":[],"stateMutability":"nonpayable","type":"function"}];
    logsDecoder.addABI(testABIWithTuple);
    const testLogsWithTuple=
      [
        {
          data : "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000003e80000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000a666972652d6576656e7400000000000000000000000000000000000000000000",
          topics : ["0xe70874d47996054618fb5fc961c81a9ad9dfdfd01119e36286ef1a9720935598"],
          address: "0xB8A71c450580726bAa7Bfe48b2DBE2b9a2f06764"
        }
      ];

    const decodedLogs = logsDecoder.decodeLogs(testLogsWithTuple);
    expect(decodedLogs).to.be.an("array");
    expect(decodedLogs).to.have.length(1);
    expect(decodedLogs[0].name).to.equal("Event");
    expect(decodedLogs[0].events).to.have.length(1);
    expect(decodedLogs[0].address).to.equal("0xB8A71c450580726bAa7Bfe48b2DBE2b9a2f06764");
    expect(decodedLogs[0].events[0].name).to.equal("eventInfo");
    expect(decodedLogs[0].events[0].value).to.be.an("array");
    expect(decodedLogs[0].events[0].value[0]).to.be.equal("1000");
    expect(decodedLogs[0].events[0].value[1]).to.be.equal("fire-event");
    expect(decodedLogs[0].events[0].type).to.equal("tuple");
  });
});
