import React, { useEffect, useState } from "react";
import { useConnection, useConnectionConfig } from "../../utils/connection";
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
            setIns([...ins, {
              name:'Close Account',
              instruction: accountAdress
            }])
          }
        }
      >
        Add Instruction
      </Button>

    </div>
  );
}