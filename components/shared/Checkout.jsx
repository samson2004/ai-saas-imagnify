
import {getaccesstoken} from '@/lib/actions/transaction.actions'
import { CheckoutCredits } from "@/lib/actions/transaction.actions";
import { Button } from "../ui/button";
import { redirect } from 'next/navigation';
const Checkout = async({plan,amount,credits,buyerId}) => { 


    const onCheckout = async()=>{
        'use server'
    const token=await getaccesstoken('post');
    const transaction={
            plan,
            amount,
            credits,
            buyerId
        }
    const url=await CheckoutCredits(transaction,token.data.access_token); 
    
    if(url) redirect(url);     
     
   
    }
    return (
        <form action={onCheckout} >
            <section>
                <Button
                    type="submit"
                    role="link"
                    className="w-full rounded-full bg-purple-gradient bg-cover"
                >
                    Buy Credit
                </Button>
            </section>
        </form>
    )
}

export default Checkout



