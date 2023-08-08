const express = require("express")
const pup = require("puppeteer")
const cors = require("cors")
const fs = require('fs')

const url = "https://multicanais.fans/aovivohd/assistir-esportes-online/"

const Screping = async () => {
    const brawser = await pup.launch({
        //ignoreDefaultArgs: ['--disable-extensions'],
        //args: ['--no-sandbox', '--disable-setuid-sandbox']
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    const page = await brawser.newPage()

    await page.goto(url, {timeout: 0})
   
    const links = await page.$$eval('.entry-title > a', el => el.map(link => link.href))
    const imgs = await page.$$eval('.entry-image > a > img', imgs => imgs.map(img => img.getAttribute('src')));
    const title = await page.$$eval(".entry-title", (elements) => { return elements.map((el) => el.textContent.trim())})      

    const data = {
        title: title, 
        link: links, 
        img: imgs
    }

    const res = JSON.stringify(data)

    fs.writeFile("./data.json", `${res}`, function(err){
        //Caro ocorra algum erro
    if(err){
            return console.log('erro')
        }
    //Caso não tenha erro, retornaremos a mensagem de sucesso
        console.log('Arquivo Criado');
    });   

    console.log("Gerado")

    await brawser.close()
}


const port = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    fs.readFile('./data.json', 'utf-8', (err, data) => {
        try {
            const valor = JSON.parse(data)
            res.json(valor)
        } catch (error) {
            res.send(error)
        }
    })
})

app.get("/api", (req, res) => {
    Screping()
    
    fs.readFile('./data.json', 'utf-8', (err, data) => {
        try {
            const valor = JSON.parse(data)
            res.json(valor)
        } catch (error) {
            res.send(error)
        }
    })
   
})

app.listen(port, () => {
    console.log("Server: http://localhost:" + port)
})
