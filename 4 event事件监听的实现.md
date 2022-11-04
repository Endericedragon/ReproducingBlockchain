具体参考[event事件监听的实现过程](https://little-grouse-686.notion.site/event-2c33d26396944303ae79f6757ec3f588)

# 00 准备创世块的配置信息

使用`mkdir`指令新建名为`EventListening`的文件夹。在其中，准备放入`genesis.json`文件。

**！不明晰点！原手册中未给出创始块的配置信息。**

解决方法：在研究了启动代码之后，笔者认为使用上一个实验的创始块信息是可行的，如下：

```json
{
    "config": {
        "chainId": 91036,
        "homesteadBlock": 0,
        "eip150Block": 0,
        "eip155Block": 0,
        "eip158Block": 0,
        "byzantiumBlock": 0,
        "constantinopleBlock": 0,
        "petersburgBlock": 0
    },
    "alloc": {},
    "coinbase": "0x0000000000000000000000000000000000000000",
    "difficulty": "0x20000",
    "extraData": "",
    "gasLimit": "0xffffffff",
    "nonce": "0x0000000000000042",
    "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "timestamp": "0x00"
}
```

上述信息被存储于`EventListening/genesis.json`文件中。

# 01 初始化并启动

在`EventListening`文件夹中启动终端，输入如下指令：

```bash
geth1 --datadir ./gethdata --networkid 91036 --port 30303 --rpc --rpcaddr 127.0.0.1 --rpcport 8545 --rpcapi 'db,net,eth,web3,personal' --rpccorsdomain "*" --ws --wsaddr "localhost" --wsport "8546" --wsorigins "*" --nodiscover --allow-insecure-unlock --dev.period 1 init ./genesis.json && geth1 --datadir ./gethdata --networkid 91036 --port 30303 --rpc --rpcaddr 127.0.0.1 --rpcport 8545 --rpcapi 'db,net,eth,web3,personal' --rpccorsdomain "*" --ws --wsaddr "localhost" --wsport "8546" --wsorigins "*" --nodiscover --allow-insecure-unlock --dev.period 1 console
```

以后如果需要重新启动该链，只需运行如下指令即可：

```bash
geth1 --datadir ./gethdata --networkid 91036 --port 30303 --rpc --rpcaddr 127.0.0.1 --rpcport 8545 --rpcapi 'db,net,eth,web3,personal' --rpccorsdomain "*" --ws --wsaddr "localhost" --wsport "8546" --wsorigins "*" --nodiscover --allow-insecure-unlock --dev.period 1 console
```

# 02 创建账户

在01步骤中打开的控制台中输入如下指令：

```js
personal.newAccount("123456")

personal.unlockAccount(eth.accounts[0],"123456",15000)
personal.unlockAccount(eth.accounts[1],"123456",15000)
personal.unlockAccount(eth.accounts[2],"123456",15000)
personal.unlockAccount(eth.accounts[3],"123456",15000)

eth.getBalance(eth.accounts[0])
```

**！不明晰点！在执行第4行的指令时遇到报错，大意是eth.accounts[1]是nil。**

解决方法：目前节点中确实仅存在一个账户。故第1行的指令应该再执行3遍，以创建总计4个账户。四个账户的`password`如下：

```
0xdfc9a16294fb9bf434c4d3b0d94e09b456df8328
0x61607dbe05905df8ebeeb6b471932477c9e29a5a
0x0ebaaeca117b8843460fd3c8627dcebc4e62385d
0x9a7304d35593740d33596696cef86b0e6481cd54
```

为它们在创始块中增加余额：

```json
// genesis.json
{
    // ...
    "alloc": {
        "0xdfc9a16294fb9bf434c4d3b0d94e09b456df8328": {
            "balance": "50000000000000000000000000000000000000000"
        },
        "0x61607dbe05905df8ebeeb6b471932477c9e29a5a": {
            "balance": "50000000000000000000000000000000000000000"
        },
        "0x0ebaaeca117b8843460fd3c8627dcebc4e62385d": {
            "balance": "50000000000000000000000000000000000000000"
        },
        "0x9a7304d35593740d33596696cef86b0e6481cd54": {
            "balance": "50000000000000000000000000000000000000000"
        }
    },
    // ...
}
```

随后，再次启动区块链（使用01中的命令即可）。在控制台中，输入以下命令检查用户的余额：

```json
eth.getBalance(eth.accounts[0])
eth.getBalance(eth.accounts[1])
eth.getBalance(eth.accounts[2])
eth.getBalance(eth.accounts[3])
```



# 03 补全完整合约

根据原复现手册中的描述，需要在合约中新增以下代码：

```solidity
//返回车辆id
event Myevent(
	string res
);

//当车辆状态改变后触发事件，返回车辆id
function setVehicleStatus(string memory uuid) public {
    assert(vehicles[uuid].status == 0);
    emit Myevent(uuid);
    vehicles[uuid].status = 1;
}
```

显然，上述内容并非完整的合约，而是某个合约的一部分。鉴于原代码仓库中并未给出关于该合约的信息，笔者根据上述增添的代码，经过猜想推断，编写了如下的合约代码：

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

contract TestContract {
    struct Vehicle {
        uint256 status;
    }

    mapping(string => Vehicle) vehicles;

    //返回车辆id
    event Myevent(string res);

    //当车辆状态改变后触发事件，返回车辆id
    function setVehicleStatus(string memory uuid) public {
        assert(vehicles[uuid].status == 0);
        emit Myevent(uuid);
        vehicles[uuid].status = 1;
    }
}
```

# 04将上述合约部署到geth创建的私有链上

接下来，我们需要部署上述合约。



首先，访问[Remix IDE](https://remix.ethereum.org)，在`File Explorer`处，新建`TestContract.sol`文件，将上述合约粘贴入该文件后，按下`Ctrl+S`编译，一个叫做`Contract.json`的文件将出现在`File Explorer`中。在其中翻找，会获得两个我们关心的字段：

- `"abi"`

  ```json
   {
       // ...
       "abi": [
  		{
  			"anonymous": false,
  			"inputs": [
  				{
  					"indexed": false,
  					"internalType": "string",
  					"name": "res",
  					"type": "string"
  				}
  			],
  			"name": "Myevent",
  			"type": "event"
  		},
  		{
  			"inputs": [
  				{
  					"internalType": "string",
  					"name": "uuid",
  					"type": "string"
  				}
  			],
  			"name": "setVehicleStatus",
  			"outputs": [],
  			"stateMutability": "nonpayable",
  			"type": "function"
  		}
  	]
       // ...
   }
  ```

- `"bytecode"`

  ```json
  {
      "data": {
      "bytecode": {
  			// ...
  			"object": "608060405234801561001057600080fd5b506103e3806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c8063aa5d485214610030575b600080fd5b61004a6004803603810190610045919061014e565b61004c565b005b6000808260405161005d9190610201565b9081526020016040518091039020600001541461007d5761007c61032a565b5b7fb58728ea1fc0389ea1078b5d1833ae97cedee74c5b53b4f6d4281af24be5867c816040516100ac9190610218565b60405180910390a160016000826040516100c69190610201565b90815260200160405180910390206000018190555050565b60006100f16100ec8461025f565b61023a565b90508281526020810184848401111561010d5761010c61038d565b5b6101188482856102b7565b509392505050565b600082601f83011261013557610134610388565b5b81356101458482602086016100de565b91505092915050565b60006020828403121561016457610163610397565b5b600082013567ffffffffffffffff81111561018257610181610392565b5b61018e84828501610120565b91505092915050565b60006101a282610290565b6101ac818561029b565b93506101bc8185602086016102c6565b6101c58161039c565b840191505092915050565b60006101db82610290565b6101e581856102ac565b93506101f58185602086016102c6565b80840191505092915050565b600061020d82846101d0565b915081905092915050565b600060208201905081810360008301526102328184610197565b905092915050565b6000610244610255565b905061025082826102f9565b919050565b6000604051905090565b600067ffffffffffffffff82111561027a57610279610359565b5b6102838261039c565b9050602081019050919050565b600081519050919050565b600082825260208201905092915050565b600081905092915050565b82818337600083830152505050565b60005b838110156102e45780820151818401526020810190506102c9565b838111156102f3576000848401525b50505050565b6103028261039c565b810181811067ffffffffffffffff8211171561032157610320610359565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052600160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f830116905091905056fea26469706673582212202cc2c0c44399ea872fdfa5140804ce5af72d6b968bb708c7fb9fe046e332684a64736f6c63430008070033",
  			// ...
  		}
      }
  }
  ```

  在01中启动的控制台中，粘贴入以下代码：

  ```js
  abi = JSON.parse('[{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"string\",\"name\":\"res\",\"type\":\"string\"}],\"name\":\"Myevent\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"uuid\",\"type\":\"string\"}],\"name\":\"setVehicleStatus\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]')
  bytecode = "0x608060405234801561001057600080fd5b506103e3806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c8063aa5d485214610030575b600080fd5b61004a6004803603810190610045919061014e565b61004c565b005b6000808260405161005d9190610201565b9081526020016040518091039020600001541461007d5761007c61032a565b5b7fb58728ea1fc0389ea1078b5d1833ae97cedee74c5b53b4f6d4281af24be5867c816040516100ac9190610218565b60405180910390a160016000826040516100c69190610201565b90815260200160405180910390206000018190555050565b60006100f16100ec8461025f565b61023a565b90508281526020810184848401111561010d5761010c61038d565b5b6101188482856102b7565b509392505050565b600082601f83011261013557610134610388565b5b81356101458482602086016100de565b91505092915050565b60006020828403121561016457610163610397565b5b600082013567ffffffffffffffff81111561018257610181610392565b5b61018e84828501610120565b91505092915050565b60006101a282610290565b6101ac818561029b565b93506101bc8185602086016102c6565b6101c58161039c565b840191505092915050565b60006101db82610290565b6101e581856102ac565b93506101f58185602086016102c6565b80840191505092915050565b600061020d82846101d0565b915081905092915050565b600060208201905081810360008301526102328184610197565b905092915050565b6000610244610255565b905061025082826102f9565b919050565b6000604051905090565b600067ffffffffffffffff82111561027a57610279610359565b5b6102838261039c565b9050602081019050919050565b600081519050919050565b600082825260208201905092915050565b600081905092915050565b82818337600083830152505050565b60005b838110156102e45780820151818401526020810190506102c9565b838111156102f3576000848401525b50505050565b6103028261039c565b810181811067ffffffffffffffff8211171561032157610320610359565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052600160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f830116905091905056fea26469706673582212202cc2c0c44399ea872fdfa5140804ce5af72d6b968bb708c7fb9fe046e332684a64736f6c63430008070033"
  QualContract = web3.eth.contract(abi);
  web3.eth.estimateGas({data: bytecode})
  Qual = QualContract.new({
          from: web3.eth.accounts[0], 
          data: bytecode, 
          gas: '1400000',
          position:"w2511111111111",
          txtime:277001
  	}, function (e, contract){
      console.log(e, contract);
      if (!e) {
          if(!contract.address) {
              console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");
          } else {
              console.log("Contract mined! Address: " + contract.address);
              console.log(contract);
          }
      }
  });
  ```

  无报错，确认已经将合约部署到链上了。
  
  # 05 测试
  
  遗憾的是，笔者暂且未找到改变车辆状态的方法，故暂时无法看到效果。该部分将在未来补充完整。