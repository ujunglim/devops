import { Tag } from "antd";
import React from "react";
import { EProcessStatus } from "../protocol/common/Enums";

interface paramType {
  text: EProcessStatus;
}

// color types
const tagType: any = {
  stopped: "red",
  online: "green",
};

const StatusTag: React.FC<paramType> = ({ text }) => {
  return <Tag color={tagType[text]}>{text}</Tag>;
};

export default StatusTag;
