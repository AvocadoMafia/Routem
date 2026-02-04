//ページコンポーネントの命名規則について、基本的にreactが定義する規則に加えて、その名前はルートの名前+Pageとする。今はexampleルートなのでExamplePage

import {getPrisma} from "@/lib/config/server";

export default async function ExamplePage() {

    //サーバーコンポーネントの例であり、prismaを通じてpostgresにアクセスしている。
    const users = await getPrisma().user.findMany();

    return (
        <div className={'w-full h-full'}>
            <ul>
                {users.map((user: { name: string }, index: number) => (
                    <li key={index} className={'text-foreground-0'}>{user.name}</li>
                ))}
            </ul>
        </div>
    )
}
