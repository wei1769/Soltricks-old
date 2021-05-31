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
import { transferTokenCheck } from "../../utils/token";

export const TokenTransfer = (props) => {
  const { setIns, ins } = props;
  const connection = useConnection();
  const { wallet, connected } = useWallet();
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [tokenAdress, setTokenAdress] = useState({});
  const { Title } = Typography;

  const buildInstruction = async (source, amount, mint, decimals, overrideDestinationCheck = false) => {
    const sourcePublicKey = new PublicKey(source);
    const destinationPublicKey = new PublicKey(address);
    const owner = wallet.publicKey;
    console.log(owner);
    const instructions = transferTokenCheck({
      connection,
      owner,
      sourcePublicKey,
      destinationPublicKey,
      amount,
      mint: new PublicKey(mint),
      decimals,
      overrideDestinationCheck,
    })
    
    return instructions;
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
          async ()=>{
            let instructions;
            await buildInstruction(
              tokenAdress.meta, 
              amount, 
              tokenAdress.mint, 
              tokenAdress.decimals,
            ).then(res => {
              instructions = res;
              console.log(res);
            });

            const info = [
              {
                'name': 'Token Name',
                'content': tokenAdress.label
              },
              {
                'name': 'Recipient',
                'content': address
              },
            ];
            
            setIns([...ins, {
              name: 'Token Transaction',
              type: 'TokenTransaction',
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
};
