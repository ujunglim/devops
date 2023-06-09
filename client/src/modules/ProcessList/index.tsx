import { Table, Button, Space, Tooltip, Modal } from "antd";
import { useCallback, useEffect, useState } from "react";
import StatusTag from "../../components/StatusTag";
import { EProcessStatus, EServerAction } from "../../protocol/common/Enums";
import { GetServerList, ProcessInfo } from "../../protocol/get/GetServerList";
import { PostServerAction } from "../../protocol/post/PostServerAction";
import moment from "moment";
import { DATE_FORMAT } from "../../constants";
import { useHistory } from "react-router";
import Card from "../../components/Card";
import { GetIP } from "../../protocol/get/GetIP";
import { setIP } from "../../store/slices/appSlice";
import { useDispatch } from "react-redux";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const ProcessList = () => {
  const [data, setData] = useState<ProcessInfo[]>();
  const [loading, setLoaidng] = useState<boolean>();
  const [modal, contextHolder] = Modal.useModal();
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    const api = new GetIP();
    api
      .get()
      .then((res) => {
        console.log(res.ip);
        dispatch(setIP(res.ip));
      })
      .catch((err) => console.error(err));
  });

  useEffect(() => {
    fetchServerList();
  }, []);

  const fetchServerList = useCallback(() => {
    setLoaidng(true);
    const api = new GetServerList();
    api
      .get()
      .then((res) => {
        const newData = res.processList.map((d: ProcessInfo) => ({
          key: d.name,
          name: d.name,
          cpu: d.cpu,
          memory: d.memory,
          pid: d.pid,
          port: d.port,
          status: d.status,
          up_time: d.up_time,
        }));
        setData(newData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoaidng(false));
  }, []);

  const handleServerAction = async (name: string, action: EServerAction) => {
    setLoaidng(true);
    const api = new PostServerAction();
    api.serverName = name;
    api.action = action;
    api
      .post()
      .then((res) => {
        const newData = res.processList.map((d: ProcessInfo) => {
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
      .finally(() => setLoaidng(false));
  };

  const handleDetail = useCallback(
    (text: string) => {
      history.push(`/detail/${text}`);
    },
    [history]
  );

  const handleModal = useCallback(
    (record: any, action: EServerAction) => {
      modal.confirm({
        title: "Confirm Server Action",
        icon: <ExclamationCircleOutlined />,
        content: `Sure to ${action} ${record.key}?`,
        okText: "Ok",
        cancelText: "Cancel",
        onOk: () => handleServerAction(record.key, action),
      });
    },
    [modal]
  );

  const columns: any = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      render: (text: string) => (
        <a onClick={() => handleDetail(text)}>{text}</a>
      ),
    },
    {
      title: "Cpu",
      dataIndex: "cpu",
      key: "cpu",
      sorter: (a: ProcessInfo, b: ProcessInfo) => a.cpu - b.cpu,
    },
    {
      title: "Memory",
      dataIndex: "memory",
      key: "memory",
      sorter: (a: ProcessInfo, b: ProcessInfo) => a.memory - b.memory,
    },
    {
      title: "PID",
      dataIndex: "pid",
      key: "pid",
      render: (text: number) => (text === -1 ? "-" : text),
      sorter: (a: ProcessInfo, b: ProcessInfo) => a.pid - b.pid,
    },
    {
      title: "port",
      dataIndex: "port",
      key: "port",
      sorter: (a: ProcessInfo, b: ProcessInfo) => a.port - b.port,
    },
    {
      title: "status",
      dataIndex: "status",
      key: "status",
      render: (text: EProcessStatus) => <StatusTag text={text} /> || "-",
      filters: Object.values(EProcessStatus).map((e) => ({
        text: e,
        value: e,
      })),
      onFilter: (value: string, record: any) => {
        console.log(value, record);
        return record.status.indexOf(value) === 0;
      },
    },
    {
      title: "up_time",
      dataIndex: "up_time",
      key: "up_time",
      ellipsis: true,
      render: (text: string) => moment(text).format(DATE_FORMAT) || "-",
      sorter: (a: ProcessInfo, b: ProcessInfo) => {
        return moment(a.up_time).unix() - moment(b.up_time).unix();
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => {
        return (
          <Space size="middle">
            <Tooltip
              title={
                record.status === EProcessStatus.online
                  ? "Server is already online"
                  : ""
              }
            >
              <Button
                onClick={() => handleModal(record, EServerAction.start)}
                disabled={record.status === EProcessStatus.online}
              >
                Start
              </Button>
            </Tooltip>
            <Tooltip
              title={
                record.status === EProcessStatus.stopped
                  ? "Server is already stopped"
                  : ""
              }
            >
              <Button
                onClick={() => handleModal(record, EServerAction.stop)}
                disabled={record.status === EProcessStatus.stopped}
              >
                Stop
              </Button>
            </Tooltip>
          </Space>
        );
      },
    },
  ];
  return (
    <>
      <Card title="Server List">
        <Table dataSource={data} columns={columns} loading={loading} />
      </Card>
      {contextHolder}
    </>
  );
};

export default ProcessList;
