import React from "react";
import { Collapse, Typography } from "antd";
import { CloseOutlined } from '@ant-design/icons';

export const Jobs = (props) => {
  const { ins, setIns } = props;
  const { Title } = Typography;
  const { Panel } = Collapse;
  const callback = () => {};
  const removeIns = (key) => {
    const newIns = ins.filter((i, k) => {
      return k !== key;
    });
    setIns(newIns);
  };

  const PanelHeader = props => {
    const { insIndex, name } = props;
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 'auto',
        width: '60%'
      }}>
        <p style={{margin: 0}}>{'#' + insIndex + ' '+ name}</p>
        <CloseOutlined onClick={()=>removeIns(insIndex)} />
      </div>
    );
  };

  return (
    <Collapse defaultActiveKey={["1"]} onChange={callback}>
      {ins.map((i, k) => {
        return (
          <Panel header={<PanelHeader insIndex={k} name={i.name}/>} key={i.content}>
            {
              i.info.map( i => {
                return (<div key={i.content} style={{display:'flex'}} ><p>{i.name}:</p><p style={{marginLeft:'1rem'}}>{i.content}</p></div>);
              })
            }
          </Panel>
        );
      })}
    </Collapse>
  );
};
