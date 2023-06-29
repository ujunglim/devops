pm2 start name
pm2 stop name
pm2 delete name
pm2 list

Make sure your vpn is turned off

## Get local ip

```js
app.get("/ip", async (req, res) => {
  const ip = req.socket.remoteAddress;
  res.status(200).json({
    ip: ip?.split("::ffff:")[1] + ":" + PORT,
    errorcode: ErrorCode.success,
  });
});
```

https://iq.opengenus.org/get-ip-addresses-using-javascript/

## Start Process

```
D:\桌面\devops\server\configs>pm2 start pm2.config.json
```

```js
{
  date: string[],
  data: {
    app1: number[],
    app2: number[],
  }
}

```

# Add time to log file

add following config to json

```js
"log_date_format": "YYYY-MM-DD HH:mm:ss"
```

# Merge out, error log and sort by time
