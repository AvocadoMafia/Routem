import {NextRequest} from "next/server";
import {getPrisma} from "@/lib/config/server";
import {PrismaClient} from "@prisma/client";

export async function POST(req: NextRequest) {
    const body = req.json()

}