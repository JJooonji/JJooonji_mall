const express = require("express");
const connect = require("./schemas")
const app = express(); //express에 서버 객체를 받아와 app에 담김.
const port = 3000; //localhost:3000으로 오픈

connect();

const goodsRouter = require("./routes/goods");

const requestMiddleware = (req, res, next) => {
    console.log("Request URL", req.originalUrl, " - ", new Date());
    next();//
};

app.use(express.static("static"));
app.use(express.json());//bady에서 json데이터를 사용할 수 있게 해줌.
app.use(express.urlencoded())//json 방식이 아닌 URL Encoded형식으로 데이터를 body로 보낸 것을 이 미들웨어로 데이터를 받아옴.
app.use(requestMiddleware);

app.use("/api", [goodsRouter]);


// //미들웨어 구현//use가 위쪽에 있어야 아래있는 코드들이 영향을 받을 수 있음.
// app.use((req, res, next) => {
//     // console.log("미들웨어가 구현됐나?")
//     // console.log("주소는?", req.path);
//     if(req.path === "/test"){
//         res.send("테스트 주소로 왔구나!")
//     }else{
//         next(); //중요!!다음에 있는 미들웨어로 넘어가게 함. 없으면 무한루프에 빠짐        
//     }
// });

//get이라는 http 메소드로 지정 경로로 요청이 들어왔다면 실행이 됨(아래 '/'는 경로를 나타냄)
app.get("/", (req, res) => {
    res.send("Hello World")
})

//서버를 해당 포트로 켜겠다는 것(listen)->제대로 켜졌다면 두번째의 함수가 실행됨.
app.listen(port, () => {
    console.log(port, "포트로 서버가 켜졌어요!")
});


