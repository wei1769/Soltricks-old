import React from "react";
import Logo from "./soltricks.png";
import { useWallet } from "../context/wallet";
import { AccountInfo } from "./accountInfo";
import { WalletConnect } from "./walletConnect";
import { useHistory, useLocation } from "react-router-dom";

export const AppBar = (props: { left?: JSX.Element; right?: JSX.Element }) => {
  const { connected } = useWallet();
  const location = useLocation();
  const history = useHistory();

  const TopBar = (
    <div className="App-Bar">
      <div className="App-Bar-left">
        <div className="App-logo" style={{backgroundImage: `url(${Logo})`}} />
        <a style={{marginLeft: '1rem'}} href='https://docs.soltricks.io'>Documentation</a>
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
