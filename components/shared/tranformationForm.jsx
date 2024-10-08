
"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
// import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {CustomField} from '@/components/shared/customfield'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


import {
  Form,
  // FormControl,
  // FormDescription,
  // FormField,
  // FormItem,
  // FormLabel,
  // FormMessage,
} from "@/components/ui/form"
import { aspectRatioOptions, defaultValues, transformationTypes } from "@/constants"
import { Input } from "../ui/input"
import { useState, useTransition } from "react"
import { debounce, deepMergeObjects } from "@/lib/utils"
import { updateCredits } from "@/lib/actions/user.actions"




export const formSchema = z.object({
  // username: z.string().min(2).max(50),
  title:z.string(),
  aspectRatio:z.string().optional(),
  color:z.string().optional(),
  prompt:z.string().optional(),
  publicId:z.string()
})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TranformationForm = ({action,data=null,userId,type,creaditBalance,config=null}) => {
  const tranformationtype=transformationTypes[type];
  const [image,setimage]=useState(data);
  const[newTransformation,setnewTransformation]=useState(null);
  const [IsSubmitting,setIsSubmitting]=useState(false);
  const [IsTransforming,setIsTransforming]=useState(false);
  const [Transformationconfig,setTransformationconfig]=useState(config);

  const [isPending,startTransition]=useTransition();



  const initalvalue=data && action==='Update'?{

    title: data?.title ,
    aspectRatio: data?.aspectRatio,
    color: data?.color,
    prompt:data?.prompt,
    publicId: data?.publicId,
  }:defaultValues;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initalvalue
  })

  function onSubmit(values) {
    console.log(values)
  }
  const onSelectFieldHandler=(value,onChangeField)=>{
    const imagesize=aspectRatioOptions[value];

    setimage((prev)=>({
      ...prev,
      aspectRation:imagesize.aspectRatio,
      width:imagesize.width,  
      height:imagesize.height

    }))

    setnewTransformation(tranformationtype.config);

    return onChangeField(value);
  }

  const onInputChangeHandler=(fieldname,type,onChangeField)=>{
    debounce(()=>{
      setnewTransformation((prev)=>({
        ...prev,
        [type]:{
          ...prev?.[type],
          [fieldname == 'prompt'? 'prompt':'to']:value
        }
      }))
      return onChangeField(value);
    },1000);
  }
// TODO: return to update creadits
  const onTransformHandler=async()=>{
    setIsTransforming(true);
    setTransformationconfig(
      deepMergeObjects(newTransformation,Transformationconfig)
    );
    setnewTransformation(null);

    startTransition(async()=>{
      // await updateCredits(userId,creaditfee)
    })
  }

  
  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
    <CustomField 
    control={form.control}
    name='title'
    formLabel='Image Title'
    className="w-full"
    render={({field})=><Input {...field} 
    className="input-field  md:h-[54px] focus-visible:ring-transparent focus-visible:ring-offset-0  disabled:opacity-100 !important" />}
    />
     {type == 'fill' && (
        <CustomField
        control={form.control}
        name='aspectRatio'
        formLabel='Aspect Ratio'
        className='w-full'
        render={({field})=> (
          <Select
          onValueChange={(value)=>onSelectFieldHandler(value,field.onChange)}
          >
            <SelectTrigger className="select-field disabled:opacity-100 placeholder:text-dark-400/50    md:h-[54px] focus:ring-offset-0 focus-visible:ring-transparent focus:ring-transparent focus-visible:ring-0 focus-visible:outline-none !important">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(aspectRatioOptions).map((key)=>
                <SelectItem  className="select-item hover:bg-purple-400" key={key} value={key}>{aspectRatioOptions[key].label}</SelectItem>)
              }
            </SelectContent>
        </Select>

        )}
        />
    )}

    {(type=='remove'  || type=='recolor') && (
      <div className="prompt-field lg:flex-row lg:gap-10">

        <CustomField
        control={form.control}
        name='prompt'
        formLabel={
          type=='remove'? 'Object to remove ': 'Object to recolor'
        }
        className={`w-full`}
        render={({field})=>(
          <Input
          value={form.value}
          className="input-field"
          onChange={(e)=>onInputChangeHandler('prompt',e.target.value,type,field.onChange)}
          ></Input>
        )}
        /> 
        {type=='recolor' && (
          <CustomField
          control={form.control}
          name='color'
          formLabel='Replacement Color'
          className='w-full'
          render={({field})=>(
            <Input
            value={form.value}
            className="input-field"
            onChange={(e)=>onInputChangeHandler('color',e.target.value,'recolor',field.onChange)}
            ></Input>
          )}
          />
        )}
      </div>
    )}

    <div className="flex flex-col gap-4">
    <Button type="button" className="submit-button md:h-[54px] capitalize" 
      disabled={IsTransforming || newTransformation==null}
      onClick={onTransformHandler}
      >{IsTransforming?'Transforming...':'Apply transformation '}</Button>
    </div>

      <Button type="submit" className="submit-button md:h-[54px] capitalize" 
      disabled={IsSubmitting}>{IsSubmitting?'Submitting':'Save Image'}</Button>
    </form>
  </Form>
  )
}

export default TranformationForm;