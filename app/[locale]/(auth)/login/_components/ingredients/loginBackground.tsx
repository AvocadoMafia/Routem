import LoginTypography from "./loginTypography";

export default function LoginBackground() {
  return (
    <div className={'absolute inset-0 w-full h-full'}>
      <img className={'w-full h-full object-cover'} src={'/mockImages/mountain.jpg'} alt="login background" />
      <div className="absolute inset-0 bg-black/20" /> {/* Overlay for better text readability */}
      <LoginTypography />
    </div>
  );
}
