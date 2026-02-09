import { Link } from '@tanstack/react-router';

export default function SignupFooter() {
  return (
    <footer className="mt-xl px-m flex w-full items-center">
      <span>Já tem uma conta?</span>
      <Link className="text-brand ml-xxs" to="/login">
        Faça login.
      </Link>
    </footer>
  );
}
