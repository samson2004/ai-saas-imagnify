/* eslint-disable @typescript-eslint/no-unused-vars */
'use server';
import axios from 'axios'
import { connecttodatabase } from "../database/mongoose";
import Transaction from '../database/models/transcation.model';
import { updateCredits } from './user.actions';





export async function getaccesstoken(methodtype){

    const getBearertoken=await axios({
        url:`${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`,
        method:methodtype,
        data:"grant_type=client_credentials",
        auth:{
            username:process.env.PAYPAL_CLIENT_ID,
            password:process.env.PAYPAL_CLIENT_SECRET
        }
    });
    return getBearertoken;
}

export async function CheckoutCredits(transaction, accessnumber) {

    try { 
      await connecttodatabase();
  
      const response = await axios({
        url: `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessnumber}`
        },
        data: {
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: transaction.amount,
              },
              items: [
                {
                  name: transaction.plan,
                  quantity: '1',
                  unit_amount: {
                    currency_code: 'USD',
                    value: transaction.amount,
                  },
                },
              ],
              amount:{
                currency_code: 'USD',
                value: transaction.amount,
                breakdown:{
                    item_total:{
                        currency_code: 'USD',
                        value: transaction.amount,
                    }
                }  
              }
            },
          ],
          application_context: {
            return_url: `${process.env.BASE_IMAGIFY_URL}/confirmationpage`,
            cancel_url: `${process.env.BASE_IMAGIFY_URL}/credits`,
          },
        },
      });

      const paypalId=response.data.id;
      const url=response.data.links.find(link => link.rel === 'approve').href;
      const data={
        paypalId:paypalId,
        buyer:transaction.buyerId,
        amount:transaction.amount, 
        credits:transaction.credits,
        plan:transaction.plan,
        paypalaccesstoken:transaction.newtoken
      };
      // console.log(data);
      await createTransaction(data);
      return url;
      
      
    } catch (error) {
      console.log('Error from CheckoutCredits::', error.response ? error.response.data : error.message);
      
    }
    
  }
  

export async function createTransaction(data) {
    try {
        await connecttodatabase();
        // console.log(data)
        await Transaction.create({
            ...data,buyer:data.buyer,paypalaccesstoken:data.paypalaccesstoken
        })

    } catch (error) {
        console.log(error)
    }
    
  }
    


export async function captureOrder(paypalOrderId, accessToken) {
    try {
      const response = await axios({
        url: `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${paypalOrderId}/capture`,
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      });
  
      if (response.data.status !== 'COMPLETED') {
        throw new Error('Transaction not completed');
      }
  
      return response.data; // Contains transaction details if successful
    } catch (error) {
      console.log('Error from captureOrder:', error.response ? error.response.data : error.message);
      throw error; // rethrow for further handling
    }
  }

export async function getTransaction(userid) {
  try{
    await connecttodatabase();
    const trans=await Transaction.findOne({buyer:userid})
    // console.log(trans)
    if(!trans) console.log('transaction not found');
    return trans;
  }
  catch{
    console.log('error in confirmpayment')
  }
  
}