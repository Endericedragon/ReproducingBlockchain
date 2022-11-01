具体参考[event事件监听的实现过程](https://little-grouse-686.notion.site/event-2c33d26396944303ae79f6757ec3f588)

# 00 准备创世块的配置信息

使用`mkdir`指令新建名为`EventListening`的文件夹。在其中，准备放入`genesis.json`文件。

**！不明晰点！原手册中并未给出创始块的配置信息。**

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

解决方法：目前节点中确实仅存在一个账户。故第4行到第6行的指令将不予执行。

# 03 在尝试中继续实验

至此，实验复现工作遇到了非常大的障碍。复现手册中描述的步骤过于简略，且并未给出所需的合约`solidity`源文件等必需品；故笔者只能一边猜想一边完成剩余的复现工作。

## 03.01 补全完整合约

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

这很明显不是合约的全部代码，而是某个合约的一部分。鉴于原代码仓库中并未给出任何关于该合约的信息，笔者根据上述增添的代码，大胆猜想推断，编写了如下的合约代码：

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

contract Contract {
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

## 03.02将上述合约部署到geth创建的私有链上

接下来，我们需要部署上述合约。根据原复现手册的只言片语，笔者推测，应该是要将03.01中编写的合约，借助truffle部署到01中创建的私有链上。



该步骤中的操作主要参考此文：[Truffle私有链合约部署](https://blog.csdn.net/George_Clancy/article/details/105309363)。在进行下列步骤前，首先需要根据链接安装`testrpc, solc, solc-cli`。



首先，在`EventListening`文件夹中打开终端，执行：

```bash
truffle unbox
```

**！不明晰点！在执行该步骤的时候报告了网络错误。**

解决方法：为系统设置全局代理。



**！不明晰点！部署受阻，实验暂时终止。**

