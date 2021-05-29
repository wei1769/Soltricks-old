import React, { useEffect, useState } from "react";
import { useConnection, useConnectionConfig } from "../../utils/connection";
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
  const [ accountAdress, setAccountAdress ] = useState('');
  const { wallet, connected } = useWallet();
  const { Title } = Typography;

  const buildInstruction = (account) => {
    const source = new PublicKey(account);
    const  destination = wallet.publicKey;
    const  owner = wallet.publicKey;
    
    return closeAccount({ source, destination, owner });
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
            const info = [
              {
                'name': 'Metadata',
                'content': accountAdress
              }
            ];
            const instruction = buildInstruction(accountAdress);
            setIns([...ins, {
              name: 'Close Account',
              type: 'CloseAccount',
              info,
              instruction
            }])
          }
        }
      >
        Add Instruction
      </Button>

    </div>
  );
}