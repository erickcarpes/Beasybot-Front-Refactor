import Lottie from 'lottie-react';

import animatedLogin from '@/assets/login-animation.json';
import { SignupForm } from '@/features/signup';

export default function SignupPage() {
  return (
    <div className="relative h-screen w-screen overflow-hidden lg:flex">
      <div className="relative z-10 flex h-full w-full items-center justify-center lg:w-1/2 lg:shrink-0">
        <SignupForm />
      </div>
      <Lottie
        animationData={animatedLogin}
        className="absolute inset-0 z-0 h-full w-full object-cover lg:relative lg:h-[120vh] lg:w-1/2 lg:object-contain"
      />
    </div>
  );
}
