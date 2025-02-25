const http = require("http");
const { v4: uuidv4 } = require("uuid");
const errorHandle = require("./errorHandle");

const todos = [
  {
    title: "brush teeth",
    id: uuidv4(),
  },
  {
    title: "do laundry",
    id: uuidv4(),
  },
]; //待辦事項

const requestListener = (req, res) => {
  let body = ""; //用來存放要新增的資料
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

  if (req.url === "/todos" && req.method === "GET") {
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: "success",
        todos,
      })
    );
    res.end();
  } else if (req.url === "/todos" && req.method == "POST") {
    //新增資料
    //req.on是監聽事件的方法，當事件觸發時執行後面的函式
    //"data"是事件的名稱，當有資料傳入時觸發
    req.on("data", (chunk) => {
      body += chunk;
    });
    //"end"是事件的名稱，當資料傳入完畢時觸發
    req.on("end", () => {
      try {
        const todo = JSON.parse(body).title; //將JSON格式的字串轉換成JS物件格式
        if (
          todo !== undefined &&
          typeof todo === "string" &&
          todo.trim() !== ""
        ) {
          const data = { title: todo, id: uuidv4() };
          todos.push(data);
          //新增JS物件格式的資料到todos陣列中
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              status: "success",
              data: todos,
            })
          );
          res.end();
        } else {
          errorHandle(res);
        }
      } catch (er) {
        errorHandle(res);
      }
    });
  } else if (req.url === "/todos" && req.method == "DELETE") {
    todos.length = 0;
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: "success",
        data: todos,
      })
    );
    res.end();
  } else if (req.url.startsWith("/todos/") && req.method == "DELETE") {
    const id = req.url.split("/").pop();
    const index = todos.findIndex((element) => element.id == id);
    if (index !== -1) {
      todos.splice(index, 1);
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: "success",
          data: todos,
        })
      );
      res.end();
    } else {
      errorHandle(res);
    }
  } else if (req.url.startsWith("/todos/") && req.method == "PATCH") {
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        const todo = JSON.parse(body).title; //輸入JSON格式轉js格式
        const id = req.url.split("/").pop();
        const index = todos.findIndex((element) => element.id === id);
        if (
          todo !== undefined &&
          index !== -1 &&
          typeof todo === "string" &&
          todo.trim() !== ""
        ) {
          todos[index].title = todo;
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              status: "success",
              data: todos,
            })
          );
          res.end();
        } else {
          errorHandle(res);
        }
      } catch {
        errorHandle(res);
      }
    });
  } else {
    errorHandle(res);
  }
};

const server = http.createServer(requestListener);
server.listen(3005, () => {
  console.log("伺服器已經啟動在 http://localhost:3005");
});
