import { motion } from "framer-motion";
import SignupTypography from "./signupTypography";

export default function SignupBackground() {
  return (
    <div className={'absolute inset-0 w-full h-full overflow-hidden'}>
      <motion.img
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className={'w-full h-full object-cover'}
        src={'/mockImages/town.jpg'}
        alt="signup background"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute inset-0 bg-black/20"
      /> {/* Overlay for better text readability */}
      <SignupTypography />
    </div>
  );
}
