import React from 'react'
import Header from '@/components/shared/Header';
import { transformationTypes } from '@/constants';
import TranformationForm from '@/components/shared/tranformationForm';
import { auth } from '@clerk/nextjs/server';
import { getUserById } from '@/lib/actions/user.actions';
import { redirect } from 'next/dist/server/api-utils';


const AddTransformationpage = async({params}) => {

  const {userId}=auth()

  const user=await getUserById(userId);
  const trans=transformationTypes[params.type]

  if(!userId) redirect('/sign-in');
  return (
    <>
    <Header  title={trans.title} subtitle={trans.subTitle}/>
    <section className='mt-10'>
    <TranformationForm 
    action='Add'
    userId={user._id}
    type={trans.type}
    creaditBalance={user.creaditBalance}
    />
    </section>
    
    </>
  )
}

export default AddTransformationpage;