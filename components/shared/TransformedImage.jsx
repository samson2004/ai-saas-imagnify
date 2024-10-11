/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from 'react'
import Image from 'next/image';
import { CldImage } from 'next-cloudinary';
const TransformedImage = (
    {
        image,
        type,
        title,
        IsTransforming,
        setIsTransforming,
        Transformationconfig,
        hasDownload=false
    }
) => {
    const downloadHandler=()=>{};
  return (
    <div className='flex flex-col gap-4'>
        <div className='flex-between'>
            <h3 className='h3-bold text-dark-600'>
                Transformed
            </h3>
            {hasDownload && (
                <button className='download-btn' onClick={downloadHandler}>
                    <Image 
                    src='/assets/icons/download.svg'
                    alt='download'
                    height={24}
                    width={24}
                    className='pb-[6px]'
                    />
                </button>
            )}
        </div>
        {image?.publicId && Transformationconfig ? 
        (
            <div className='relative'>
                <CldImage 
                            width={getImageSize(type,image,'width')}
                            height={getImageSize(type,image,'height')}
                            src={image?.publicId}
                            sizes={"(max-width:767px) 100vw , 50vw"}
                            placeholder={dataUrl}
                            className="transformed-image "
                            onLoad={()=>{
                                setIsTransforming && setIsTransforming(false);
                            }}
                            onError={()=>{
                                describe(()=>{
                                    setIsTransforming && setIsTransforming(false);
                                },8000)
                            }}
                            {...Transformationconfig}
                            />
                            {IsTransforming && (
                                <div className='transforming-loader'>
                                    <Image 
                                    src='/assets/icons/spinner.svg'
                                    height={50}
                                    width={50}
                                    alt='spinner'
                                    />
                                </div>
                            )}
            </div>
        ):(
                <div className='transformed-placeholder'>
                    TransformedImage

                </div>
            )
        }
    </div>
  )
}

export default TransformedImage