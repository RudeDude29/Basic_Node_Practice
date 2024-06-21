// const http = require('http');

// const app=http.createServer((req,res)=>{
//     // res.write('Welcome Js');
//     // res.setHeader('Content-Type',"text/plain");

//     res.writeHead(200,{
//         'Context-Type':'text/html'
//     })

//     res.end(`
//         <html lang="en">
//         <head>
//              <style>
//                    body{
//                    padding:24px;
//                    background:lime;
//                    }
//               </style>
//         </head>
//         <body>
//         <h1>Welcome!</h1>
//         </body>
//         </html>           
//         `);
// })

// app.listen(1400);

// http status codes  

const http =require('http');
const fsPromise = require('fs/promises');
const fs =require('fs');
const url = require('url')
const dataText=fs.readFileSync(`${__dirname}/dummyData.json`,{encoding:'utf-8'})
const data = JSON.parse(dataText);
console.log(data);

const app = http.createServer(async (req,res)=>{
    // console.log(Object.keys(req))
    res.writeHead(200,{
        'Content-Type':'text/html'
    });
    
    // console.log(req) 
    const { query, pathname } = url.parse(req.url, true);

    switch (pathname) {
        case "/": {
            const bf = await fsPromise.readFile(`${__dirname}/homepage.html`);
            res.end(bf);
            break;
        }
        case "/products": {
            const bf = await fsPromise.readFile(`${__dirname}/LandingPage.html`);
            let text = bf.toString();
            let productsText = "";
            for (let i = 0; i < data.length; i++) {
                productsText += `<div class="product-card">
                        <h3>${data[i].title}</h3>
                        <img src="${data[i].thumbnail}" alt='product-image' height='200'>
                        <p>${data[i].description}</p>
                        <a href="/view?id=${data[i].id}" target="_blank">More</a>
                    </div>`;
            }
            text = text.replace("$PRODUCTS$", productsText);
            res.end(text);
            break;
        }
        case "/view": {
            const product = data.find((ele)=>{
                if(ele.id==query.id) return true;
                else return false;
            })
            const bf = await fsPromise.readFile(`${__dirname}/view.html`);
            let text = bf.toString();
            text = text.replace(
                "$Views$",
                `<div>
                <h2>${product.title}</h2>
                <img src='${product.thumbnail}' height='300'>
                <h4>${product.price}</h4>
                <p>${product.description}</p>
                </div>`

            )
            res.end(text);
            break;
        }
        default: {
            res.end("<h2>Oops! Page not found...</h2>");
        }
    }
    
    
});

app.listen(1400,()=>{
    console.log("-------------Server Started-----------")
}); 