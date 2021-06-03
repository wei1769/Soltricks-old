import React, { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { useConnection } from "../../utils/connection";
import { useWallet } from "../../context/wallet";
import { Button, Input, Typography } from "antd";
import { createAssociatedTokenAccountIx } from "../../utils/token";

export const MintToken = (props) => {
  const { setIns, ins } = props;
  const connection = useConnection();
  const { wallet, connected } = useWallet();
  const [mintAddress, setMintAddress] = useState("");
  const [desAddress, setDesAddress] = useState("");
  const { Title } = Typography;
  const buildInstruction = async (des, mint) => {
    const desPublicKey = new PublicKey(des);
    const mintPublicKey = new PublicKey(mint);
    const [ix, newAddress] = await createAssociatedTokenAccountIx(
      wallet.publicKey,
      desPublicKey,
      mintPublicKey
    );

    return {
      instrunction: ix,
      newTokenAddress: newAddress,
    };
  };
  useEffect(()=>{
    if(connected){
      const ownPublicKey = wallet.publicKey;
      setDesAddress(ownPublicKey.toString());
    }
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Title level={4}>Mint Token</Title>
        <Input
          placeholder="Destination Address"
          style={{ margin: "5px 0" }}
          value={desAddress}
          onChange={(e) => {
            const val = e.target.value;
            setDesAddress(val);
          }}
          onBlur={() => {}}
        />
        <Input
          placeholder="Mint Address"
          style={{ margin: "5px 0" }}
          value={mintAddress}
          onChange={(e) => {
            const val = e.target.value;
            setMintAddress(val);
          }}
          onBlur={() => {}}
        />
        <Button style={{ margin: "1rem 0" }} onClick={ async () => {
          let instructions;
          let newAddress;
          await buildInstruction(desAddress, mintAddress).then(res => {
            console.log(res);
            instructions = [res.instrunction];
            newAddress = res.newTokenAddress;
          });

          const info = [
            {
              'name': 'Destination Address',
              'content': desAddress
            },
            {
              'name': 'New Mint Address',
              'content': newAddress.toString()
            },
          ];
          
          setIns([...ins, {
            name: 'Mint Token',
            type: 'MintToken',
            info,
            instructions
          }])
        }}>
          Add Instruction
        </Button>
      </div>
    </>
  );
};
