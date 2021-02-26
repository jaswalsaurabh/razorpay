import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';


function loadScript(src){
  return new Promise((resolve)=>{

    const script = document.createElement('script')
    script.src = src;
    
    script.onload = ()=>{
      resolve(true)
    }
    script.onerror=()=>{
      resolve(false)
    }
    document.body.appendChild(script)
  })
}

// if we are in development 
const _DEV_ = document.domain === 'localhost';


function App() {

  const [name, setName] = useState('Anku')

  async function displayRazorpay(){

    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

    if(!res){
      alert('RazorPay SDK is failed to load.  ')
    }

    const data = await fetch('http://localhost:4000/razorpay',{method: 'POST'}).then((t)=> t.json())
    
    console.log(data)

    // rzp_test_V67MSLYTYBsY3n

    const options = {
			key: _DEV_ ? 'rzp_test_V67MSLYTYBsY3n' : 'PRODUCTION_KEY',
			currency: data.currency,
			amount: data.amount.toString(),
			order_id: data.id,
			name: 'Donation',
			description: 'Thank you for nothing. Please give us some money',
			image: 'http://localhost:4000/logo',
			handler: function (response) {
				alert(response.razorpay_payment_id)
				alert(response.razorpay_order_id)
				alert(response.razorpay_signature)
			},
			prefill: {
				name,
				email: 'sdfdsjfh2@ndsfdf.com',
				phone_number: '9899999999'
			}
  };
  const paymentObject = new window.Razorpay(options);
  paymentObject.on('payment.failed', function (response){
          alert(response.error.code);
          alert(response.error.description);
          alert(response.error.source);
          alert(response.error.step);
          alert(response.error.reason);
          alert(response.error.metadata.order_id);
          alert(response.error.metadata.payment_id);
  });

  paymentObject.open();
  
}
  


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          onClick={displayRazorpay}
          target="_blank"
          rel="noopener noreferrer"
        >
          Donate 5$
        </a>
      </header>
    </div>
  );
}

export default App;
