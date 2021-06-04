import React, { useEffect, useState } from "react";
import { TokenListProvider } from "@solana/spl-token-registry";
import { useConnection, useConnectionConfig } from "../utils/connection";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "../context/wallet";
import { findAssociatedTokenAddress } from "../utils/token";
import { Select, Spin } from "antd";
import { ReloadOutlined, LoadingOutlined } from "@ant-design/icons";

export const TokenSelect = (props) => {
  const { setSelected, placeholder, valueType, selectMode, selected } = props;
  const { Option, OptGroup } = Select;
  const { wallet, connected } = useWallet();
  const [ownedTokens, setOwnedTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tokenMap, setTokenMap] = useState(new Map());
  const connection = useConnection();
  const connectionConfig = useConnectionConfig();
  const TOKEN_PROGRAM_ID = new PublicKey(
    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
  );

  useEffect(() => {
    new TokenListProvider().resolve().then((tokens) => {
      const tokenList = tokens
        .filterByClusterSlug(connectionConfig.env)
        .getList();

      setTokenMap(
        tokenList.reduce((map, item) => {
          map.set(item.address, item);
          return map;
        }, new Map())
      );
    });
  }, [setTokenMap]);
  useEffect(() => {
    fetchOwnerToken();
  }, [connected, tokenMap]);

  useEffect(() => {
    fetchOwnerToken();
  }, []);

  const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  const fetchOwnerToken = async () => {
    if (connected) {
      setLoading(true);
      const filter = {
        programId: TOKEN_PROGRAM_ID,
      };
      connection
        .getParsedTokenAccountsByOwner(wallet.publicKey, filter)
        .then(async (vals) => {
          const ownedTokenList = [];

          for (let k = 0; k < vals.value.length; k += 1) {
            const {
              account: {
                data: {
                  parsed: { info },
                },
              },
              pubkey: meta,
            } = vals.value[k];
            const mintPublicKey = new PublicKey(info.mint);
            const associatedToken = await findAssociatedTokenAddress(
              wallet.publicKey,
              mintPublicKey
            );
            ownedTokenList.push({
              mint: info.mint,
              amount: info.tokenAmount.uiAmountString,
              meta: meta.toString(),
              decimals: info.tokenAmount.decimals,
              isAssociatedToken: meta.equals(associatedToken),
            });
          }
          const tokens = ownedTokenList.map((ownedToken) => {
            const temp = tokenMap.get(ownedToken.mint);
            if (temp === undefined) {
              const label =
                ownedToken.mint.length > 20
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
                logo: "",
                amount: ownedToken.amount,
                label: label + "(" + ownedToken.amount + ")",
                value: ownedToken[valueType],
                meta: ownedToken.meta,
                decimals: ownedToken.decimals,
                isAssociatedToken: ownedToken.isAssociatedToken,
              };
            } else {
              return {
                name: temp.name,
                symbol: temp.symbol,
                mint: temp.address,
                logo: temp.logoURI,
                amount: ownedToken.amount,
                label: temp.name + "(" + ownedToken.amount + ")",
                value: ownedToken[valueType],
                meta: ownedToken.meta,
                decimals: ownedToken.decimals,
                isAssociatedToken: ownedToken.isAssociatedToken,
              };
            }
          });
          setOwnedTokens(tokens);
        });
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Spin indicator={loadingIcon} spinning={false}>
        <Select
          mode={selectMode}
          value={selected}
          labelInValue
          showSearch
          virtual={false}
          style={{ width: "25rem", margin: "5px 0.5rem" }}
          placeholder={placeholder}
          optionFilterProp="children"
          onDeselect={(deselect) => {
            /*
            const newSelected = selected.filter(s => {
              return s[valueType] != deselect.value;
            });
            setSelected(newSelected);
            */
          }}
          onChange={(val, option) => {
            if (selectMode == "multiple") {
              const value = option
                .map((o) => {
                  const tokenInfo = ownedTokens.filter((token) => {
                    return token.meta == o.key;
                  });

                  return tokenInfo[0];
                })
                .filter((token) => {
                  return token !== undefined;
                });
              console.log(value);

              setSelected([...value]);
            } else {
              const value = ownedTokens.filter((token) => {
                return token.meta == option.key;
              });
              setSelected(value[0]);
            }
          }}
          onFocus={() => {}}
          onBlur={() => {}}
          onSearch={() => {}}
          filterOption={true}
        >
          <OptGroup label="Normal token account">
            {ownedTokens
              .filter((token) => !token.isAssociatedToken)
              .map((token) => {
                console.log(token[valueType]);
                console.log(token);
                return (
                  <Option key={token.meta} value={token[valueType]}>
                    {token.label}
                  </Option>
                );
              })}
          </OptGroup>
          <OptGroup label="Associated token account">
            {ownedTokens
              .filter((token) => token.isAssociatedToken)
              .map((token) => {
                return (
                  <Option key={token.meta} value={token[valueType]}>
                    {token.label}
                  </Option>
                );
              })}
          </OptGroup>
        </Select>
      </Spin>
      <ReloadOutlined
        style={{ display: loading ? "none" : "inherit" }}
        onClick={() => fetchOwnerToken()}
      />
    </div>
  );
};
