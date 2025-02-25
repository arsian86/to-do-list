function errorHandle(res) {
  const headers = {
    "Access-Control-Allow-Headers":
      //允許跨域請求的header，設定為*代表接受所有header
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    //header是http request的一種屬性，用來告訴server這個request的一些資訊
    "Access-Control-Allow-Origin": "*",
    //允許跨域請求的來源，設定為*代表接受所有來源
    "Access-Control-Allow-Methods": "PATCH, POST, GET, OPTIONS, DELETE",
    //允許跨域請求的方法，設定為*代表接受所有方法，以上還少了PUT（更新資料）
    //所有的方法都要大寫
    "Content-Type": "application/json",
  };
  res.writeHead(400, headers);
  res.write(
    JSON.stringify({
      status: "false",
      message: "欄位未填寫正確",
    })
  );
  res.end();
}
module.exports = errorHandle; //函式導出
