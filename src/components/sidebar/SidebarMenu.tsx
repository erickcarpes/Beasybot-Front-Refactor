import { FilePlus2Icon, Search, Video } from 'lucide-react';

import arrowLogo from '../../assets/arrow-logo.svg';
import SidebarMenuItem from './SidebarMenuItem';

/**
 * Menu principal da sidebar com os itens de navegação
 */
export default function SidebarMenu() {
  return (
    <nav className="flex flex-col gap-1 px-2">
      <SidebarMenuItem iconSrc={arrowLogo} label="Nova conversa" to="/app/home" />
      <SidebarMenuItem icon={Search} label="Procurar conversas" to="/app/search" />
      <SidebarMenuItem icon={FilePlus2Icon} label="Meus documentos" to="/app/knowledge" />
      <SidebarMenuItem icon={Video} label="Minhas reuniões" to="/app/meeting" />
    </nav>
  );
}
