import SignupTypography from "./signupTypography";

export default function SignupBackground() {
  return (
    <div className={'absolute inset-0 w-full h-full'}>
      <img className={'w-full h-full object-cover'} src={'/mockImages/town.jpg'} alt="signup background" />
      <div className="absolute inset-0 bg-black/20" /> {/* Overlay for better text readability */}
      <SignupTypography />
    </div>
  );
}
