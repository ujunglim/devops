import { Spin } from "antd";
import ReactEcharts from "echarts-for-react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import Card from "../../components/Card";
import { PostLog, logType } from "../../protocol/post/PostLog";
import { PostProcessDetail } from "../../protocol/post/PostProcessDetail";
import { DATE_FORMAT } from "../../constants";
import moment from "moment";
import styles from "./index.module.less";
import { logStatus } from "../../protocol/common/Enums";
import classNames from "classnames";

const ProcessDetail = () => {
  const { name } = useParams<{ name: string }>();
  const [loading, setLoaidng] = useState<boolean>();
  const [data, setData] = useState<any>();
  const [logs, setLogs] = useState<logType[]>([]);

  // fetch graph data
  const fetchGraph = useCallback(() => {
    const api = new PostProcessDetail();
    api.name = name;
    setLoaidng(true);
    api
      .post()
      .then((res) => {
        setData({
          date: res.date,
          values: res?.data,
        });
      })
      .catch((err) => console.error(err))
      .finally(() => setLoaidng(false));
  }, [name]);

  // fetch log data
  const fetchLog = useCallback(() => {
    const logApi = new PostLog();
    logApi.name = name;
    logApi
      .post()
      .then((res) => {
        const newData = res.data.map((d) => ({
          ...d,
          date: moment(d.date).format(DATE_FORMAT),
        }));
        setLogs(newData);
      })
      .catch((err) => console.error(err));
  }, [name]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchGraph();
    }, 2000);
    fetchLog();

    return () => {
      clearInterval(interval);
    };
  }, [fetchGraph, fetchLog, name]);

  const option = {
    tooltip: {
      trigger: "axis",
      borderRadius: 0,
      backgroundColor: "white",
      textStyle: {
        fontFamily: "PingFangSC-Regular",
        fontSize: 12,
        color: "#333333",
        lineHeight: 20,
        fontWeight: 400,
      },
      extraCssText:
        "width:140px; height:65px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.3); padding: 10px",
      formatter: function (params: any) {
        let tipName = "";
        let tipValue = "";
        if (params && params.length > 0) {
          tipName = params[0].name;
          tipValue = `Memory: ${params[0].value.toFixed(2)}GB<br />`;
        }
        return `<div>
              <div style="margin-bottom: 5px;">
                  <span style="color: #999999;">
                      ${tipName}
                  </span>
              </div>
              <div>
                  ${tipValue}
              </div>
          </div>`;
      },
    },
    xAxis: {
      type: "category",
      data: data?.date,
      axisLabel: {
        textStyle: {
          color: "rgba(8, 14, 26, 0.3)",
        },
      },
      boundaryGap: true,
      axisTick: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: "#CCCCCC",
        },
      },
    },
    yAxis: {
      type: "value",
      // min: 30,
      axisLabel: {
        formatter: function (val: string) {
          return val + "GB";
        },
        textStyle: {
          color: "rgba(8, 14, 26, 0.3)",
          padding: [0, 10, 0, 0],
        },
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "#CCCCCC",
        },
      },
    },
    series: [
      {
        data: data?.values,
        type: "line",
        showSymbol: false,
        smooth: true,
        itemStyle: {
          normal: {
            color: "#4f86f4",
            lineStyle: {
              color: "#4f86f4",
            },
          },
        },
      },
    ],
    dataZoom: [
      {
        type: "slider",
        start: 0,
        end: 100,
        show: true,
        height: "8px",
        bottom: "15px",
        borderColor: "transparent",
        fillerColor: "#d3e0fc",
        backgroundColor: "#F2F2F3",
        handleColor: "#4f86f4",
        handleSize: 20,
        showDataShadow: false,
        moveHandleStyle: {
          opacity: 0,
        },
      },
    ],
    grid: {
      left: "3%",
      right: "4%",
      bottom: "10%",
      top: "3%",
      containLabel: true,
    },
  };
  return (
    <Card title={`"${name}" Memory Graph`}>
      <Spin spinning={loading}>
        <ReactEcharts option={option} />
        {logs.map((log) => (
          <p
            className={classNames(
              `${log.type === logStatus.error && styles.errorLog}`
            )}
          >
            {log.date} {log.log}
          </p>
        ))}
      </Spin>
    </Card>
  );
};

export default ProcessDetail;
