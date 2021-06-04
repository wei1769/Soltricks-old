import React, { useEffect, useState } from "react";
import bs58 from "bs58";
import {
  PublicKey,
} from "@solana/web3.js";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useConnection} from "../../utils/connection";
import { useWallet } from "../../context/wallet";
import { Button, Input, Typography, Tooltip } from "antd";
import { NumericInput } from "../numericInput";
import { TokenSelect } from "../TokenSelect";
import { transferTokenCheck } from "../../utils/token";
import { notify } from "../../utils/notifications";

export const TokenTransfer = (props) => {
  const { setIns, ins } = props;
  const connection = useConnection();
  const { wallet, connected } = useWallet();
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [tokenAddress, settokenAddress] = useState(undefined);
  const { Title } = Typography;

  const buildInstruction = async (source, amount, mint, decimals, address, overrideDestinationCheck = false) => {
    const sourcePublicKey = new PublicKey(source);
    const destinationPublicKey = new PublicKey(address);
    const owner = wallet.publicKey;
    const instructions = await transferTokenCheck({
      connection,
      owner,
      sourcePublicKey,
      destinationPublicKey,
      amount,
      mint: new PublicKey(mint),
      decimals,
      overrideDestinationCheck,
    });

    const info = [
      {
        'name': 'Token Name',
        'content': tokenAddress.label
      },
      {
        'name': 'Recipient',
        'content': address
      },
    ];
    
    return {
      name: 'Token Transfer',
      type: 'TokenTransfer',
      info,
      instructions
    };
  };

  const checkMultiAddress = async (addressInput) => {
    const splitAddress = addressInput.split(",");
    const instructions = [];
    const errorAddress = [];
    for (let k = 0; k < splitAddress.length; k += 1) {
      const decodeAddress = bs58.decode(splitAddress[k].trim());
      console.log(decodeAddress.length);
      if (decodeAddress.length == 32) {
        await buildInstruction(
          tokenAddress.meta,
          amount,
          tokenAddress.mint,
          tokenAddress.decimals,
          splitAddress[k].trim()
        ).then((res) => {
          console.log(res);
          instructions.push(res);
        });
      }else{
        errorAddress.push(k+1);
      }
    }

    if(errorAddress.length > 0){
      const errorMessage = errorAddress.join() + " adress is invalid"
      notify({
        message: "Wrong Address format...",
        description: errorMessage,
        type: "warn",
      });
    }
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
      <Title level={4}>Token Transfer</Title>
      <TokenSelect
        setSelected={settokenAddress}
        placeholder={"Select a Token"}
        selected={tokenAddress}
        valueType="mint"
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "95%",
        }}
      >
        <Input
          placeholder="Recipient's Address"
          style={{ margin: "5px 0", marginRight: "0.5rem" }}
          value={address}
          onChange={(e) => {
            const val = e.target.value;
            setAddress(val);
          }}
          onBlur={() => {}}
        />
        <Tooltip title="You can fill multiple address and use comma to separate it!">
          <InfoCircleOutlined />
        </Tooltip>
      </div>
      <NumericInput
        value={amount}
        style={{ margin: "5px 0" }}
        onChange={(val) => setAmount(val)}
        onBlur={() => {}}
        placeholder="Amount"
      />
      <Button
        style={{ margin: "1rem 0" }}
        onClick={async () => {
          let instructions;
          if (tokenAddress !== undefined) {
            instructions = await checkMultiAddress(address);
            setIns([...ins, ...instructions]);
          }
        }}
      >
        Add Instruction
      </Button>
    </div>
  );
};
