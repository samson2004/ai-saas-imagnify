

import { captureOrder} from '@/lib/actions/transaction.actions'
import { getTransaction } from '@/lib/actions/transaction.actions';
import { auth } from "@clerk/nextjs/server";
import { getUserById, updateCredits, updateUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
const Confirmationcheckingpage = async() => {


    const { userId } = auth();
    const user = await getUserById(userId);

    
    const gettransactiondata=await getTransaction(user._id);
    console.log(gettransactiondata);
    const paypaltransactiondata=await captureOrder(gettransactiondata.paypalId,gettransactiondata.paypalaccesstoken);
    console.log(paypaltransactiondata);
    if(paypaltransactiondata.status=='COMPLETED'){
            updateCredits(gettransactiondata.buyer,gettransactiondata.credits);
            updateUser(userId,{planId:gettransactiondata.plan})
            redirect('/profile');
    }
  return (
    <div className='text-black flex flex-center'>Checking Transaction. Once validated u will be redirected!</div>
  )
}

export default Confirmationcheckingpage