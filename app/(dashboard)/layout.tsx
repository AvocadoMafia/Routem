//共通の処理が必要な場合はここにかく


export default function DashBoardRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={'w-full h-full'}>
            {children}
        </div>
    );
}
