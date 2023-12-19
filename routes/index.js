var express = require("express");
var fs = require("fs");
var router = express.Router();
// let todos = [];
//非同步的↓如果直接用todos接不到
// function readFile() {
//   fs.readFile("public/data.json", "utf8", (err, data) => {
//     if (err) {
//       console.error("無法讀取文件: 'data.json'", err);
//       return;
//     }

//     try {
//       const jsonData = JSON.parse(data);
//       console.log("文件內容:", jsonData);
//     } catch (parseError) {
//       console.error(`解析 JSON 發生錯誤:`, parseError);
//     }
//   }); //接json檔案，會自動更新嗎?
// }

const getList = () => {
  return new Promise((resolve, reject) => {
    fs.readFile("public/data.json", "utf8", (err, data) => {
      if (err) {
        reject(err);
      }

      try {
        const jsonData = JSON.parse(data); //把一個 JSON 字串轉換成 JavaScript 的數值或是物件
        resolve(jsonData);
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
};

const writeList = (jsonData) => {
  return new Promise((resolve, reject) => {
    fs.writeFile("public/data.json", JSON.stringify(jsonData), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(jsonData);
      }
    });
  });
};

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "todolist" });
}); //送HTML

//新增
router.get("/add", async (req, res, next) => {
  let todos = [];
  todos = await getList(); //接Json檔案裡的資料，因為getList(牽扯到檔案讀寫皆同)是非同步語法，因此要使用非同步寫法，以async+await+Promise
  const { newEvent } = req.query; //接參數
  todos.push({ id: todos.length, name: newEvent, deleted: false }); //更新陣列
  await writeList(todos); //覆蓋原本的json檔案
  res.json(todos); //同時把陣列內容回傳
});

//刪除
router.get("/remove", async (req, res, next) => {
  let todos = [];
  todos = await getList();
  const { deleteEvent } = req.query;
  todos = todos.map((todo, index) => {
    return {
      ...todo,
      deleted: todo.name === deleteEvent || todo.deleted,
    }; //寫在後面的會覆蓋前面
  }); //把對應事項的delete的改成true
  await writeList(todos);
  res.json(todos);
});

//存取list
router.get("/list", async (req, res, next) => {
  const todos = await getList();
  res.json(todos);
});

module.exports = router;
