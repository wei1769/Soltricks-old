import React, { useEffect, useState } from "react";
import { Button, Card, Input, Typography } from "antd";
import { NumericInput } from "../numericInput";
import { TokenSelect } from "../TokenSelect";

export const TokenTransaction = (props) => {
  const { setIns, ins } = props;
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [tokenAdress, setTokenAdress] = useState("");
  const { Title } = Typography;

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
        style={{ margin: "5rem 0" }}
        onClick={() => {
          setIns([...ins, {
            name:'Token Transaction',
            instruction: {
              mint: tokenAdress,
              destination: address,
              amount: amount
            }
          }])
        }}
      >
        Add Instruction
      </Button>
    </div>
  );
};
