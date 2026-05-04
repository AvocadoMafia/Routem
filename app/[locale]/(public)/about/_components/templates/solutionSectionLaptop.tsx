"use client";

import SolutionCard from "@/app/[locale]/(public)/about/_components/ingredients/solutionCard";

export default function SolutionSectionLaptop() {
    return (
        <section className={'hidden md:flex flex-col w-full min-h-screen bg-background-0 py-24 px-12'}>
            {/* Hero Section */}
            <div className={'w-full max-w-[1400px] mx-auto mb-32'}>
                <div className={'flex flex-col gap-4 mb-16'}>
                    <p className={'text-foreground-1/60 text-lg font-light tracking-wider uppercase'}>
                        旅行の計画ってなんか面倒じゃない？
                    </p>
                    <p className={'text-foreground-1/60 text-lg font-light tracking-wider uppercase'}>
                        とっておきのルート シェアしてみない？
                    </p>
                </div>

                <h1 className={'text-8xl font-black text-foreground-0 leading-[1.05] tracking-tighter mb-12'}>
                    それ全部、<br/>
                    <span className={'text-accent-0'}>Routem</span>で解決。
                </h1>

                <div className={'flex items-end gap-16'}>
                    <div className={'flex-1 max-w-2xl'}>
                        <p className={'text-2xl text-foreground-0/90 font-light leading-relaxed mb-6'}>
                            旅行計画が面倒。<br/>
                            気になるあの子と同じ旅をしたい。<br/>
                            自分のとっておきのルートを共有したい。
                        </p>
                        <p className={'text-3xl text-foreground-0 font-semibold leading-relaxed'}>
                            これ全部、
                            <span className={'font-josefin-sans uppercase mx-3 text-accent-0'}>Routem</span>
                            で解決してみない？
                        </p>
                    </div>

                    <div className={'flex items-end gap-6'}>
                        <div className={'w-64 transform hover:scale-105 transition-transform duration-500'}>
                            <img className={'w-full drop-shadow-2xl'} src={'/lp/pc.png'} alt="PC"/>
                        </div>
                        <div className={'w-20 transform hover:scale-105 transition-transform duration-500'}>
                            <img className={'w-full drop-shadow-2xl'} src={'/lp/phone.png'} alt="Phone"/>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className={'w-full max-w-[1400px] mx-auto'}>
                <div className={'grid grid-cols-2 gap-8 mb-8'}>
                    <SolutionCard
                        imageSrc={'https://objectstorage.ap-tokyo-1.oraclecloud.com/n/nrsgvi73cynt/b/routem-image-bucket/o/initial-thumbnail.webp'}
                        title_line1={'地図上で作る、'}
                        title_line2={'地図上で伝える。'}
                        description={'地図上の施設情報を結んでルートを作成。道のり・移動手段を可視化し、写真や感想を各スポットに添付。投稿者はブログ感覚でルートの詳細説明を書くこともできます。'}
                    />
                    <SolutionCard
                        imageSrc={'https://objectstorage.ap-tokyo-1.oraclecloud.com/n/nrsgvi73cynt/b/routem-image-bucket/o/initial-thumbnail.webp'}
                        title_line1={'旅の条件で、'}
                        title_line2={'すぐに見つかる。'}
                        description={'通常の文字列検索はもちろん、目的、場所、日時、期間、予算等で絞り込む探索機能を用いて、あいまいなアイデアを具体的なプランとして素早く出力できます。'}
                    />
                </div>
                <div className={'grid grid-cols-2 gap-8'}>
                    <SolutionCard
                        imageSrc={'https://objectstorage.ap-tokyo-1.oraclecloud.com/n/nrsgvi73cynt/b/routem-image-bucket/o/initial-thumbnail.webp'}
                        title_line1={'借りて、アレンジして、'}
                        title_line2={'また誰かに貸す。'}
                        description={'他のユーザーのルートをワンタップでコピーし、自分のプランとして活用。そのまま使っても、スポットを入れ替えアレンジしても、編集後に再共有してもOK。'}
                    />
                    <SolutionCard
                        imageSrc={'https://objectstorage.ap-tokyo-1.oraclecloud.com/n/nrsgvi73cynt/b/routem-image-bucket/o/initial-thumbnail.webp'}
                        title_line1={'旅行好きが、'}
                        title_line2={'つながる場所。'}
                        description={'ルートのコメント・いいね機能で他ユーザーと交流。気に入った投稿者をフォローして新しいルートをチェック。モデルコースも地図上のインタラクティブなルートとして掲載可能。'}
                    />
                </div>
            </div>
        </section>
    );
}
