const axios = require('axios');

// get the access token from paypal online to access to our sandbox account
async function generateAccessToken() {
    const res = await axios({
        url : process.env.PAYPAL_BASE_URL + '/v1/oauth2/token',
        method: 'POST',
        data: 'grant_type=client_credentials',
        auth : {
            username: process.env.PAYPAL_CLIENT_ID,
            password: process.env.PAYPAL_SECRET
        }
    })

    return res.data.access_token
}

exports.createOrder = async() =>{
    const accessToken = await generateAccessToken()

    const res = await axios({ // axios = promise-based  http clients 
        url: process.env.PAYPAL_BASE_URL + '/v2/checkout/orders',
        method: 'POST',
        headers : {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ accessToken,   
        },
        data: JSON.stringify({
            intent: "CAPTURE",
            purchase_units: [
                {
                    items: [
                        {
                            name: 'Node.js Complete Course',
                            description: 'Node.js Complete Course with Express and MongoDB',
                            quantity: 1,
                            unit_amount : {
                                currency_code: 'USD',
                                value: '100.00'
                            }
                        }
                    ],

                    amount :{
                        currency_code: 'USD',
                        value: '100.00',
                        breakdown : {
                            item_total:{
                                currency_code: 'USD',
                                value: '100.00',
                            }
                        }
                    }
                }
            ],

            application_context : {
                return_url: process.env.BASE_URL + '/complete-order',
                cancel_url: process.env.BASE_URL + '/cancel-order',
                shipping_preference: "NO_SHIPPING",   // if don't hae =>. has shipping information
                user_action : 'PAY_NOW', // CONTINUE -> go to the next step of indicate other information
                brand_name: "BLAST.com"
            }
        })
    })

    // console.log(res.data)

    return res.data.links.find(link => link.rel === 'approve').href
}

exports.capturePayment = async (orderId) =>{ // write the payment was successfully and change the balance of account
    const access_token = await generateAccessToken()

    const res = await axios({
        url: process.env.PAYPAL_BASE_URL + `/v2/checkout/orders/${orderId}/capture`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ access_token,
        }
    })

    return res.data
}

