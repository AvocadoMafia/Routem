import { userStore } from "@/lib/client/stores/userStore";
import { useRouter } from "next/navigation";
import Footer from "@/app/_components/layout/templates/footer";
import { motion } from "framer-motion";

export default function AboutForeground() {
    const user = userStore(store => store.user);
    const isLoggedIn = user && user.id !== '';
    const router = useRouter();

    return (
        <div className={'absolute w-full h-fit z-[10]'}>
            <section className={'w-full h-screen flex justify-center py-4'}>
                <div className={'flex flex-col items-center'}>
                    <h1 className={'md:text-[5vw] text-2xl font-syne font-extrabold text-foreground-0'}>Plan Together,</h1>
                    <h1 className={'md:text-[5vw] text-2xl font-syne font-extrabold text-accent-0'}>Travel Smarter.</h1>
                </div>
            </section>
            <section className={'w-full h-fit p-12 bg-background-0/75 backdrop-blur-sm flex justify-center'}>
                <div className={'w-full max-w-[1000px] flex flex-col gap-12 border-t-1 border-foreground-1/60 py-6'}>
                    <p className={'h-fit text-2xl text-foreground-1'}>"旅行したいけど、計画が面倒" ー この声に答えたい。</p>
                    <div className={'w-full h-fit flex gap-12'}>
                        <ul className={'w-fit h-fit'}>
                            <li className={'px-3 py-6 border-t-1 border-foreground-0/30 flex gap-6 items-center'}>
                                <span className={'text-4xl font-syne font-extrabold text-foreground-1'}>2言語</span>
                                <span className={'text-lg text-foreground-1/60'}>日本語＆英語</span>
                            </li>
                            <li className={'px-3 py-6 border-t-1 border-foreground-0/30 flex gap-6 items-center'}>
                                <span className={'text-4xl font-syne font-extrabold text-foreground-1'}>Web + App</span>
                                <span className={'text-lg text-foreground-1/60'}>Platforms</span>
                            </li>
                            <li className={'px-3 py-6 border-t-1 border-foreground-0/30 flex gap-6 items-center'}>
                                <span className={'text-4xl font-syne font-extrabold text-foreground-1'}>Map x SNS</span>
                                <span className={'text-lg text-foreground-1/60'}>投稿でつながる</span>
                            </li>
                        </ul>
                        <div className={'flex-1 h-fit flex flex-col gap-3'}>
                            <span className={'text-foreground-1/60 text-sm italic'}>About Routem</span>
                            <p className={'text-foreground-1'}>旅行好きな人たちはSNSやブログに素晴らしいルートを日々投稿しています。しかしそれらはバラバラに散らばっていて、そのまま旅行計画として使えない。Routemはその溝を埋めます。</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className={'w-full h-fit p-12 bg-background-0 flex justify-center'}>
                <div className={'w-full max-w-[1000px] flex flex-col gap-12'}>
                    <h2 className={'px-3 py-2 border-l-4 border-accent-0 text-4xl font-bold text-foreground-0'}>楽しいはずの旅行が、計画段階で億劫になる。</h2>
                    <div className={'w-full h-fit grid grid-cols-2 gap-12'}>
                        <p className={'text-foreground-1'}>旅行の計画には多くの手間がかかります。行き先を調べ、スポットを選び、移動手段を確認し、順番を考え、時間を見積もる。楽しいはずの旅行が、計画段階で億劫になってしまう人は少なくありません。</p>
                        <p className={'text-foreground-1'}>一方で、旅行が好きな人たちはSNSやブログに素晴らしいルートを日々投稿しています。しかし、それらの情報はバラバラに散らばっていて、そのまま「自分の旅行計画」として使うことができません。</p>
                    </div>
                    <div className={'w-full h-fit grid grid-cols-2 gap-12 border-t-1 border-foreground-0/30'}>
                        <div className={'p-3 flex flex-col gap-3'}>
                            <span className={'text-sm text-foreground-1/60'}>Editor's note</span>
                            <div className={'bg-foreground-1/15 w-full h-fit p-6 rounded-xl flex flex-col gap-3'}>
                                <span className={'font-syne text-4xl font-extrabold text-foreground-1/30'}>72%</span>
                                <p className={'text-foreground-1/60 text-sm'}>旅行計画に「面倒さ」を感じたことがある旅行者の割合（当社調べ）。計画ハードルの高さが出発の機会を奪っています。</p>
                            </div>
                        </div>
                        <div className={'p-3 flex flex-col gap-3'}>
                            <span className={'text-sm text-foreground-1/60'}>Solution</span>
                            <p className={'text-foreground-0 text-lg font-bold'}>「ゼロから作る」から<br />「選んで使う」へ。</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className={'w-full h-fit flex flex-col'}>
                <div className={'w-full h-fit flex justify-center bg-accent-0 py-12'}>
                    <div className={'w-full max-w-[1000px] h-fit flex gap-12'}>
                        <h2 className={'text-5xl text-white font-bold leading-relaxed'}>旅の「面倒」を<br />「楽しい」に変える。</h2>
                        <div className={'flex-1 border-l-1 border-white/50 p-6'}>
                            <p className={'text-white/75 leading-relaxed'}>Routem bridges the gap between the hassle of planning and the joy of travel. <br/> Borrow someone's rela route and make it your own.</p>
                        </div>
                    </div>
                </div>
                <div className={'w-full h-fit flex justify-center bg-background-0/75 backdrop-blur-sm'}>
                    <ul className={'w-full max-w-[1000px] h-fit space-y-3 py-6'}>
                        <li className={'w-full max-w-[1000px] h-32 flex gap-12 p-6 border-t-1 border-foreground-0/30'}>
                            <p className={'w-32 h-fit text-accent-0 tracking-widest'}>Route Creation</p>
                            <p className={'w-48 h-fit text-2xl text-foreground-0 font-semibold'}>地図上で作る、<br/>地図上で伝える。</p>
                            <p className={'flex-1 h-fit text-foreground-1'}>地図上の施設情報を結んでルートを作成。道のり・移動手段を可視化し、写真や感想を各スポットに添付。投稿者はブログ感覚でルートの詳細説明を書き添えることもできます。</p>
                        </li>
                        <li className={'w-full max-w-[1000px] h-32 flex gap-12 p-6 border-t-1 border-foreground-0/30'}>
                            <p className={'w-32 h-fit text-accent-0 tracking-widest'}>Smart Search</p>
                            <p className={'w-48 h-fit text-2xl text-foreground-0 font-semibold'}>旅の条件で、<br/>すぐに見つかる。</p>
                            <p className={'flex-1 h-fit text-foreground-1'}>一般的な文字列検索のほかに、目的・時期・場所・期間・予算・シチュエーションで絞り込む独自検索で、頭の中のなんとなくを具体的なプランへとすぐに昇華できます。</p>
                        </li>
                        <li className={'w-full max-w-[1000px] h-32 flex gap-12 p-6 border-t-1 border-foreground-0/30'}>
                            <p className={'w-32 h-fit text-accent-0 tracking-widest'}>Copy ＆ Edit</p>
                            <p className={'w-48 h-fit text-2xl text-foreground-0 font-semibold'}>アレンジして、<br/>また誰かに渡す。</p>
                            <p className={'flex-1 h-fit text-foreground-1'}>他のユーザーのルートをワンタップでコピーし、自分のプランとして活用。そのまま使っても、スポットを入れ替えてアレンジしても、編集後に再共有してもOK。</p>
                        </li>
                        <li className={'w-full max-w-[1000px] h-32 flex gap-12 p-6 border-t-1 border-foreground-0/30'}>
                            <p className={'w-32 h-fit text-accent-0 tracking-widest'}>Community</p>
                            <p className={'w-48 h-fit text-2xl text-foreground-0 font-semibold'}>旅行好きが、<br/>つながる場所。</p>
                            <p className={'flex-1 h-fit text-foreground-1'}>ルートへのコメント・いいね機能で他の旅行者と交流。気に入った投稿者をフォローして新しいルートをチェック。観光協会・DMOのモデルコースも地図上のインタラクティブなルートとして掲載可能。</p>
                        </li>
                    </ul>
                </div>
            </section>
            <section className={'w-full h-fit p-12 bg-foreground-1/15 backdrop-blur-sm flex justify-center'}>
                <div className={'w-full max-w-[1000px] h-fit flex flex-col gap-6'}>
                    <h2 className={'text-5xl text-foreground-0 text-center font-bold leading-relaxed border-y border-foreground-0/30 w-full py-3'}>4ステップで、旅に出られる。</h2>
                    <div className={'w-full h-fit grid grid-cols-4'}>
                        <div className={'w-full flex flex-col gap-3 p-6 border-r border-foreground-0/30'}>
                            <p className={'text-accent-0'}>Step 01</p>
                            <p className={'text-foreground-0 text-xl font-semibold'}>ルートを<br/>検索する</p>
                            <p className={'text-foreground-1 text-md'}>「京都 1泊2日 女子旅」等、行き先や条件で検索。地図上に候補ルートが並ぶ。</p>
                        </div>
                        <div className={'w-full flex flex-col gap-3 p-6 border-r border-foreground-0/30'}>
                            <p className={'text-accent-0'}>Step 02</p>
                            <p className={'text-foreground-0 text-xl font-semibold'}>地図で<br/>確認する</p>
                            <p className={'text-foreground-1 text-md'}>ルートを地図上で確認。移動手段・所要時間・写真・感想をチェックして比較。</p>
                        </div>
                        <div className={'w-full flex flex-col gap-3 p-6 border-r border-foreground-0/30'}>
                            <p className={'text-accent-0'}>Step 03</p>
                            <p className={'text-foreground-0 text-xl font-semibold'}>コピーして<br/>アレンジする</p>
                            <p className={'text-foreground-1 text-md'}>ワンタップでルートをコピー。自分好みにスポットを入れ替えてプランを完成。</p>
                        </div>
                        <div className={'w-full flex flex-col gap-3 p-6'}>
                            <p className={'text-accent-0'}>Step 04</p>
                            <p className={'text-foreground-0 text-xl font-semibold'}>完成したプランで<br/>旅に出る</p>
                            <p className={'text-foreground-1 text-md'}>あとは出発するだけ。旅を楽しんだ後は自分のルートを投稿して次の旅人へ。</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className={'w-full h-fit p-12 bg-background-0/75 backdrop-blur-sm flex justify-center'}>
                <div className={'w-full max-w-[1000px] h-fit grid grid-cols-2 rounded-lg border-1 border-foreground-0/30 overflow-hidden'}>
                    <div className={'w-full h-[400px] p-6 bg-foreground-0/15 flex flex-col justify-between gap-3'}>
                        <p className={'w-fit h-fit text-foreground-0/30'}>Reader A</p>
                        <div className={'w-full h-fit flex flex-col gap-3'}>
                            <h2 className={'text-foreground-0/30 text-6xl font-syne font-extrabold'}>20S</h2>
                            <p className={'text-foreground-0 text-2xl font-syne font-semibold'}>旅行好きだけど<br/>計画が面倒な<br/>20～30代</p>
                            <p className={'text-foreground-1 text-sm'}>SNSで見つけた旅先に「とりあえず行きたい」けど、ルート作りに時間をかけたくない。他の人のルートをコピーしてすぐ出発できる手軽さが刺さります。</p>
                        </div>
                        <p className={'w-full h-fit border-t border-foreground-0/30 text-foreground-0 py-3 italic'}>"10分で京都の週末プランが完成した。"</p>
                    </div>
                    <div className={'w-full h-[400px] p-6 flex flex-col justify-between gap-3'}>
                        <p className={'w-fit h-fit text-foreground-0/30'}>Reader B</p>
                        <div className={'w-full h-fit flex flex-col gap-3'}>
                            <h2 className={'text-foreground-0/30 text-6xl font-syne font-extrabold'}>IN</h2>
                            <p className={'text-foreground-0 text-2xl font-syne font-semibold'}>日本旅行を<br/>計画している<br/>インバウンド旅行者</p>
                            <p className={'text-foreground-1 text-sm'}>多言語対応（記事のデフォルトでの翻訳は今後実装予定）。地元の人や先輩旅行者が実際に歩いたルートを地図で確認しながら、ガイドブックにない「リアルな旅」を体験できます。</p>
                        </div>
                        <p className={'w-full h-fit border-t border-foreground-0/30 text-foreground-0 py-3 italic'}>"Found a local's secret route in Kyoto."</p>
                    </div>
                </div>
            </section>
            <section className={'w-full h-fit flex flex-col'}>
                <div className={'w-full theme-reversed bg-background-0 flex justify-center'}>
                    <div className={'w-full max-w-[1000px] py-16 grid grid-cols-3'}>
                        <div className={'w-full h-fit flex flex-col gap-3 border-r border-foreground-0/30 p-3'}>
                            <h2 className={'text-3xl font-syne font-extrabold text-foreground-0'}>2026.04</h2>
                            <p className={'text-foreground-1'}>Launch Date</p>
                        </div>
                        <div className={'w-full h-fit flex flex-col gap-3 border-r border-foreground-0/30 p-3'}>
                            <h2 className={'text-3xl font-syne font-extrabold text-foreground-0'}>Web+App</h2>
                            <p className={'text-foreground-1'}>Launch Date</p>
                        </div>
                        <div className={'w-full h-fit flex flex-col gap-3 border-foreground-0/30 p-3'}>
                            <h2 className={'text-3xl font-syne font-extrabold text-foreground-0'}>4</h2>
                            <p className={'text-foreground-1'}>Languages</p>
                        </div>
                    </div>
                </div>
                <div className={'w-full bg-background-0 flex justify-center'}>
                    <div className={'w-full max-w-[1000px] py-16 flex flex-col items-center gap-6'}>
                        <p className={'text-foreground-1 text-sm'}>― End matter・Routem ―</p>
                        <h2 className={'text-6xl font-syne font-extrabold text-foreground-0 pl-6'}>今すぐはじめる。</h2>
                        <div className={'w-20 h-1 bg-accent-0 rounded-full'} />
                        <p className={'text-foreground-1 italic'}>Plan Together, Travel Smarter.</p>
                        <div className={'flex gap-4 mt-6'}>
                            {isLoggedIn ? (
                                <>
                                    <motion.button
                                        onClick={() => router.push('/articles/new')}
                                        className={'bg-accent-0 text-white py-3 px-8 rounded-lg font-bold hover:opacity-90 transition-opacity cursor-pointer'}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        ルートを作成
                                    </motion.button>
                                    <motion.button
                                        onClick={() => router.push('/explore')}
                                        className={'bg-background-1 text-foreground-0 py-3 px-8 border border-grass rounded-lg font-bold hover:bg-grass transition-colors cursor-pointer'}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        ルートを探す
                                    </motion.button>
                                </>
                            ) : (
                                <>
                                    <motion.button
                                        onClick={() => router.push('/login')}
                                        className={'bg-accent-0 text-white py-3 px-8 rounded-lg font-bold hover:opacity-90 transition-opacity cursor-pointer'}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        ログイン
                                    </motion.button>
                                    <motion.button
                                        onClick={() => router.push('/explore')}
                                        className={'bg-background-1 text-foreground-0 py-3 px-8 border border-grass rounded-lg font-bold hover:bg-grass transition-colors cursor-pointer'}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        ルートを探す
                                    </motion.button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    )
}
