import React, { useState } from 'react'
import { ethers } from 'ethers'
import maskIcon from '../icons/mask.png'
//abi
import SimpleStorage_abi from '../contracts/SimpleStorage_abi.json'
const SimpleStore = () => {
  //合约地址
  const contractAddress = '0xE812c2C6Bff797F31046916BDFd2BEb9c895fBee'
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
    let tel = newAccount
    //--- 隐藏地址
    function geTel(tel) {
      return (
        tel.substring(0, 9) + '******************' + tel.substr(tel.length - 1)
      )
    }
    console.log(geTel(tel))
    //--------隐藏地址
    setDefaultAccount(geTel(tel))
    updateEthers()
  }

  const updateEthers = () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(tempProvider)
    let tempSigner = tempProvider.getSigner()
    setSigner(tempSigner)
    let tempContract = new ethers.Contract(
      //合同地址引用（见钩子顶部）
      contractAddress,
      //合同ABI
      SimpleStorage_abi,
      tempSigner
    )
    setContract(tempContract)
  }

  //异步部分
  //1.获取当前值asy函数
  const getCurrentVal = async () => {
    //值等于 从合约中访问得值（存储变量）  异步访问合约get函数
    let val = await contract.get()
    //更新钩子信息
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
    <div className="w-full hidden-[100vh] mb-16">
      <div
        className="w-[60%] m-auto mt-16 h-[800px]
        bg-gray-300/20 text-2xl rounded-lg
        ">
        <div className=" w-full h-20 flex items-center px-10 pt-10">
          <button
            onClick={connectWalletHandler}
            className="text-2xl font-bold bg-red-500
            text-yellow-50 flex w-[370px] h-20 justify-center items-center">
            <img src={maskIcon} alt="" className="w-7 mr-1" />
            {connButtonText}
          </button>
          <h3 className="text-2xl my-5 ml-32 font-bold text-yellow-50">
            <p className="text-3xl text-black shadow-lg font-bold rounded-lg">
              Address:
            </p>
            <p className="shadow-lg">{defaultAccount}</p>
          </h3>
        </div>
        <div className="font-bold text-5xl flex justify-center my-20">
          <h3>"Get/Set Interaction with contract!"</h3>
        </div>
        {/* form 调用set函数 */}
        <form onSubmit={setHandler} className="text-center">
          <input
            id="setText"
            type="text"
            className="border rounded-lg  bg-gray-300/20 h-12 w-[370px]"
          />
          <button
            type={'submit'}
            className="mx-3 text-2xl bg-red-500 font-bold h-12 w-[270px] text-yellow-50">
            Update Contract
          </button>
        </form>

        {/* 渲染当前值 */}
        <h3 className="font-bold text-center mt-10 text-3xl">
          Current Storage:{' '}
          <p className="text-yellow-50 font-bold mt-5">{currentContractVal}</p>
        </h3>
        <div className="my-5  w-[100%] flex justify-center">
          <button
            onClick={getCurrentVal}
            className="w-[350px] font-bold text-yellow-50 h-12">
            Click to read
          </button>
        </div>
        {/* 连接提示 */}
        {errorMessage}
        <div className="mt-10 text-xl ml-20">
          <p className="text-red-900 font-bold">Tip</p>
          <p>1. Contracts are deployed on the BSC test network </p>
          <p>2. Please check your network and connect to MetaMask</p>
          <p>3. Enter any text in the input box</p>
          <p>
            4. Click the Update Contract button to interact with the
            smartcontract
          </p>
          <p>5. Click to get the current contract content</p>
        </div>
      </div>
    </div>
  )
}

export default SimpleStore
