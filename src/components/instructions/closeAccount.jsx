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
  const [ accountAdress, setAccountAdress ] = useState({});
  const { wallet, connected } = useWallet();
  const { Title } = Typography;

  const buildInstruction = (account) => {
    const source = new PublicKey(account);
    const  destination = wallet.publicKey;
    const  owner = wallet.publicKey;
    
    return [closeAccount({ source, destination, owner })];
  };

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
        setSelected={setAccountAdress}
        placeholder={'Select a Account'}
        valueType='meta'
      />
      <Button 
        style={{ margin: "1rem 0" }}
        onClick={
          ()=>{
            const emptyAccount = checkAmount(accountAdress.label);
            if(!emptyAccount){
              notify({
                message: "Not empty account",
                description: "Please aware if close not empty account will cause transaction fail.",
                type: "warn",
              });
            }
            const info = [
              {
                'name': 'Token Name',
                'content': accountAdress.label
              },
              {
                'name': 'Token Address',
                'content': accountAdress.meta
              },
            ];
            const instructions = buildInstruction(accountAdress.meta);
            setIns([...ins, {
              name: 'Close Account',
              type: 'CloseAccount',
              info,
              instructions
            }])
          }
        }
      >
        Add Instruction
      </Button>

    </div>
  );
}