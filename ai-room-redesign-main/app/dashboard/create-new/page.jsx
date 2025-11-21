"use client"
import React, { useContext, useState } from 'react'
import ImageSelection from './_components/ImageSelection'
import RoomType from './_components/RoomType'
import DesignType from './_components/DesignType'
import AdditionalReq from './_components/AdditionalReq'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import CustomLoading from './_components/CustomLoading'
import AiOutputDialog from '../_components/AiOutputDialog'
import { UserDetailContext } from '@/app/_context/UserDetailContext'

function CreateNew() {

  const { data: session } = useSession();
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiOutputImage, setAiOutputImage] = useState()
  const [openOutputDialog, setOpenOutputDialog] = useState(false);
  const [orgImage, setOrgImage] = useState();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  
  const onHandleInputChange = (value, fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }))

    console.log(formData);
  }

  const GenerateAiImage = async () => {
    setLoading(true);
    const rawImageUrl = await SaveRawImageToFirebase();
    const result = await axios.post('/api/redesign-room', {
      imageUrl: rawImageUrl,
      roomType: formData?.roomType,
      designType: formData?.designType,
      additionalReq: formData?.additionalReq,
      userId: session?.user?.id
    });
    console.log(result.data);
    setAiOutputImage(result.data.result);// Output Image Url
    await updateUserCredits();

    setOpenOutputDialog(true);
   
    setLoading(false);

  }

  const SaveRawImageToFirebase = async () => {
    // Save Raw File Image to R2 via API
    const fileName = Date.now() + "_raw.png";
    
    // Convert image to base64
    const reader = new FileReader();
    const base64Image = await new Promise((resolve) => {
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(formData.image);
    });

    // Upload to R2 via API
    const uploadResponse = await axios.post('/api/upload-image', {
      image: base64Image,
      fileName: fileName
    });

    const downloadUrl = uploadResponse.data.url;
    console.log(downloadUrl);
    setOrgImage(downloadUrl);
    return downloadUrl;
  }

  /**
   * Update the user credits
   * @returns 
   */
  const updateUserCredits = async () => {
    const response = await fetch('/api/deduct-credit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: session?.user?.id })
    });

    const data = await response.json();

    if (data.success) {
        setUserDetail(prev => ({
          ...prev,
          credits: userDetail?.credits - 1
        }))
        return data.user.id
    }
  }

  return (
    <div>
        <h2 className='font-bold text-4xl text-primary text-center'>Experience the Magic of AI Remodeling</h2>
        <p className='text-center text-gray-500'>Transform any room with a click. Select a space, choose a style, and watch as AI instantly reimagines your environment.</p>

        <div className='grid grid-cols-1 md:grid-cols-2 
         mt-10 gap-10'>
          {/* Image Selection  */}
          <ImageSelection selectedImage={(value)=>onHandleInputChange(value,'image')}/>
          {/* Form Input Section  */}
          <div>
            {/* Room type  */}
            <RoomType selectedRoomType={(value)=>onHandleInputChange(value,'roomType')}/>
            {/* Design Type  */}
            <DesignType selectedDesignType={(value)=>onHandleInputChange(value,'designType')}/>
            {/* Additonal Requirement TextArea (Optional) */}
            <AdditionalReq additionalRequirementInput={(value)=>onHandleInputChange(value,'additionalReq')}/>
            {/* Button To Generate Image  */}
            <Button className="w-full mt-5" onClick={GenerateAiImage}>Generate</Button>
            <p className='text-sm text-gray-400 mb-52'>NOTE: 1 Credit will use to redesign your room</p>
          </div>
        </div>
        <CustomLoading loading={loading} />
        <AiOutputDialog aiImage={aiOutputImage} orgImage={orgImage}
        closeDialog={()=>setOpenOutputDialog(false)}
        openDialog={openOutputDialog}
        />
    </div>
  )
}

export default CreateNew
