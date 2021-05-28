import React from "react";
import { Button, Card, Popover } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { Settings } from "./settings";
import { AppBar } from "./appBar";
import {
  sendTransaction,
  useConnection,
  useConnectionConfig,
} from "../utils/connection";
import { TokenTransaction } from "./instructions/tokenTransaction";
import { CloseAccount } from './instructions/closeAccount';

export const ManualView = (props) => {
  const connection = useConnection();
  const connectionConfig = useConnectionConfig();
  return (
    <>
      <AppBar
        right={
          <Popover
            placement="topRight"
            title="Settings"
            content={<Settings />}
            trigger="click"
          >
            <Button
              shape="circle"
              size="large"
              type="text"
              icon={<SettingOutlined />}
            />
          </Popover>
        }
      />
      <div>
        <Card
          className="exchange-card"
          headStyle={{ padding: 0 }}
          bodyStyle={{ position: "relative" }}
          tabProps={{
            tabBarGutter: 0,
          }}
        >
          <CloseAccount />
        </Card>
        <button onClick={() => console.log(connectionConfig)}>TEST</button>
      </div>
    </>
  );
};
