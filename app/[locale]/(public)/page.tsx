import ContentsSelector from "@/app/[locale]/(public)/_components/templates/contentsSelector";
import RootClient from "@/app/[locale]/(public)/rootClient";

export default function Page() {
  return (
      <div className={'w-full h-full flex justify-center'}>
          <RootClient/>
      </div>
  )
}
