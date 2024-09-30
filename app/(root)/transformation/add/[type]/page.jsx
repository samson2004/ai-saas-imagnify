import React from 'react'
import Header from '@/components/shared/Header';
import { transformationTypes } from '@/constants';
import TranformationForm from '@/components/shared/tranformationForm';


const AddTransformationpage = ({params}) => {

  const trans=transformationTypes[params.type]
  return (
    <>
    <Header  title={trans.title} subtitle={trans.subTitle}/>
    <TranformationForm />
    </>
  )
}

export default AddTransformationpage;