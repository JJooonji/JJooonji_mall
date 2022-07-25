const express = require("express")
const Goods = require("../schemas/goods") //..은 상위 폴더로 가는 경로
const Cart = require("../schemas/cart");
const router = express.Router();

router.get("/goods/cart", async (req, res) => {
  const carts = await Cart.find()
  const goodsIds = carts.map((cart) => cart.goodsId)

  const goods = await Goods.find({ goodsId: goodsIds})

  res.json({
      carts: carts.map((cart) => {
          return {
              quantity: cart.quantity,
              goods: goods.find((item) => item.goodsId === cart.goodsId)
          };
      }),
  });
})

router.get("/", (req, res) => {
    res.send("this is root page");
});

router.get("/goods", async (req, res) =>{
  const { category } = req.query;

  const goods = await Goods.find({ category });

    res.json({
        goods, 
    })
});

router.get("/goods/:goodsId", async (req, res) => {
    const { goodsId } = req.params;

    const [detail] = await Goods.find({ goodsId: Number(goodsId) });

    res.json({
        detail,
    })
    //const [detail] ~ detail:detail과 같은 의미의 코드
    // res.json({
    //     detail: goods.filter((item) => item.goodsId === Number(goodsId))
    // })[0]
});

//상품추가
router.post("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params //파라미터로 담아오는 모든 값은 문자열
  const { quantity } = req.body;

  const existsCarts = await Cart.find({ goodsId : Number(goodsId)});
  if(existsCarts.length) {
    return res.status(400).json({success: false, errorMessage: "이미 장바구니에 들어있는 상품입니다."})
  }

  await Cart.create({ goodsId : Number(goodsId), quantity })
  res.json({ success:true })//응답이 반드시 필요

})

router.delete("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params //파라미터로 담아오는 모든 값은 문자열 

  const existsCarts = await Cart.find({ goodsId : Number(goodsId)});
  if(existsCarts.length) {
    await Cart.deleteOne({ goodsId: Number(goodsId) });
  }

  res.json({ success: true })
})

router.put("/goods/:goodsId/cart", async(req, res) => {
  const { goodsId } = req.params
  const { quantity } = req.body;//body는 json 데이터를 그대로 넘겨받기대문에 type까지 그대로 넘겨받을 수 있어 형변환하지않음.

  if(quantity < 1){
    return res.status(400).json({
      errorMessage: "1이상의 값만 입력할 수 있습니다."
    });//리턴값을 입력해야 조건에 맞았을 때 아래의 코드가 실행이 안됨.
  }

  const existsCarts = await Cart.find({ goodsId : Number(goodsId)});
  if(!existsCarts.length) {
    await Cart.updateOne({ goodsId: Number(goodsId) }, {$set: { quantity }})    
  }

  res.json({ success: true })
});

//상품 생성 api
router.post("/goods", async (req, res) => {
  const { goodsId, name, thumbnailUrl, category, price } = req.body;

  const goods = await Goods.find({ goodsId });
  if(goods.length) {
    return res
      .status(400)
      .json({ success: false, errorMessage: "이미 있는 데이터입니다" })
  }

  const createdGoods = await Goods.create({ 
    goodsId, 
    name, 
    thumbnailUrl, 
    category, 
    price })

  res.json({ goods: createdGoods })
})

//router을 모듈로써 내보낸다는 의미
module.exports = router;