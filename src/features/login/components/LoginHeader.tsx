import beasyboxLogo from '../../../assets/logo-bbox.svg';

export default function LoginHeader() {
  return (
    <header className="px-s w-full">
      <img alt="Logo da BeasyBox" className="h-5" src={beasyboxLogo} />
      <h2 className="my-xl text-subtitle-m font-mb h-6.5">Vamos começar?</h2>
    </header>
  );
}
