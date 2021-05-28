import React, {useEffect, useState} from "react";
import { TokenListProvider } from '@solana/spl-token-registry';
import { useConnection, useConnectionConfig } from "../utils/connection";
import {
  PublicKey,
} from "@solana/web3.js";
import { useWallet } from "../context/wallet";
import { Select } from "antd";

export const TokenSelect = props => {
  const { setSelected, placeholder, valueType } = props;
  const { Option } = Select;
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
    console.log('TokenMap useEffect');
  }, [setTokenMap]);
  useEffect(() => {
    fetchOwnerToken();
  },[connected, tokenMap]);

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
              },
              pubkey: meta
          } = val;
          return {
            mint: info.mint,
            amount: info.tokenAmount.uiAmountString,
            meta: meta.toString()
          };
        });
        const tokens = ownedTokenList.map(ownedToken => {
          const temp = tokenMap.get(ownedToken.mint);
          if(temp === undefined){
            const label = ownedToken.mint.length > 20
            ? `${ownedToken.mint.substring(
                0,
                7
              )}.....${ownedToken.mint.substring(
                ownedToken.mint.length - 7,
                ownedToken.mint.length
              )}`
            : ownedToken.mint;
            return {
              name: ownedToken.mint,
              symbol: ownedToken.mint,
              mint: ownedToken.mint,
              logo: '',
              amount: ownedToken.amount,
              label: label + '(' + ownedToken.amount + ')',
              meta: ownedToken.meta
            };
          }else{
            return {
              name: temp.name,
              symbol: temp.symbol,
              mint: temp.address,
              logo: temp.logoURI,
              amount: ownedToken.amount,
              label: temp.name + '(' + ownedToken.amount + ')',
              meta: ownedToken.meta
            };
          }
        });
        setOwnedTokens(tokens);
        console.log(tokens);
      });
    }
  };

  return (
        <Select
          showSearch
          virtual={false}
          style={{ width: '90%', margin: '5px 0' }}
          placeholder={placeholder}
          optionFilterProp="children"
          onChange={(vale) => setSelected(vale)}
          onFocus={() => {}}
          onBlur={() => {}}
          onSearch={() => {}}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {
            ownedTokens.map( token => {
              return <Option key={token.meta} value={token[valueType]}>{token.label}</Option>;
            })
          }
        </Select>
  );
};
