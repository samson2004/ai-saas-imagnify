

"use client";
import InsufficientCreditsModal from '@/components/shared/InsufficientCreditModal'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {CustomField} from '@/components/shared/customfield'
import MediaUploader from '@/components/shared/MediaUploader'
import TransformedImage from '@/components/shared/TransformedImage';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {Form} from "@/components/ui/form"
import { aspectRatioOptions, creditFee, defaultValues, transformationTypes } from "@/constants"
import { Input } from "../ui/input"
import { useEffect, useState, useTransition } from "react"
import { debounce, deepMergeObjects } from "@/lib/utils"
import { updateCredits } from "@/lib/actions/user.actions"
import { getCldImageUrl } from "next-cloudinary";
import { AddImage, UpdateImage } from "@/lib/actions/image.actions";
import { useRouter } from "next/navigation";





export const formSchema = z.object({
  // username: z.string().min(2).max(50),
  title:z.string(),
  aspectRatio:z.string().optional(),
  color:z.string().optional(),
  prompt:z.string().optional(),
  publicId:z.string()
})



const TranformationForm = ({action,data=null,userId,type,creaditBalance,config=null}) => {
  const tranformationtype=transformationTypes[type];
  const [image,setimage]=useState(data);
  const[newTransformation,setnewTransformation]=useState(null);
  const [IsSubmitting,setIsSubmitting]=useState(false);
  const [IsTransforming,setIsTransforming]=useState(false);
  const [Transformationconfig,setTransformationconfig]=useState(config);

  const [startTransition]=useTransition();
  const router= useRouter();



  const initalvalue=data && action=='Update'?{

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

  async function onSubmit(values) {

    setIsSubmitting(true);
    
    if(data || image){
      const transformationurl=getCldImageUrl({
        width:image?.width,
        height:image?.height,
        src:image?.publicId,
        ...Transformationconfig
      })
      const imageData={
        title:values.title,
        publicId:image?.publicId,
        transformationType:type,
        width:image?.width,
        height:image?.height,
        config:Transformationconfig,
        secureURL:image?.secureUrl,
        transformationURL:transformationurl ,
        aspectRatio:values.aspectRatio,
        prompt:values.prompt,
        color:values.color
  
      }
       
    if(action=='Add'){
      try {
        const newImage=await AddImage({
          image:imageData,
          userId,
          path:'/'

        })
        if(newImage){
          form.reset();
          setimage(data);
          router.push(`/transformation/${newImage._id}`)
        }
      } catch (error) {
        console.log(error)
      }
    }

    if(action=='Update'){
      console.log(data);
      try {
        const updatedImage=await UpdateImage({
          image:{
            ...imageData,
            _id:data._id
          },
          userId,
          path:`/transformation/${data._id}`

        })
        if(updatedImage){
          router.push(`/transformation/${updatedImage._id}`)
        }
      } catch (error) {
        console.log(error)
      }
    }
   
    }
    setIsSubmitting(false); 
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
      await updateCredits(userId,creditFee)
    })
  }

  
  useEffect(()=>{
    if(image && (type=='restore' || type =="removeBackground")){
      setnewTransformation(tranformationtype.config);
    }
  },[image,tranformationtype.config,type])
  
  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {creaditBalance  < Math.abs(creditFee) && (<InsufficientCreditsModal/>)}
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
          value={field.value}
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

    <div className="media-uploader-field  md:grid-cols-2">
      <CustomField  
      control={form.control}
      name='publicId'
      className="flex size-full flex-col"
      render={({field})=>(
        <MediaUploader
        onValueChange={field.onChange}
        setImage={setimage}
        publicId={field.value}
        image={image}
        type={type} 
        />
      )}
      />

      <TransformedImage
      image={image}
      type={type}
      title={form.getValues().title}
      IsTransforming={IsTransforming}
      setIsTransforming={setIsTransforming}
      transformationConfig={Transformationconfig}

      
      />
    </div>

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