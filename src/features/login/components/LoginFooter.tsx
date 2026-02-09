import { Link } from '@tanstack/react-router';

export default function LoginFooter() {
  return (
    <footer className="mt-xl px-m flex w-full items-center">
      <span>Ainda não tem um conta?</span>
      <Link className="text-brand ml-xxs" to="/signup">
        Faça a sua aqui.
      </Link>
    </footer>
  );
}
