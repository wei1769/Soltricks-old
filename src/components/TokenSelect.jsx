import React, {useEffect, useState} from "react";
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';
import { sendTransaction, useConnection, useConnectionConfig } from "../utils/connection";
import {
  PublicKey,
} from "@solana/web3.js";
import { useWallet } from "../context/wallet";
import { Button, Select, Card, Input } from "antd";
import { NumericInput } from "./numericInput";

export const TokenSelect = props => {
  const { setSelected } = props;
  const { wallet, connected } = useWallet();
  const [ ownedTokens, setOwnedTokens ] = useState([]);
  const [ tokenMap, setTokenMap ] = useState(new Map);
  const connection = useConnection();
  const connectionConfig = useConnectionConfig();
  const TOKEN_PROGRAM_ID = new PublicKey(
    'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  );

  useEffect(() => {
    new TokenListProvider().resolve().then(tokens => {
      const tokenList = tokens.filterByClusterSlug(connectionConfig.env).getList();

      setTokenMap(tokenList.reduce((map, item) => {
        map.set(item.address, item);
        return map;
      },new Map()));
    });
  }, [setTokenMap]);
  useEffect(() => {
    fetchOwnerToken();
  },[connected]);

  const fetchOwnerToken = () => {
    if(connected){
      const filter = {
        programId: TOKEN_PROGRAM_ID
      };
      connection.getParsedTokenAccountsByOwner(
        wallet.publicKey,
        filter
      ).then(vals => {
        const ownedTokenList = vals.value.map(val => {
          const {
              account: {
                data: {
                  parsed: {
                    info
                  }
                }
              }
          } = val;
          return {
            mint: info.mint,
            amount: info.tokenAmount.uiAmountString
          };
        });
        const tokens = ownedTokenList.map(ownedToken => {
          const temp = tokenMap.get(ownedToken.mint);
          if(temp === undefined){
            return {
              name: ownedToken.mint,
              symbol: ownedToken.mint,
              mint: ownedToken.mint,
              logo: '',
              amount: ownedToken.amount,
              label: ownedToken.mint + '(' + ownedToken.amount + ')',
              value: ownedToken.mint
            };
          }else{
            return {
              name: temp.name,
              symbol: temp.symbol,
              mint: temp.address,
              logo: temp.logoURI,
              amount: ownedToken.amount,
              label: temp.name + '(' + ownedToken.amount + ')',
              value: temp.address
            };
          }
        });
        setOwnedTokens(tokens);
      });
    }
  };

  return (
        <Select
          showSearch
          virtual={false}
          style={{ width: 200, margin: '5px 0' }}
          placeholder="Select a token"
          optionFilterProp="children"
          onChange={(vale) => setSelected(vale)}
          onFocus={() => {}}
          onBlur={() => {}}
          onSearch={() => {}}
          options={ownedTokens}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        />
  );
};
