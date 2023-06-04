import { Table, Button, Space } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";
const SERVER = "http://192.168.199.158:3001";

function App() {
  const [data, setData] = useState();
  useEffect(() => {
    axios
      .get(SERVER + "/server-list")
      .then((res) => {
        const newData = res?.data.map((d: any) => {
          return {
            key: d.name,
            name: d.name,
            cpu: d.cpu,
            memory: d.memory,
            pid: d.pid,
            port: d.port,
            status: d.status,
            up_time: d.up_time,
          };
        });
        setData(newData);
      })
      .catch((err) => console.error(err))
      .finally(() => {});
  }, []);

  const handleStart = async () => {
    await axios
      .post(SERVER + "/start", {})
      .then()
      .catch();
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Cpu",
      dataIndex: "cpu",
      key: "cpu",
    },
    {
      title: "Memory",
      dataIndex: "memory",
      key: "memory",
    },
    {
      title: "PID",
      dataIndex: "pid",
      key: "pid",
    },
    {
      title: "port",
      dataIndex: "port",
      key: "port",
    },
    {
      title: "status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "up_time",
      dataIndex: "up_time",
      key: "up_time",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button onClick={() => handleStart()}>Start</Button>
          <Button>Stop</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="App">
      <Table dataSource={data} columns={columns} />
    </div>
  );
}

export default App;
