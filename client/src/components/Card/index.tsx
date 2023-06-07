import { FC, CSSProperties } from "react";
import { Card as AntdCard } from "antd";
import styles from "./index.module.less";

interface CardProps {
  title?: string;
  headerIcon?: any;
  children: any;
  className?: string;
  extra?: any;
  style?: CSSProperties;
}

const Card: FC<CardProps> = ({
  title,
  headerIcon,
  children,
  className,
  extra,
  style,
}) => {
  return (
    <div className={`${styles.commonCardWrapper} ${className}`}>
      <AntdCard
        title={
          title ? (
            <div className={styles.title}>
              {headerIcon && <span className={styles.icon}>{headerIcon}</span>}
              {title}
            </div>
          ) : null
        }
        extra={extra}
        style={style}
      >
        {children}
      </AntdCard>
    </div>
  );
};

export default Card;
