import { motion } from "framer-motion";
import SignupTypography from "./signupTypography";

export default function SignupBackground() {
  return (
    <div className={'fixed inset-0 w-screen h-screen overflow-hidden'}>
      <motion.img
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className={'w-full h-full object-cover'}
        src={'\n' +
            'https://objectstorage.ap-tokyo-1.oraclecloud.com/n/nrsgvi73cynt/b/routem-image-bucket/o/signup-bg.webp'}
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
