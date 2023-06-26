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

pm2 start pm2.config.json

그래프 data 구조

```js
{
  date: number[]
}

```
