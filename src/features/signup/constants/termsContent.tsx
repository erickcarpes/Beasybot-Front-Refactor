import type { ReactNode } from 'react';

interface TermsSection {
  content: ReactNode;
  title: string;
}

export const TERMS_LAST_UPDATED = 'Julho de 2025';

export const TERMS_SECTIONS: TermsSection[] = [
  {
    content: (
      <p>
        Ao utilizar esta plataforma, você concorda integralmente com estes Termos de Uso e com a
        Política de Privacidade aqui descrita. Se não concordar, não utilize nossos serviços.
      </p>
    ),
    title: '1. Aceitação dos Termos',
  },
  {
    content: (
      <p>
        Nossa plataforma integra a API do ChatGPT, ferramentas de gravação e transcrição de reuniões
        e um mecanismo RAG (Retrieval-Augmented Generation), permitindo interações avançadas com IA
        utilizando arquivos e transcrições fornecidos pelo usuário como contexto.
      </p>
    ),
    title: '2. Descrição da Plataforma',
  },
  {
    content: (
      <>
        <p>Coletamos os seguintes dados:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Dados cadastrais (nome, e-mail);</li>
          <li>Arquivos enviados pelo usuário;</li>
          <li>Gravações e transcrições de reuniões;</li>
          <li>Logs e dados de uso da plataforma.</li>
        </ul>
      </>
    ),
    title: '3. Coleta de Dados',
  },
  {
    content: (
      <ul className="mt-2 list-disc space-y-1 pl-5">
        <li>Personalizar respostas com base em contexto;</li>
        <li>Realizar transcrições automáticas;</li>
        <li>Aprimorar a experiência do usuário;</li>
        <li>Prevenir fraudes e garantir segurança;</li>
        <li>Comunicar-se com os usuários.</li>
      </ul>
    ),
    title: '4. Finalidade do Tratamento',
  },
  {
    content: (
      <>
        <p>Os dados não são vendidos. Podem ser compartilhados com:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Serviços essenciais à operação (ex: servidores, APIs);</li>
          <li>Autoridades mediante obrigação legal;</li>
          <li>Terceiros, apenas com consentimento explícito.</li>
        </ul>
      </>
    ),
    title: '5. Compartilhamento de Dados',
  },
  {
    content: (
      <p>
        Utilizamos criptografia e práticas de segurança reconhecidas para proteger seus dados contra
        acessos não autorizados, perdas ou alterações indevidas.
      </p>
    ),
    title: '6. Armazenamento e Segurança',
  },
  {
    content: (
      <>
        <p>
          Utilizamos cookies para melhorar a navegação, personalizar a experiência e coletar dados
          analíticos. Tipos:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            <strong>Essenciais:</strong> necessários para funcionamento básico;
          </li>
          <li>
            <strong>Desempenho:</strong> coletam dados de uso anônimos;
          </li>
          <li>
            <strong>Funcionais:</strong> lembram preferências do usuário;
          </li>
          <li>
            <strong>Analíticos:</strong> usados por ferramentas como Google Analytics.
          </li>
        </ul>
        <p className="mt-2">
          Você pode controlar cookies pelo seu navegador ou painel de consentimento.
        </p>
      </>
    ),
    title: '7. Uso de Cookies e Ferramentas Analíticas',
  },
  {
    content: (
      <>
        <p>De acordo com a Lei nº 13.709/2018, você tem direito a:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Confirmar e acessar seus dados pessoais;</li>
          <li>Corrigir ou atualizar seus dados;</li>
          <li>Solicitar anonimização ou exclusão;</li>
          <li>Solicitar portabilidade dos dados;</li>
          <li>Revogar consentimento a qualquer momento.</li>
        </ul>
      </>
    ),
    title: '8. Direitos do Usuário (LGPD)',
  },
  {
    content: (
      <p>
        O uso da plataforma implica no consentimento para tratamento dos dados conforme descrito
        neste documento. Esse consentimento pode ser revogado mediante solicitação.
      </p>
    ),
    title: '9. Consentimento',
  },
  {
    content: (
      <p>
        Utilizamos APIs de terceiros, como ChatGPT e serviços de gravação, e não nos
        responsabilizamos por falhas ou indisponibilidades causadas por essas integrações externas.
      </p>
    ),
    title: '10. Exclusão de Responsabilidade',
  },
  {
    content: (
      <p>
        Todo o conteúdo e funcionalidades da plataforma são protegidos por direitos autorais e
        propriedade intelectual. A reprodução não autorizada é proibida.
      </p>
    ),
    title: '11. Propriedade Intelectual',
  },
  {
    content: (
      <p>
        Estes termos podem ser atualizados. Notificaremos alterações relevantes e o uso contínuo da
        plataforma significará sua aceitação.
      </p>
    ),
    title: '12. Alterações nos Termos',
  },
  {
    content: (
      <>
        <p>Para dúvidas, solicitações ou reclamações, entre em contato:</p>
        <p className="mt-2">
          <strong>Email:</strong>{' '}
          <a className="text-brand hover:underline" href="mailto:contato@beasybox.com">
            contato@beasybox.com
          </a>
        </p>
        <p className="mt-1">
          <strong>Domínio oficial:</strong>{' '}
          <a
            className="text-brand hover:underline"
            href="https://www.beasybox.com/"
            rel="noopener noreferrer"
            target="_blank"
          >
            https://www.beasybox.com/
          </a>
        </p>
      </>
    ),
    title: '13. Contato',
  },
];

export const TERMS_FOOTER = (
  <p className="mt-6 italic">
    Ao continuar, você declara que leu, compreendeu e concorda com os Termos de Uso e Política de
    Privacidade.
  </p>
);
