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