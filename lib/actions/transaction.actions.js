"use server";

import axios from 'axios'
import { connecttodatabase } from "../database/mongoose";
import Transaction from '../database/models/transcation.model';
import { updateCredits } from './user.actions';

export  async function getaccesstoken(){
    const getBearertoken=await axios({
        url:`${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`,
        method:'post',
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
            return_url: `${process.env.BASE_IMAGIFY_URL}/profile`,
            cancel_url: `${process.env.BASE_IMAGIFY_URL}/credits`,
          },
        },
      });
  
      // console.log(response.data);
      // console.log(transaction, 'access token::', accessnumber);

      const paypalId=response.data.id;
      const url=response.data.links.find(link => link.rel === 'approve').href;
      const data={paypalId:paypalId,...transaction}
      console.log(data,url);
    } catch (error) {
      console.log('Error from CheckoutCredits::', error.response ? error.response.data : error.message);
    }
  }
  

export async function createTransaction(id,transaction) {
    try {
        await connecttodatabase();
        const transact=await Transaction.create({
            paypalId:id,
            ...transaction
        })
        await updateCredits(transact.buyer,transact.credit);

    } catch (error) {
        console.log(error)
    }
}