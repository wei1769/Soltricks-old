import React, { useEffect, useState } from "react";
import {
  PublicKey,
} from "@solana/web3.js";
import { useConnection, useConnectionConfig } from "../../utils/connection";
import { useWallet } from "../../context/wallet";
import { Button, Card, Input, Typography } from "antd";
import { NumericInput } from "../numericInput";
import { TokenSelect } from "../TokenSelect";
import { transferChecked, closeAccount } from "../../utils/layout";

export const TokenTransaction = (props) => {
  const { setIns, ins } = props;
  const connection = useConnection();
  const { wallet, connected } = useWallet();
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [tokenAdress, setTokenAdress] = useState("");
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
      <Title level={4}>Token Transaction</Title>
      <TokenSelect 
        setSelected={setTokenAdress}
        placeholder={'Select a Token'}
        valueType='mint'
      />
      <Input
        placeholder="Recipient's Address"
        style={{ margin: "5px 0" }}
        value={address}
        onChange={e => {
          const val = e.target.value;
          setAddress(val);
        }}
        onBlur={() => {}}
      />
      <NumericInput
        value={amount}
        style={{ margin: "5px 0" }}
        onChange={(val) => setAmount(val)}
        onBlur={() => {}}
        placeholder="Amount"
      />
      <Button
        style={{ margin: "1rem 0" }}
        onClick={
          ()=>{
            const info = [
              {
                'name': 'Metadata',
                'content': tokenAdress
              }
            ];
            const instruction = buildInstruction(tokenAdress);
            /*
            setIns([...ins, {
              name: 'Token Transaction',
              type: 'TokenTransaction',
              info,
              instruction
            }])
            */
          }
        }
      >
        Add Instruction
      </Button>
    </div>
  );
};
