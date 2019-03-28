import * as express from 'express'

import {Server} from 'ws'
import * as path from "path";
const app = express();
//将访问的路径修改为根目录下的client下的index.html
app.use('/',express.static(path.join(__dirname,'..','client')));

export class Product {
    constructor(
        public id: number,
        public title: string,
        public price: number,
        public rating: number,
        public desc: string,
        public categories: Array<string>
    ) {}
}
const products:Product[] = [
    new Product(1,"第一个商品",2.6,3.5,"这是第一个商品，这也是我的练习",["蔬菜","水果","牛奶"]),
    new Product(2,"第二个商品",22.22,3.4,"这是第二个商品，这也是我的练习",["蔬菜","水果","牛奶"]),
    new Product(3,"第三个商品",33.33,2.5,"这是第三个商品，这也是我的练习",["蔬菜","水果","牛奶"]),
    new Product(4,"第四个商品",3.9,4.5,"这是第四个商品，这也是我的练习",["蔬菜","水果","牛奶"]),
    new Product(5,"第五个商品",11,2.5,"这是第五个商品，这也是我的练习",["蔬菜","水果","牛奶"]),
    new Product(6,"第六个商品",12.6,3.5,"这是第六个商品，这也是我的练习",["蔬菜","水果","牛奶"]),
];

export class Comment {
    constructor(public id:number,
                public productId:number,
                public timestamp:string,
                public user:string,
                public rating:number,
                public content:string
    ) {}

}


const comments:Comment[] =[
    new Comment(1,2,'2000-09-09','大宝',2.4,'还不错还不错1'),
    new Comment(2,1,'2000-09-09','大宝',3.4,'还不错还不错1'),
    new Comment(3,1,'2000-09-09','大宝',4.6,'还不错还不错1'),
    new Comment(4,2,'2000-09-09','大宝',3,'还不错还不错1'),
    new Comment(5,3,'2000-09-09','大宝',3.6,'还不错还不错1'),
]

app.get('/api/products',(req,res)=>{
    let result = products;
    let params = req.query;
    if(params.title){
        result =result.filter((p) => p.title.indexOf(params.title) !== -1 );
    }
    if(params.price && result.length>0){
        result = result.filter((p) => p.price<= Number(params.price))
    }
    if(params.category && params.category !=='-1' && result.length>0){
        result = result.filter((p) => p.categories.indexOf(params.category) !==-1);
    }
    console.log(result)
    res.json(result)
});
app.get('/api/test',(req,res)=>{
    let params = req.query;
    res.json(products)
});
app.get('/api/products/:id',(req,res)=>{
    res.json(products.find((product)=>product.id==req.params.id))
});
app.get('/api/products/:id/comments',(req,res)=>{
    res.json(comments.filter((comment:Comment)=>comment.productId == req.params.id))
});
const server = app.listen(8000,"localhost",()=>{
    console.log('服务器已启动，地址是:http://localhost:8000')
})

//webSockt服务
const subscriptions = new Map<any,number[]>()
const wsServer =new Server({port:8085});
wsServer.on('connection',websocket=>{
    console.log('服务器已启动，地址是:http://localhost:8085');
    websocket.on('message',message =>{
        // if (typeof message === "string") {
            let messageObj = JSON.parse(<string>message);
            let productIds = subscriptions.get(websocket)||[];
            subscriptions.set(websocket,[...productIds,messageObj.productId])
        // }
    })
})

//生成新的报价
const currentBids = new Map<number,number>()
const time = setInterval(()=>{
    products.forEach(p=>{
        let currentBid = currentBids.get(p.id) || p.price;
        let newBid = currentBid + Math.random()*5;
        currentBids.set(p.id,newBid)
    })
    subscriptions.forEach((productIds:number[],ws)=>{
        if(ws.readyState === 1){
            let newBids = productIds.map(pId=>({
                productId:pId,
                bid:currentBids.get(pId)
            }));
            ws.send(JSON.stringify(newBids))
        }else {
            subscriptions.delete(ws);
        }


    })

},2000)

// setInterval(()=>{
//     clearInterval(time)
// },10000)