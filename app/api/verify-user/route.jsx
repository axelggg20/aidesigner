import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req){
    const {user}=await req.json();

    try{
        if (!user?.email) {
            return NextResponse.json({error: "Invalid user data"}, {status: 400});
        }

        // Check if user already exists
        const userInfo = await prisma.user.findUnique({
            where: { email: user.email }
        });
        
        console.log("User", userInfo);
    
        // If user doesn't exist, create new user (for OAuth users)
        if(!userInfo) {
            const SaveResult = await prisma.user.create({
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    credits: 3
                }
            });

            return NextResponse.json({'result': SaveResult})
        }
        
        return NextResponse.json({'result': userInfo})
    }
    catch(e){
        console.error("Verify user error:", e);
        return NextResponse.json({error: e.message}, {status: 500})
    }
}
