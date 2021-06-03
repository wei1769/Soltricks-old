import React, { useEffect, useState } from "react";
import { useConnection, useConnectionConfig } from "../../utils/connection";
import { notify } from "../../utils/notifications";
import { closeAccount } from "../../utils/layout";
import {
  PublicKey,
} from "@solana/web3.js";
import { useWallet } from "../../context/wallet";
import { Button, Select, Card, Input, Typography } from "antd";
import { TokenSelect } from '../TokenSelect';

export const CloseAccount = props => {
  const { setIns, ins } = props;
  const connection = useConnection();
  const [ accountAddress, setAccountAddress ] = useState([]);
  const { wallet, connected } = useWallet();
  const { Title } = Typography;

  const buildInstruction = (account) => {
    const source = new PublicKey(account);
    const  destination = wallet.publicKey;
    const  owner = wallet.publicKey;
    
    return closeAccount({ source, destination, owner });
  };

  const buildInstructions = (accounts) => {
    const instructions = [];
    const notEmpty = [];
    accounts.forEach((account, i) => {
      const emptyAccount = checkAmount(account.label); 
      if(!emptyAccount){
        notEmpty.push(i);
      }

      const info = [
        {
          'name': 'Token Name',
          'content': account.label
        },
        {
          'name': 'Token Address',
          'content': account.meta
        },
      ];
      const instruction = buildInstruction(account.meta);
      instructions.push({
        name: 'Close Account',
        type: 'CloseAccount',
        info,
        instructions: [instruction]
      });
    });

    return instructions;
  }

  const checkAmount = txt => {
    let newTxt = txt.split('(');
    let amount
    for (let i = 1; i < newTxt.length; i++) {
      amount = newTxt[i].split(')')[0];
    }
    
    return amount == 0;
  };

  return (
    <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
    >
      <Title level={4}>Close Account</Title>
      <TokenSelect 
        setSelected={setAccountAddress}
        selected={accountAddress}
        placeholder={'Select a Account'}
        valueType='meta'
        selectMode='multiple'
      />
      <Button 
        style={{ margin: "1rem 0" }}
        onClick={
          ()=>{
            const instructions = buildInstructions(accountAddress);
            setIns([...ins, ...instructions]);
            setAccountAddress([]);
          }
        }
      >
        Add Instruction
      </Button>

    </div>
  );
}