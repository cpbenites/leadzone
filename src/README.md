# LeadZone

Uma plataforma SaaS moderna para prospección B2B que permite vendedores e empreendedores encontrar, gerenciar e converter clientes em tempo real.

**[Visite o site](https://leadzone.app)** | **[Documentação](#documentação)** | **[Configuração Local](#configuração-local)**

---

## 📋 Visão Geral

LeadZone é uma solução integrada de prospección que combina busca inteligente de leads, CRM visual (estilo Kanban) e ferramentas de contato direto via WhatsApp. Desenvolvido com as melhores práticas de engenharia web, oferece uma experiência responsiva e performática tanto para desktop quanto mobile.

### Principais Funcionalidades

- **🔍 Busca Inteligente de Leads** — Filtra empresas por país, estado, cidade e nicho com integração em tempo real com dados de mapa
- **📊 CRM Visual Kanban** — Organize leads em estágios (Novos, Em Contato, Em Negociação, Cliente Fechado) com drag-and-drop
- **💬 Integração WhatsApp** — Contate prospects diretamente do aplicativo com um clique
- **📱 Multi-idioma** — Suporte completo para Espanhol e Português (Brasil)
- **💳 Sistema de Planos** — Free, Starter, Pro, Pro Max e Enterprise com limites de buscas progressivos
- **📈 Blog com CMS** — Artigos otimizados para SEO gerados via LLM
- **📊 Admin Dashboard** — Gerenciamento de usuários, planos e métricas em tempo real

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** — Interface dinâmica e responsiva
- **Tailwind CSS** — Design system moderno e customizável
- **React Router v6** — Roteamento performático
- **React Query** — Gerenciamento de estado e cache de dados
- **Framer Motion** — Animações fluidas
- **Shadcn/UI** — Componentes acessíveis e reutilizáveis

### Backend & Infraestrutura
- **Deno Deploy** — Runtime de funções serverless
- **Google Places API** — Dados em tempo real de empresas
- **LLM Integration** — Geração de conteúdo e sugestões de nicho
- **Stripe & Hotmart** — Processamento de pagamentos

### Dados & Integrações
- **SQL Database** — Armazenamento de leads e usuários
- **Real-time Subscriptions** — Atualização ao vivo do CRM
- **Firebase Analytics** — Rastreamento de eventos
- **WhatsApp Business API** — Integração de contato direto

---

## 🚀 Recursos Implementados

### 1. Prospección Avançada
- Busca por múltiplos filtros (geolocalização + nicho + reputação)
- Paginação eficiente com "Carregar Mais"
- Exibição de ratings, endereços e dados de contato
- Links diretos para Google Maps e redes sociais

### 2. CRM Kanban
- Drag-and-drop entre estágios de vendas
- Filtros por país e estágio
- Exclusão de leads com confirmação
- Persistência automática de mudanças

### 3. Dashboard Administrativo
- Gestão de usuários e planos
- Rastreamento de consumo de créditos
- Relatórios de busca por usuário
- Atualização de limites de plan

### 4. Sistema de Monetização
- 5 planos com preços progressivos
- Integração com Stripe/Hotmart
- Webhook de confirmação de pagamento
- Reset automático de limites

### 5. Internacionalização (i18n)
- Alternância ES/PT via context provider
- Persistência de preferência em localStorage
- Routing baseado em idioma (`/` para ES, `/br` para PT)
- Traduções centralizadas em arquivos estruturados

### 6. Blog com Geração Automática
- CMS com editor de conteúdo
- Geração via LLM (Claude Sonnet) 
- URLs slug amigáveis para SEO
- Categorização e tags automáticas
- Automação agendada para publicação

---

## 📦 Arquitetura do Projeto

```
src/
├── pages/              # Componentes de página (rotas principais)
│   ├── Landing.jsx     # Landing page bilíngue
│   ├── Dashboard.jsx   # Busca de leads
│   ├── Funil.jsx       # CRM Kanban
│   ├── Configuraciones # Configurações do usuário
│   ├── Blog.jsx        # Listagem de artigos
│   ├── BlogPost.jsx    # Visualização de artigo
│   └── Admin.jsx       # Painel administrativo
├── components/         # Componentes reutilizáveis
│   ├── Layout.jsx      # Sidebar + mobile nav
│   ├── LeadCard.jsx    # Card individual de lead
│   ├── UpgradeModal.jsx # Modal de upgrade de plano
│   ├── NichoSuggester  # Sugestor IA de nichos
│   └── ui/             # Componentes base (botões, inputs, etc)
├── lib/
│   ├── i18n.jsx        # Context de idioma
│   ├── translations.js # Textos ES/PT
│   ├── landing-content # Conteúdo landing bilíngue
│   └── AuthContext     # Autenticação e sessão
├── functions/          # Funções serverless (backend)
│   ├── searchLeads     # Busca via Google Places
│   ├── generateBlogPost # Geração IA de artigos
│   ├── updateUserPlan  # Atualização de plano
│   └── ...outros       # Webhooks, admin, analytics
└── data/               # Dados estáticos (localizações)
```

---

## 🔐 Variáveis de Ambiente

O projeto requer as seguintes chaves de API:

```env
GOOGLE_PLACES_API_KEY=your_google_places_key
FB_PIXEL_ACCESS_TOKEN=your_fb_pixel_token
```

### Obtendo as chaves:

**Google Places API:**
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto
3. Habilite a API: "Places API"
4. Crie uma chave de API no menu "Credenciais"

**Facebook Pixel:**
1. Acesse [Facebook Business Suite](https://business.facebook.com/)
2. Vá em Eventos > Gerenciar Pixel
3. Configure seu Pixel ID e Access Token

---

## 🔧 Configuração Local

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta no provedor de backend (com suporte a funções serverless e banco de dados)

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/leadzone.git
cd leadzone
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite .env e adicione suas chaves de API
```

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

Acesse `http://localhost:5173` no navegador.

### Scripts Disponíveis

```bash
npm run dev        # Inicia servidor de desenvolvimento
npm run build      # Compila para produção
npm run preview    # Prévia da build de produção
npm run lint       # Verifica código com ESLint
```

---

## 📊 Performance & Otimizações

- **Code Splitting**: Componentes pesados (Admin, Blog) carregados sob demanda
- **Lazy Loading**: Imagens otimizadas com `fetchpriority="high"`
- **Debouncing**: Filtros de busca com delay de 300ms
- **React Query**: Cache automático e sincronização de dados
- **Tailwind CSS**: Purga automática de estilos não utilizados
- **Responsive Design**: Mobile-first com breakpoints Tailwind

---

## 🌐 Internacionalização (i18n)

O projeto suporta múltiplos idiomas através de um context provider:

```javascript
import { useLang } from "@/lib/i18n";

export default function Component() {
  const { lang, setLang } = useLang();
  const t = T[lang]; // Acessa traduções
  
  return <h1>{t.dashboard.title}</h1>;
}
```

**Adicionando novo idioma:**
1. Adicione as traduções em `lib/translations.js`
2. Atualize `lib/i18n.jsx` com o novo código de idioma
3. Adicione a rota em `App.jsx` se necessário

---

## 📈 Fluxo de Vendas

```
Landing Page
    ↓
Sign Up / Login
    ↓
Dashboard (Busca de Leads)
    ↓
Funil CRM (Organização)
    ↓
Contato via WhatsApp
    ↓
Upgrade para Plan Pago (conforme necessário)
```

---

## 🧪 Testes & Qualidade

- Componentes isolados e testáveis
- Funções serverless com logging estruturado
- Validação de entrada em formulários
- Tratamento de erros consistente com toast notifications
- Código TypeScript-ready (sem tipos por enquanto)

---

## 🚨 Tratamento de Erros

O projeto implementa tratamento robusto de erros:

- **Erros de Autenticação**: Redirecionamento automático para login
- **Limites de Plano**: Modal de upgrade contextualizado
- **Erros de API**: Toast com mensagem descritiva
- **Falhas de Rede**: Retry automático com exponential backoff
- **Dados Inválidos**: Validação no frontend antes de enviar

---

## 🔄 Automações & Webhooks

### Automações Agendadas
- **Geração de Blog Posts**: Diariamente via LLM (Claude Sonnet)
- **Reset de Limites**: Mensalmente para usuários

### Webhooks
- **Hotmart**: Confirmação de pagamento e ativação de plano
- **Stripe**: Webhook de sucesso de pagamento (extensível)

---

## 🎯 Roadmap Futuro

- [ ] Integração com CRM externo (Pipedrive, Salesforce)
- [ ] Automação de Follow-up via Email
- [ ] Exportar Leads em CSV/XLSX
- [ ] Mobile App nativa (React Native)
- [ ] Dark Mode completo
- [ ] Sistema de Gamificação (badges, streaks)
- [ ] API pública para integrações

---

## 📝 Convenções de Código

### Componentes React
- Componentes funcionais com hooks
- Props bem tipadas (comentários JSDoc)
- Um componente por arquivo
- Estórias de sucesso claras

### Funções Serverless
- Tratamento de erro com try/catch
- Logging estruturado com console
- Validação de autenticação (`base44.auth.me()`)
- Responses HTTP padronizadas

### Estilos
- Tailwind CSS only (sem CSS modules)
- Uso de design tokens em `index.css`
- Classes semânticas para acessibilidade
- Responsividade mobile-first

---

## 🤝 Contribuindo

Antes de abrir um PR:

1. Crie uma branch com nome descritivo (`feature/nova-funcionalidade`)
2. Mantenha a coesão com o código existente
3. Teste as alterações localmente
4. Adicione comentários claros em lógica complexa

---

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma **Issue** no GitHub
- Consulte a [documentação do projeto](#)
- Verifique discussões anteriores

---

## 📄 Licença

Este projeto está sob licença MIT. Veja o arquivo [LICENSE](./LICENSE) para detalhes.

---

## 👨‍💻 Sobre

LeadZone foi desenvolvido como uma solução moderna e escalável para prospección B2B, com foco em experiência do usuário, performance e facilidade de uso. Combina tecnologias contemporâneas com boas práticas de engenharia de software.

**Status:** Ativo e em desenvolvimento contínuo

---

<div align="center">

**Feito com ❤️ para vendedores e empreendedores na América Latina**

</div>