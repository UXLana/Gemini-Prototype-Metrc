import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAppColors, useDarkMode } from '../hooks/useDarkMode';
import {
  X, Maximize2, Minimize2, ArrowUp, Paperclip, SlidersHorizontal,
  AlertTriangle, CheckCircle2, Info, XCircle, ChevronRight,
} from 'lucide-react';
import { DotAnimation } from '../types';
import { DotGrid } from './DotGrid';

// ─── Agent identity ───────────────────────────────────────────────────────────

const AGENT_NAME = 'Buddy';

export const BUDDY_SYSTEM_PROMPT = `You are Registry Assistant, an agentic chatbot embedded inside the Registry application.

You do not respond with plain text alone.
You respond using structured UI components when appropriate.

Your goal is to:
1. Help users complete tasks.
2. Display structured data using UI components.
3. Keep responses concise, accurate, and actionable.
4. Use conversational text only when necessary.
5. Prefer visual components over long explanations.

--------------------------------------------------
CORE BEHAVIOR
--------------------------------------------------

- If the response includes lists of products, render a DATA_TABLE.
- If the response includes summary metrics, render STAT_CARDS.
- If the response includes a single product or object, render an ENTITY_CARD.
- If the response includes warnings or compliance issues, render a BANNER.
- If the response includes step guidance, render a STEPPER.
- If clarification is needed, render TEXT + ACTION_BUTTONS.
- Never fabricate data.
- Confirm before bulk updates, deletes, or publish actions.
- Do not bypass required fields or validations.

--------------------------------------------------
RESPONSE STRUCTURE
--------------------------------------------------

Always respond in JSON using the following structure:

{
  "text": "Short conversational message (optional but concise)",
  "components": [
    {
      "type": "COMPONENT_TYPE",
      "props": { ... }
    }
  ],
  "actions": [
    {
      "label": "Button label",
      "action": "ACTION_IDENTIFIER",
      "payload": { ... }
    }
  ]
}

--------------------------------------------------
AVAILABLE COMPONENT TYPES
--------------------------------------------------

1. DATA_TABLE
{
  "type": "DATA_TABLE",
  "props": {
    "title": "Table title",
    "columns": [
      { "key": "name", "label": "Product Name" },
      { "key": "category", "label": "Category" },
      { "key": "status", "label": "Status" }
    ],
    "rows": [
      { "id": "1", "name": "Wyld Raspberry", "category": "Edibles", "status": "Missing THC %" }
    ]
  }
}

2. ENTITY_CARD
{
  "type": "ENTITY_CARD",
  "props": {
    "title": "Wyld Raspberry",
    "subtitle": "Edibles • Active",
    "fields": [
      { "label": "Market", "value": "Illinois" },
      { "label": "Price", "value": "$25.00" },
      { "label": "Compliance", "value": "Missing COA" }
    ]
  }
}

3. STAT_CARDS
{
  "type": "STAT_CARDS",
  "props": {
    "items": [
      { "label": "Total Products", "value": 4500 },
      { "label": "Active Brands", "value": 14 },
      { "label": "Drafts", "value": 3 }
    ]
  }
}

4. BANNER
{
  "type": "BANNER",
  "props": {
    "variant": "warning",
    "title": "Products missing required data",
    "description": "12 products cannot be published due to missing THC %."
  }
}

5. STEPPER
{
  "type": "STEPPER",
  "props": {
    "title": "Register New Product",
    "steps": [
      { "label": "Basic Info", "status": "complete" },
      { "label": "Compliance", "status": "current" },
      { "label": "Pricing", "status": "upcoming" }
    ]
  }
}

--------------------------------------------------
COMPLIANCE RULES
--------------------------------------------------

- Do not publish products with missing required fields.
- Warn clearly if a compliance issue exists.
- Require explicit confirmation before bulk changes.

--------------------------------------------------
STYLE
--------------------------------------------------

- Use short, direct language.
- Avoid corporate filler.
- Prefer structured UI over paragraphs.
- Make responses feel integrated with the product UI.

You are not a generic chatbot.
You are a structured UI-producing assistant inside Registry.`;

// ─── Types ────────────────────────────────────────────────────────────────────

interface SophieAction {
  label: string;
  action: string;
  payload?: Record<string, unknown>;
}

interface DataTableProps {
  title?: string;
  columns: { key: string; label: string }[];
  rows: Record<string, string | number>[];
}

interface EntityCardProps {
  title: string;
  subtitle?: string;
  fields: { label: string; value: string | number }[];
}

interface StatCardsProps {
  items: { label: string; value: string | number }[];
}

interface BannerProps {
  variant: 'info' | 'warning' | 'error' | 'success';
  title: string;
  description?: string;
}

interface StepperProps {
  title?: string;
  steps: { label: string; status: 'complete' | 'current' | 'upcoming' }[];
}

type UIComponent =
  | { type: 'DATA_TABLE'; props: DataTableProps }
  | { type: 'ENTITY_CARD'; props: EntityCardProps }
  | { type: 'STAT_CARDS'; props: StatCardsProps }
  | { type: 'BANNER'; props: BannerProps }
  | { type: 'STEPPER'; props: StepperProps };

interface AssistantPayload {
  text?: string;
  components?: UIComponent[];
  actions?: SophieAction[];
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  structured?: AssistantPayload;
}

// ─── Simulated responses ──────────────────────────────────────────────────────

const MOCK_RESPONSES: Record<string, AssistantPayload> = {
  'Find all products with missing data': {
    text: '12 products have incomplete data that blocks publishing.',
    components: [
      {
        type: 'BANNER',
        props: {
          variant: 'warning',
          title: 'Products missing required data',
          description: '12 products cannot be published due to missing THC %, COA, or pricing.',
        },
      },
      {
        type: 'DATA_TABLE',
        props: {
          title: 'Products with missing data',
          columns: [
            { key: 'name', label: 'Product Name' },
            { key: 'category', label: 'Category' },
            { key: 'issue', label: 'Missing Field' },
          ],
          rows: [
            { id: '1', name: 'Wyld Raspberry Gummies', category: 'Edibles', issue: 'THC %' },
            { id: '2', name: 'Kiva Midnight Blueberry', category: 'Edibles', issue: 'COA' },
            { id: '3', name: 'STIIIZY OG Kush Pod', category: 'Vaporizers', issue: 'Price' },
            { id: '4', name: 'Camino Pineapple Habanero', category: 'Edibles', issue: 'THC %' },
            { id: '5', name: 'Raw Garden Live Resin', category: 'Concentrates', issue: 'COA, Price' },
          ],
        },
      },
    ],
    actions: [
      { label: 'Fix all', action: 'FIX_ALL_MISSING' },
      { label: 'Review one by one', action: 'REVIEW_SEQUENTIAL' },
    ],
  },

  'Register a new product for me': {
    text: "Let's get your new product registered. Here's where we are:",
    components: [
      {
        type: 'STEPPER',
        props: {
          title: 'Register New Product',
          steps: [
            { label: 'Basic Info', status: 'current' },
            { label: 'Category & Attributes', status: 'upcoming' },
            { label: 'Compliance', status: 'upcoming' },
            { label: 'Market Selection', status: 'upcoming' },
            { label: 'Review & Submit', status: 'upcoming' },
          ],
        },
      },
    ],
    actions: [
      { label: 'Start registration', action: 'OPEN_REGISTRATION' },
      { label: 'Import from CSV', action: 'IMPORT_CSV' },
    ],
  },

  'Which products are not in any market yet?': {
    text: '3 products have no market assignments.',
    components: [
      {
        type: 'BANNER',
        props: {
          variant: 'info',
          title: 'Unassigned products',
          description: 'These products exist in your catalog but are not listed in any market.',
        },
      },
      {
        type: 'DATA_TABLE',
        props: {
          title: 'Products without markets',
          columns: [
            { key: 'name', label: 'Product Name' },
            { key: 'brand', label: 'Brand' },
            { key: 'category', label: 'Category' },
          ],
          rows: [
            { id: '1', name: 'Leafly Blue Dream Pre-Roll', brand: 'Leafly', category: 'Pre-Rolls' },
            { id: '2', name: 'Dosist Calm Pen', brand: 'Dosist', category: 'Vaporizers' },
            { id: '3', name: 'Plus Sour Watermelon', brand: 'Plus Products', category: 'Edibles' },
          ],
        },
      },
    ],
    actions: [
      { label: 'Assign markets', action: 'ASSIGN_MARKETS' },
    ],
  },

  'Create a bundle from my top sellers': {
    text: 'Here are your current top-selling products. Select which ones to bundle:',
    components: [
      {
        type: 'DATA_TABLE',
        props: {
          title: 'Top sellers (last 30 days)',
          columns: [
            { key: 'name', label: 'Product Name' },
            { key: 'category', label: 'Category' },
            { key: 'units', label: 'Units Sold' },
          ],
          rows: [
            { id: '1', name: 'Wyld Raspberry Gummies', category: 'Edibles', units: 1240 },
            { id: '2', name: 'STIIIZY OG Kush Pod', category: 'Vaporizers', units: 980 },
            { id: '3', name: 'Raw Garden Sauce Cart', category: 'Concentrates', units: 870 },
            { id: '4', name: 'Kiva Midnight Blueberry', category: 'Edibles', units: 760 },
          ],
        },
      },
    ],
    actions: [
      { label: 'Bundle all 4', action: 'CREATE_BUNDLE', payload: { ids: ['1', '2', '3', '4'] } },
      { label: 'Let me pick', action: 'SELECT_FOR_BUNDLE' },
    ],
  },

  'Show me recent activity across all markets': {
    text: 'Here's a snapshot of your registry activity this week.',
    components: [
      {
        type: 'STAT_CARDS',
        props: {
          items: [
            { label: 'Products Registered', value: 23 },
            { label: 'Markets Updated', value: 5 },
            { label: 'Compliance Flags', value: 8 },
            { label: 'Bundles Created', value: 2 },
          ],
        },
      },
      {
        type: 'BANNER',
        props: {
          variant: 'warning',
          title: '8 compliance flags this week',
          description: 'Most are related to missing THC testing certificates in Illinois and Michigan.',
        },
      },
    ],
    actions: [
      { label: 'View compliance details', action: 'VIEW_COMPLIANCE' },
      { label: 'Export report', action: 'EXPORT_REPORT' },
    ],
  },
};

const DEFAULT_RESPONSE: AssistantPayload = {
  text: "I can help with that. Here's what I can do for you:",
  actions: [
    { label: 'Find products with missing data', action: 'QUERY_MISSING' },
    { label: 'Register a new product', action: 'OPEN_REGISTRATION' },
    { label: 'Show market overview', action: 'MARKET_OVERVIEW' },
  ],
};

// ─── Conversation starters ────────────────────────────────────────────────────

const CONVERSATION_STARTERS = [
  'Find all products with missing data',
  'Register a new product for me',
  'Which products are not in any market yet?',
  'Create a bundle from my top sellers',
  'Show me recent activity across all markets',
];

// ─── Component renderers ──────────────────────────────────────────────────────

function DataTableRenderer({ props, colors }: { props: DataTableProps; colors: ReturnType<typeof useAppColors> }) {
  return (
    <div className="rounded-lg border overflow-hidden" style={{ borderColor: colors.border.lowEmphasis.onLight }}>
      {props.title && (
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.text.lowEmphasis.onLight, backgroundColor: colors.surface.lightDarker }}>
          {props.title}
        </div>
      )}
      <table className="w-full text-xs">
        <thead>
          <tr style={{ backgroundColor: colors.surface.lightDarker }}>
            {props.columns.map((col) => (
              <th key={col.key} className="text-left px-3 py-2 font-medium" style={{ color: colors.text.lowEmphasis.onLight }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.rows.map((row, i) => (
            <tr key={row.id ?? i} className="border-t" style={{ borderColor: colors.border.lowEmphasis.onLight }}>
              {props.columns.map((col) => (
                <td key={col.key} className="px-3 py-2" style={{ color: colors.text.highEmphasis.onLight }}>
                  {row[col.key] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EntityCardRenderer({ props, colors }: { props: EntityCardProps; colors: ReturnType<typeof useAppColors> }) {
  return (
    <div className="rounded-lg border p-4" style={{ borderColor: colors.border.lowEmphasis.onLight, backgroundColor: colors.surface.lightDarker }}>
      <div className="font-semibold text-sm" style={{ color: colors.text.highEmphasis.onLight }}>{props.title}</div>
      {props.subtitle && (
        <div className="text-xs mt-0.5 mb-3" style={{ color: colors.text.lowEmphasis.onLight }}>{props.subtitle}</div>
      )}
      <div className="grid grid-cols-2 gap-2 mt-2">
        {props.fields.map((f) => (
          <div key={f.label}>
            <div className="text-[10px] uppercase tracking-wider font-medium" style={{ color: colors.text.lowEmphasis.onLight }}>{f.label}</div>
            <div className="text-xs font-medium mt-0.5" style={{ color: colors.text.highEmphasis.onLight }}>{f.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCardsRenderer({ props, colors }: { props: StatCardsProps; colors: ReturnType<typeof useAppColors> }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {props.items.map((item) => (
        <div key={item.label} className="rounded-lg border p-3" style={{ borderColor: colors.border.lowEmphasis.onLight, backgroundColor: colors.surface.lightDarker }}>
          <div className="text-[10px] uppercase tracking-wider font-medium" style={{ color: colors.text.lowEmphasis.onLight }}>{item.label}</div>
          <div className="text-lg font-bold mt-1" style={{ color: colors.text.highEmphasis.onLight }}>{item.value}</div>
        </div>
      ))}
    </div>
  );
}

function BannerRenderer({ props, colors }: { props: BannerProps; colors: ReturnType<typeof useAppColors> }) {
  const variants: Record<string, { icon: React.ReactNode; accent: string; bg: string }> = {
    warning: { icon: <AlertTriangle size={14} />, accent: colors.text.warning, bg: 'rgba(245, 158, 11, 0.08)' },
    error: { icon: <XCircle size={14} />, accent: colors.text.important, bg: 'rgba(239, 68, 68, 0.08)' },
    success: { icon: <CheckCircle2 size={14} />, accent: colors.text.success, bg: 'rgba(16, 185, 129, 0.08)' },
    info: { icon: <Info size={14} />, accent: colors.brand.default, bg: 'rgba(26, 154, 110, 0.08)' },
  };
  const v = variants[props.variant] ?? variants.info;

  return (
    <div className="rounded-lg p-3 flex gap-2.5" style={{ backgroundColor: v.bg }}>
      <div className="shrink-0 mt-0.5" style={{ color: v.accent }}>{v.icon}</div>
      <div>
        <div className="text-xs font-semibold" style={{ color: v.accent }}>{props.title}</div>
        {props.description && (
          <div className="text-xs mt-0.5" style={{ color: colors.text.lowEmphasis.onLight }}>{props.description}</div>
        )}
      </div>
    </div>
  );
}

function StepperRenderer({ props, colors }: { props: StepperProps; colors: ReturnType<typeof useAppColors> }) {
  return (
    <div>
      {props.title && (
        <div className="text-xs font-semibold mb-2" style={{ color: colors.text.highEmphasis.onLight }}>{props.title}</div>
      )}
      <div className="flex flex-col gap-1">
        {props.steps.map((step, i) => {
          const isCurrent = step.status === 'current';
          const isComplete = step.status === 'complete';
          return (
            <div key={i} className="flex items-center gap-2.5">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                style={{
                  backgroundColor: isComplete ? colors.brand.default : isCurrent ? colors.brand.default : 'transparent',
                  border: !isComplete && !isCurrent ? `1.5px solid ${colors.border.lowEmphasis.onLight}` : 'none',
                  color: isComplete || isCurrent ? '#fff' : colors.text.disabled.onLight,
                }}
              >
                {isComplete ? '✓' : i + 1}
              </div>
              <span
                className="text-xs"
                style={{
                  color: isCurrent ? colors.text.highEmphasis.onLight : isComplete ? colors.text.lowEmphasis.onLight : colors.text.disabled.onLight,
                  fontWeight: isCurrent ? 600 : 400,
                }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ComponentRenderer({ component, colors }: { component: UIComponent; colors: ReturnType<typeof useAppColors> }) {
  switch (component.type) {
    case 'DATA_TABLE': return <DataTableRenderer props={component.props} colors={colors} />;
    case 'ENTITY_CARD': return <EntityCardRenderer props={component.props} colors={colors} />;
    case 'STAT_CARDS': return <StatCardsRenderer props={component.props} colors={colors} />;
    case 'BANNER': return <BannerRenderer props={component.props} colors={colors} />;
    case 'STEPPER': return <StepperRenderer props={component.props} colors={colors} />;
    default: return null;
  }
}

// ─── Main component ───────────────────────────────────────────────────────────

interface ChatPanelProps {
  isOpen: boolean;
  isExpanded: boolean;
  onClose: () => void;
  onToggleExpand: () => void;
  dotAnimation?: DotAnimation;
  onDotAnimationChange?: (v: DotAnimation) => void;
}

export function ChatPanel({ isOpen, isExpanded, onClose, onToggleExpand, dotAnimation = 'pulse', onDotAnimationChange }: ChatPanelProps) {
  const colors = useAppColors();
  const { isDark } = useDarkMode();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const hasMessages = messages.length > 0;

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = { role: 'user', content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setMessage('');
    setIsTyping(true);

    const matched = MOCK_RESPONSES[text.trim()];
    const response = matched ?? DEFAULT_RESPONSE;

    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: response.text ?? '',
        structured: response,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  }, []);

  const handleSend = useCallback(() => {
    sendMessage(message);
  }, [message, sendMessage]);

  return (
    <div
      className={`
        flex flex-col z-[45]
        transition-all duration-300 ease-in-out
        fixed inset-y-0 right-0 md:relative md:inset-auto
        ${isOpen ? 'translate-x-0' : 'translate-x-full md:w-0 md:translate-x-0'}
        ${isOpen && isExpanded ? 'w-full flex-1' : isOpen ? 'w-full md:w-[480px]' : ''}
      `}
      style={{
        backgroundColor: colors.surface.light,
        borderLeft: 'none',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover-surface transition-colors"
            style={{ color: colors.text.lowEmphasis.onLight }}
          >
            <X size={16} />
          </button>
          <div className="flex items-center gap-2 ml-1">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${colors.brand.default}, ${colors.brand.darker ?? colors.brand.default})` }}
            >
              <DotGrid brandColor="#fff" animation="pulse" />
            </div>
            <span className="text-sm font-medium" style={{ color: colors.text.highEmphasis.onLight }}>
              {AGENT_NAME}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {hasMessages && (
            <button
              onClick={() => setMessages([])}
              className="px-2 py-1 rounded-lg text-[11px] font-medium hover-surface transition-colors"
              style={{ color: colors.text.lowEmphasis.onLight }}
              title="New chat"
            >
              New chat
            </button>
          )}
          <button
            onClick={onToggleExpand}
            className="p-1.5 rounded-lg hover-surface transition-colors hidden md:block"
            style={{ color: colors.text.lowEmphasis.onLight }}
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Body */}
      <div ref={scrollRef} className={`flex-1 flex flex-col ${hasMessages ? 'justify-start' : 'items-center justify-center'} px-4 overflow-y-auto`}>
        {!hasMessages ? (
          <div className="flex flex-col items-center">
            <button
              className="mb-5 p-3 rounded-xl transition-colors hover-surface cursor-pointer"
              onClick={() => onDotAnimationChange?.(dotAnimation === 'pulse' ? 'wind' : 'pulse')}
              title={`Switch to ${dotAnimation === 'pulse' ? 'Wind Drift' : 'Pulse'}`}
            >
              <DotGrid brandColor={colors.brand.default} animation={dotAnimation} />
            </button>
            <h2 className="text-lg font-semibold" style={{ color: colors.text.highEmphasis.onLight }}>
              How can I help?
            </h2>
            <p className="text-xs mt-1" style={{ color: colors.text.lowEmphasis.onLight }}>
              I'm {AGENT_NAME}, your Registry assistant
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 py-4 mx-auto w-full" style={{ maxWidth: isExpanded ? 720 : undefined }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'user' ? (
                  <div
                    className="rounded-2xl rounded-br-md px-4 py-2.5 text-sm max-w-[85%]"
                    style={{
                      backgroundColor: colors.brand.default,
                      color: '#fff',
                    }}
                  >
                    {msg.content}
                  </div>
                ) : (
                  <div className="max-w-full w-full flex flex-col gap-2.5">
                    {msg.structured?.text && (
                      <div className="text-sm" style={{ color: colors.text.highEmphasis.onLight }}>
                        {msg.structured.text}
                      </div>
                    )}
                    {msg.structured?.components?.map((comp, ci) => (
                      <ComponentRenderer key={ci} component={comp} colors={colors} />
                    ))}
                    {msg.structured?.actions && msg.structured.actions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {msg.structured.actions.map((act, ai) => (
                          <button
                            key={ai}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover-surface flex items-center gap-1"
                            style={{
                              color: colors.brand.default,
                              borderColor: colors.brand.default,
                            }}
                          >
                            {act.label}
                            <ChevronRight size={12} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="flex gap-1 px-3 py-2">
                  {[0, 1, 2].map((d) => (
                    <div
                      key={d}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor: colors.brand.default,
                        animation: `dotPulse 1.2s ${d * 0.2}s ease-in-out infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 px-4 pb-4 mx-auto w-full" style={{ maxWidth: isExpanded ? 720 : 600 }}>
        <div
          className="rounded-xl border overflow-hidden mb-3"
          style={{
            backgroundColor: colors.surface.light,
            borderColor: colors.border.lowEmphasis.onLight,
          }}
        >
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={hasMessages ? `Ask ${AGENT_NAME} anything...` : 'Search or ask anything'}
            rows={2}
            className="w-full px-4 pt-3 pb-1 text-sm resize-none outline-none bg-transparent"
            style={{ color: colors.text.highEmphasis.onLight }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <div className="flex items-center justify-between px-3 pb-2">
            <div className="flex items-center gap-1">
              <button
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium hover-surface transition-colors"
                style={{ color: colors.text.lowEmphasis.onLight }}
              >
                <SlidersHorizontal size={14} />
                Tools
              </button>
              <button
                className="p-1.5 rounded-lg hover-surface transition-colors"
                style={{ color: colors.text.lowEmphasis.onLight }}
              >
                <Paperclip size={14} />
              </button>
            </div>
            <button
              onClick={handleSend}
              disabled={!message.trim() || isTyping}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
              style={{
                backgroundColor: message.trim() ? colors.brand.default : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                color: message.trim() ? '#fff' : colors.text.disabled.onLight,
                opacity: isTyping ? 0.5 : 1,
              }}
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>

        {/* Conversation starters */}
        {!hasMessages && (
          <div className="flex overflow-x-auto gap-2 pb-1" style={{ scrollbarWidth: 'none' }}>
            {CONVERSATION_STARTERS.map((text, i) => (
              <button
                key={i}
                onClick={() => sendMessage(text)}
                className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors hover-surface whitespace-nowrap shrink-0"
                style={{
                  color: colors.text.lowEmphasis.onLight,
                  borderColor: colors.border.lowEmphasis.onLight,
                }}
              >
                {text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
