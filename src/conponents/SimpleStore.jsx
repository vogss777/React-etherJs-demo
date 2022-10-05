import React, { useState } from 'react'
import { ethers } from 'ethers'
import SimpleStorage_abi from '../contracts/SimpleStorage_abi.json'
const SimpleStore = () => {
  const contractAddress = '0x59E0B995F71B06A27471d2597d769Fcb6712535A'
  //连接提示
  const [errorMessage, setErrorMessage] = useState(null)
  //地址
  const [defaultAccount, setDefaultAccount] = useState(null)
  //连接钱包的状态钩子函数
  const [connButtonText, setConnButtonText] = useState('Connect Wallet')
  //获取当前值钩子
  const [currentContractVal, setCurrentContractVal] = useState(null)

  //ethers js部分
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  //访问合约
  const [contract, setContract] = useState(null)
  //点击连接钱包
  const connectWalletHandler = () => {
    //检测window是否存在以太坊
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((result) => {
          accountChangedHandler(result[0])
          setConnButtonText('Wallet Connected')
        })
    } else {
      //设置尚未链接消息
      setErrorMessage('Need to install Metamask!')
    }
  }
  //---地址渲染
  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount)
    updateEthers()
  }

  const updateEthers = () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(tempProvider)
    let tempSigner = tempProvider.getSigner()
    setSigner(tempSigner)
    let tempContract = new ethers.Contract(
      contractAddress,
      SimpleStorage_abi,
      tempSigner
    )
    setContract(tempContract)
  }

  //异步部分
  //1.获取当前值asy函数
  const getCurrentVal = async () => {
    //值等于 从合约中访问得值（存储变量）
    let val = await contract.get()
    //更新钩子
    setCurrentContractVal(val)
  }
  //2.更改当前存储值
  const setHandler = (event) => {
    event.preventDefault()
    //搞清楚事件对象event
    console.log('sending ' + event.target.setText.value + ' to the contract')
    contract.set(event.target.setText.value)
  }
  return (
    <div
      className="w-[60%] m-auto mt-16 h-[800px] border
      flex flex-col justify-center items-center border-gray-900 bg-green-300
      text-2xl rounded-lg">
      <div className="my-5 font-bold text-3xl">
        <h3>"Get/Set Interaction with contract!"</h3>
      </div>
      <div>
        <button onClick={connectWalletHandler} className="text-2xl font-bold">
          {connButtonText}
        </button>
      </div>
      <h3 className="text-2xl my-5">Address: {defaultAccount}</h3>
      {/* form 调用set函数 */}
      <form onSubmit={setHandler}>
        <input id="setText" type="text" className="border rounded-lg" />
        <button
          type={'submit'}
          className="mx-3 text-2xl bg-yellow-200 font-bold">
          Update Contract
        </button>
      </form>

      {/* 渲染当前值 */}
      <h3 className="my-5 font-bold">
        Current Storage:{' '}
        <p className="text-yellow-50 font-bold">{currentContractVal}</p>
      </h3>
      <div className="my-5  w-[100%] flex justify-center">
        <button onClick={getCurrentVal} className="w-[350px] font-bold">
          Click to get the current contract content
        </button>
      </div>
      {/* 连接提示 */}
      {errorMessage}
      <div className="mt-10">
        <p className="text-red-900 font-bold">Tip</p>
        <p>1. Contracts are deployed on the RopstenEth test network </p>
        <p>2. Please check your network and connect to MetaMask</p>
        <p>3. Enter any text in the input box</p>
        <p>
          4. Click the Update Contract button to interact with the smartcontract
        </p>
        <p>5. Click to get the current contract content</p>
      </div>
    </div>
  )
}

export default SimpleStore
