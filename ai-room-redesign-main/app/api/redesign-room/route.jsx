import { prisma } from "@/lib/prisma";
import { r2Client, R2_BUCKET_NAME } from "@/config/r2Config";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";
import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.NEXT_PUBLICK_REPLICATE_API_TOKEN
});

export async function POST(req) {
    const { imageUrl, roomType, designType, additionalReq, userId } = await req.json();

    // Convert Image to AI Image 

    try {
        const input = {
            image: imageUrl,
            prompt: 'A ' + roomType + ' with a ' + designType + " style interior " + additionalReq
        };
        
        const output = await replicate.run("adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38", { input });    
        // Convert Output Url to Buffer
        const imageBuffer = await ConvertImageToBuffer(output);
        // Save to Cloudflare R2
        const fileName = `room-redesign/${Date.now()}.png`;
        
        await r2Client.send(new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: fileName,
            Body: imageBuffer,
            ContentType: 'image/png',
        }));
        
        // Construct the public URL for R2
        const downloadUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;
        console.log(downloadUrl);
        // Save All to Database

        const dbResult = await prisma.aiGeneratedImage.create({
            data: {
                roomType: roomType,
                designType: designType,
                orgImage: imageUrl,
                aiImage: downloadUrl,
                userId: userId
            }
        });
        console.log(dbResult);
        return NextResponse.json({ 'result': downloadUrl });
        
    } catch (e) {
        return NextResponse.json({ error: e })

    }
}

async function ConvertImageToBuffer(imageUrl){
    const resp = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    return Buffer.from(resp.data);
}
