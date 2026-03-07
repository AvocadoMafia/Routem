import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { handleRequest } from "@/lib/server/handleRequest"
import { categoriesService } from "@/features/categories/service";


export async function GET(req:NextRequest){
    return handleRequest(
        async()=>{
            const res = await categoriesService.getCategories();
            return NextResponse.json(res, {status:200});}
    );
}