import React, { useEffect, useState } from "react";
import { Button, Card, Input } from "antd";
import { NumericInput } from "../numericInput";
import { TokenSelect } from "../TokenSelect";

export const TokenTransaction = (props) => {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [tokenAdress, setTokenAdress] = useState("");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <TokenSelect setSelected={setTokenAdress} />
      <Input
        placeholder="Recipient's Address"
        style={{ margin: "5px 0" }}
        value={address}
        onChange={(val) => setAddress(val)}
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
        style={{ margin: "10px 0" }}
        onClick={() => console.log(tokenAdress)}
      >
        Add Instruction
      </Button>
    </div>
  );
};
