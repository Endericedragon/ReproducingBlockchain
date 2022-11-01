let test = artifacts.require("TestContract");

module.exports = function (deployer) {
    deployer.deploy(test);
}