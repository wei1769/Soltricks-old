import React, { useState } from "react";
import { Button, Card, Popover, Select } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { Settings } from "./settings";
import { AppBar } from "./appBar";
import {
  sendTransaction,
  useConnection,
  useConnectionConfig,
} from "../utils/connection";
import { Jobs } from './jobs/jobs';
import { TokenTransaction } from "./instructions/tokenTransaction";
import { CloseAccount } from './instructions/closeAccount';

export const ManualView = (props) => {
  const [ insBuilder, setInsBuilder ] = useState('');
  const [ ins, setIns ] = useState([]);
  const connection = useConnection();
  const connectionConfig = useConnectionConfig();
  const { Option } = Select;
  const instructionList = [
    {
      name: 'Token Transaction',
      value: 'TokenTransaction'
    },
    { 
      name:'Close Account',
      value: 'CloseAccount'
    }
  ];
  const instructions = {
    'TokenTransaction': <TokenTransaction setIns={setIns} ins={ins} />,
    'CloseAccount': <CloseAccount setIns={setIns} ins={ins} />
  };
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
        <Select
          showSearch
          virtual={false}
          style={{ width: "250px", margin: "5px 0" }}
          placeholder="Select a Builder"
          optionFilterProp="children"
          onChange={(vale) => setInsBuilder(vale)}
          onFocus={() => {}}
          onBlur={() => {}}
          onSearch={() => {}}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {instructionList.map((ins) => {
            return (
              <Option key={ins.value} value={ins.value}>
                {ins.name}
              </Option>
            );
          })}
        </Select>
        <div style={{margin: '2rem'}}>
          <Card
            className="exchange-card"
            headStyle={{ padding: 0 }}
            bodyStyle={{ position: "relative" }}
            tabProps={{
              tabBarGutter: 0,
            }}
          >
            {instructions[insBuilder]}
          </Card>
        </div>
      </div>
      <div
        style={{
          width: "50%",
          margin: "5rem auto",
        }}
      >
        <Jobs ins={ins} setIns={setIns} />
      </div>
    </>
  );
};
