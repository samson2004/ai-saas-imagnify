
import { getaccesstoken} from '@/lib/actions/transaction.actions'
import { CheckoutCredits } from "@/lib/actions/transaction.actions";
import { Button } from "../ui/button";
import { redirect } from 'next/navigation';
const Checkout = async({plan,amount,credits,buyerId}) => { 
    

    const onCheckout = async()=>{
        'use server'

    let token=await getaccesstoken('post');
    const newtoken=token.data.access_token

    const transaction={
            plan,
            amount,
            credits,
            buyerId,
            newtoken
        }
    // console.log(transaction)
    const url=await CheckoutCredits(transaction,token.data.access_token); 
    
    if(url){
        redirect(url);//paypal site->confirmationpage
    }     
     
   
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



