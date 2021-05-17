import React from "react";
import { Button, Menu } from "antd";
import { useWallet } from "../context/wallet";
import { AccountInfo } from "./accountInfo";
import { WalletConnect } from "./walletConnect";
import { Link, useHistory, useLocation } from "react-router-dom";

export const AppBar = (props: { left?: JSX.Element; right?: JSX.Element }) => {
  const { connected } = useWallet();
  const location = useLocation();
  const history = useHistory();

  const TopBar = (
    <div className="App-Bar">
      <div className="App-Bar-left">
        <div className="App-logo" />
        {props.left}
      </div>
      <div className="App-Bar-right">
        <WalletConnect>
          <AccountInfo />
        </WalletConnect>
        {props.right}
      </div>
    </div>
  );

  return TopBar;
};
