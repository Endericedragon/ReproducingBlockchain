# 00 准备工作

首先要安装truffle，这一步已经在《0 环境配置》中给出了代码。

# 01 新建一个空项目

使用如下命令，在一个已有的空文件夹（此处以目录`TrufflePlayground`为例）新建一个空项目：

```bash
mkdir TrufflePlayground
cd TrufflePlayground
truffle init
```

# 02 导入并配置

将想要编译的合约复制到`TrufflePlayground/contracts`文件夹下。记录下来文件开头关于`solidity`版本的信息。此处，笔者要编译的合约的开头如下：

```js
pragma solidity ^0.5.16;
// --snip--
```

根据这个信息，找到`TrufflePlayground/truffle-config.js`文件，更改这个字段：

```js
compilers: {
    solc: {
      version: "0.5.17"， // Fetch exact version from solc-bin (default: truffle's version)
      // --snip--
    }
}
```

这里只需满足该节第一步找到的版本信息即可。

# 03 编译并获得结果

在`TrufflePlayground`下执行：

```bash
truffle compile
```

`truffle`将开始编译。如果代码有误，`truffle`将给出错误信息并停止编译；否则将看到形似如下的输出：

```
Compiling your contracts...
===========================
> Compiling ./contracts/StoreMap.sollc-bin. Attempt #1
> Artifacts written to /home/endericedragon/文档/ReproducingBlockchain/CompileWithTruffle/build/contracts
> Compiled successfully using:
   - solc: 0.5.17+commit.d19bba13.Emscripten.clang
```

说明编译成功。

前往`TrufflePlayground/build/contracs`下找到编译获得的`.json`文件，我们需要的就是这个文件中的`abi`和`bytecode`字段的信息。