import { Table, Button, Space } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";
import { GetServerList } from "./protocol/get/GetServerList";
import PostSum from "./protocol/post/PostSum";
const SERVER = "http://192.168.199.158:3001";

function App() {
  const [data, setData] = useState();
  const [num1, setNum1] = useState<number>();
  const [num2, setNum2] = useState<number>();
  const [sum, setSum] = useState<number | undefined>();

  const handleSum = (e: any) => {
    e.preventDefault();
    const sumApi = new PostSum();
    sumApi.num1 = num1;
    sumApi.num2 = num2;
    sumApi.post().then((res) => setSum(res?.sum));
  };

  useEffect(() => {
    const api = new GetServerList();
    api
      .get()
      .then((res) => {
        const newData = res.processList.map((d: any) => {
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
        setData(newData as any);
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
      <form onSubmit={handleSum}>
        <input
          type="number"
          value={num1}
          onChange={(e) => setNum1(parseInt(e.target.value))}
        />
        <input
          type="number"
          value={num2}
          onChange={(e) => setNum2(parseInt(e.target.value))}
        />
        <button>submit</button>
      </form>
      <div>{sum || "-"}</div>
      <Table dataSource={data} columns={columns} />
    </div>
  );
}

export default App;
