const app = require('express')()
// const path =require('path')
const Razorpay = require('razorpay')
const shortid = require('shortid')
const cors = require('cors')
const bodyParser = require('body-parser')
const port = process.env.port || 4000;


app.use(cors())
app.use(bodyParser.json())

const razorpay = new Razorpay({
    key_id: 'rzp_test_V67MSLYTYBsY3n',
    key_secret: 'czqzn7qowsi3LY8ul0Tixy4H',
  });

app.get('/logo',(req,res)=>{
    res.sendFile(__dirname+'/logo.svg')
})

app.post('/verification',(req,res)=>{
    const secret = '123456789';
    console.log(req.body)
    
    const crypto = require('crypto')
    const shasum = crypto.createHmac('sha256',secret)
    shasum.update(JSON.stringify(req.body))
    const digest = shasum.digest('hex')

    console.log(digest, req.headers['x-razorpay-signature'])

    if(digest ===  req.headers['x-razorpay-signature']){
        console.log('request is legit')
        // process the payment
        require('fs').writeFileSync('payment1.json',JSON.stringify(req.body, null , 4))
    }else{
        // else pass it     
    }

    res.json({status:'ok'})
})

app.post('/razorpay',async(req,res)=>{
    const payment_capture = 1;
    const amount = 99;
    const currency = 'INR';
    const options = {
        amount: amount*100,
        currency, 
        receipt: shortid.generate(), 
        payment_capture
    }
    try{

        const response = await razorpay.orders.create(options)
        console.log(response)
        res.json({
            id: response.id,
			currency: response.currency,
			amount: response.amount
		})
    } catch(error){
        console.log(error)
    }
})

app.listen(port,()=>{
    console.log(`app is running at port ${port}`)
})