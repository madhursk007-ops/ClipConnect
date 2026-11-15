import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Check, CheckCheck, ChevronDown, CircleHelp, FileText,
  Film, Hash, Info, MessageCircle, MoreHorizontal, Paperclip, Plus,
  Search, Send, Settings, Sparkles, Users
} from 'lucide-react';
import { useAuth } from '@hooks';
import { messageService } from '@services/api';

const fullName = (user) => [user?.firstName, user?.lastName].filter(Boolean).join(' ')
  || user?.username
  || 'ClipConnect member';

const initials = (name = 'CC') => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();

const formatTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const today = new Date();
  const sameDay = date.toDateString() === today.toDateString();
  return sameDay
    ? date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const Avatar = ({ name, src, size = 'md', online = false }) => {
  const dimensions = size === 'lg' ? 'h-16 w-16 text-lg' : size === 'sm' ? 'h-9 w-9 text-xs' : 'h-11 w-11 text-sm';
  return (
    <div className="relative shrink-0">
      {src ? (
        <img src={src} alt={name} className={`${dimensions} rounded-2xl object-cover ring-1 ring-white/10`} />
      ) : (
        <div className={`${dimensions} rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-fuchsia-500 flex items-center justify-center font-bold text-white shadow-lg shadow-violet-950/30`}>
          {initials(name)}
        </div>
      )}
      {online && <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-[3px] border-[#171720] bg-emerald-400" />}
    </div>
  );
};

const Chat = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(userId || null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [mobileChatOpen, setMobileChatOpen] = useState(Boolean(userId));
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const loadConversations = useCallback(async () => {
    try {
      setError('');
      const response = await messageService.getConversations({ limit: 50 });
      const rows = response.data?.data?.conversations || [];
      setConversations(rows);
      setActiveConversation((current) => {
        if (userId) return userId;
        if (current && rows.some((item) => item.otherUser?.id === current)) return current;
        return rows[0]?.otherUser?.id || null;
      });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load your conversations.');
    } finally {
      setLoadingConversations(false);
    }
  }, [userId]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (!activeConversation) {
      setMessages([]);
      return undefined;
    }
    let cancelled = false;
    const loadMessages = async () => {
      setLoadingMessages(true);
      try {
        const response = await messageService.getConversation(activeConversation, { limit: 100 });
        if (!cancelled) {
          setMessages(response.data?.data?.messages || []);
          setConversations((current) => current.map((item) => (
            item.otherUser?.id === activeConversation ? { ...item, unreadCount: 0 } : item
          )));
        }
      } catch (requestError) {
        if (!cancelled) setError(requestError.response?.data?.message || 'Could not load this conversation.');
      } finally {
        if (!cancelled) setLoadingMessages(false);
      }
    };
    loadMessages();
    return () => { cancelled = true; };
  }, [activeConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  const activeConv = conversations.find((item) => item.otherUser?.id === activeConversation);
  const partner = activeConv?.otherUser;
  const partnerName = fullName(partner);
  const currentUserId = currentUser?.id || currentUser?._id;

  const filteredConversations = useMemo(() => conversations.filter((item) => {
    const person = item.otherUser || {};
    const name = fullName(person).toLowerCase();
    const preview = (item.lastMessage?.content || '').toLowerCase();
    const matchesSearch = !searchQuery || name.includes(searchQuery.toLowerCase()) || preview.includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all'
      || (filter === 'unread' && item.unreadCount > 0)
      || (filter === 'clients' && String(person.role).toLowerCase() === 'client')
      || (filter === 'editors' && String(person.role).toLowerCase() === 'editor');
    return matchesSearch && matchesFilter;
  }), [conversations, filter, searchQuery]);

  const handleSelectConversation = (id) => {
    setActiveConversation(id);
    setMobileChatOpen(true);
    setError('');
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    const content = messageInput.trim();
    if (!content || !activeConversation || sending) return;
    setSending(true);
    setError('');
    try {
      const response = await messageService.sendMessage({ recipientId: activeConversation, content, type: 'TEXT' });
      const sentMessage = response.data?.data?.message;
      if (sentMessage) {
        setMessages((current) => [...current, sentMessage]);
        setConversations((current) => {
          const updated = current.map((item) => item.otherUser?.id === activeConversation
            ? { ...item, lastMessage: sentMessage, unreadCount: 0 }
            : item);
          return updated.sort((a, b) => new Date(b.lastMessage?.createdAt || 0) - new Date(a.lastMessage?.createdAt || 0));
        });
      }
      setMessageInput('');
      inputRef.current?.focus();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Message could not be sent. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const unreadTotal = conversations.reduce((total, item) => total + (item.unreadCount || 0), 0);
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'clients', label: 'Clients' },
    { id: 'editors', label: 'Editors' },
    { id: 'unread', label: 'Unread' },
  ];

  return (
    <div className="h-[calc(100dvh-7.5rem)] min-h-[570px] overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111119] text-slate-100 shadow-2xl shadow-black/20">
      <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-[68px_280px_minmax(0,1fr)_260px]">
        {/* Workspace rail */}
        <aside className="hidden flex-col items-center gap-3 border-r border-white/[0.06] bg-[#0d0d14] py-5 lg:flex">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-950/40">
            <Film className="h-5 w-5 text-white" />
          </div>
          <div className="h-px w-8 bg-white/10" />
          {[
            { icon: Users, label: 'Workspace', active: false },
            { icon: Film, label: 'Projects', active: false },
            { icon: MessageCircle, label: 'Messages', active: true },
            { icon: FileText, label: 'Files', active: false },
          ].map(({ icon: Icon, label, active }) => (
            <button key={label} type="button" title={label} className={`relative flex h-11 w-11 items-center justify-center rounded-2xl transition-all ${active ? 'bg-violet-500/20 text-violet-300 ring-1 ring-violet-400/20' : 'text-slate-500 hover:bg-white/[0.06] hover:text-white'}`}>
              {active && <span className="absolute -left-[17px] h-7 w-1 rounded-r-full bg-violet-400" />}
              <Icon className="h-5 w-5" />
            </button>
          ))}
          <div className="mt-auto flex flex-col gap-3">
            <button type="button" title="Help" className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-white/[0.06] hover:text-white"><CircleHelp className="h-5 w-5" /></button>
            <button type="button" title="Settings" className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-white/[0.06] hover:text-white"><Settings className="h-5 w-5" /></button>
            <Avatar name={fullName(currentUser)} src={currentUser?.avatar} size="sm" />
          </div>
        </aside>

        {/* Conversation list */}
        <aside className={`min-h-0 flex-col border-r border-white/[0.06] bg-[#15151f] ${mobileChatOpen ? 'hidden lg:flex' : 'flex'}`}>
          <div className="border-b border-white/[0.06] px-5 pb-4 pt-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-white"><span className="h-2 w-2 rounded-full bg-violet-400" /> ClipConnect</div>
                <h1 className="mt-3 text-xl font-bold tracking-tight">Messages</h1>
              </div>
              <button type="button" title="Workspace options" className="rounded-lg p-2 text-slate-500 hover:bg-white/[0.06] hover:text-white"><ChevronDown className="h-4 w-4" /></button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Find a conversation" className="w-full rounded-xl border border-white/[0.08] bg-[#0e0e16] py-2.5 pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10" />
            </div>
            <div className="mt-4 flex gap-1 overflow-x-auto pb-1">
              {filters.map((item) => (
                <button key={item.id} type="button" onClick={() => setFilter(item.id)} className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition ${filter === item.id ? 'bg-violet-500 text-white shadow-md shadow-violet-950/30' : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-white'}`}>
                  {item.label}{item.id === 'unread' && unreadTotal > 0 ? ` · ${unreadTotal}` : ''}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            <div className="flex items-center justify-between px-3 pb-2 pt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
              <span>Direct messages</span><span>{filteredConversations.length}</span>
            </div>
            {loadingConversations ? (
              <div className="space-y-3 p-3"><div className="h-14 animate-pulse rounded-xl bg-white/[0.04]" /><div className="h-14 animate-pulse rounded-xl bg-white/[0.04]" /><div className="h-14 animate-pulse rounded-xl bg-white/[0.04]" /></div>
            ) : filteredConversations.length ? filteredConversations.map((item) => {
              const person = item.otherUser || {};
              const name = fullName(person);
              const selected = person.id === activeConversation;
              const preview = item.lastMessage?.content || 'Start a conversation';
              const sentByMe = item.lastMessage?.senderId === currentUserId;
              return (
                <button key={person.id} type="button" onClick={() => handleSelectConversation(person.id)} className={`mb-1 flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all ${selected ? 'border-violet-400/15 bg-violet-500/[0.13] shadow-inner shadow-violet-950/20' : 'border-transparent hover:bg-white/[0.045]'}`}>
                  <Avatar name={name} src={person.avatar} size="md" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className={`truncate text-sm font-semibold ${selected ? 'text-white' : 'text-slate-200'}`}>{name}</span>
                      <span className="shrink-0 text-[10px] text-slate-600">{formatTime(item.lastMessage?.createdAt)}</span>
                    </span>
                    <span className="mt-1 flex items-center justify-between gap-2">
                      <span className={`truncate text-xs ${item.unreadCount ? 'font-medium text-slate-200' : 'text-slate-500'}`}>{sentByMe ? 'You: ' : ''}{preview}</span>
                      {item.unreadCount > 0 && <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-violet-500 px-1.5 text-[10px] font-bold text-white">{item.unreadCount}</span>}
                    </span>
                  </span>
                </button>
              );
            }) : (
              <div className="px-4 py-12 text-center">
                <MessageCircle className="mx-auto h-7 w-7 text-slate-700" />
                <p className="mt-3 text-sm font-medium text-slate-400">{searchQuery ? 'No matching conversations' : 'No conversations yet'}</p>
                <p className="mt-1 text-xs text-slate-600">Messages with clients and editors will appear here.</p>
              </div>
            )}
          </div>
          <div className="border-t border-white/[0.06] p-3">
            <div className="flex items-center gap-3 rounded-xl bg-white/[0.035] p-3">
              <Avatar name={fullName(currentUser)} src={currentUser?.avatar} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-200">{fullName(currentUser)}</p>
                <p className="truncate text-[10px] capitalize text-slate-500">{currentUser?.role || 'Member'} workspace</p>
              </div>
              <button type="button" title="Account settings" className="text-slate-500 hover:text-white"><MoreHorizontal className="h-5 w-5" /></button>
            </div>
          </div>
        </aside>

        {/* Active conversation */}
        <main className={`min-h-0 min-w-0 flex-col bg-[radial-gradient(ellipse_at_top,_rgba(124,58,237,0.07),_transparent_42%),#111119] ${mobileChatOpen ? 'flex' : 'hidden lg:flex'}`}>
          {partner ? (
            <>
              <header className="flex items-center justify-between border-b border-white/[0.06] px-4 py-4 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <button type="button" onClick={() => setMobileChatOpen(false)} className="rounded-lg p-2 text-slate-400 hover:bg-white/[0.06] lg:hidden"><ArrowLeft className="h-5 w-5" /></button>
                  <Avatar name={partnerName} src={partner.avatar} />
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-bold text-white">{partnerName}</h2>
                    <p className="mt-0.5 text-xs capitalize text-slate-500">{partner.role || 'ClipConnect member'} <span className="mx-1 text-slate-700">•</span> Direct message</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button type="button" title="Search in conversation" className="rounded-lg p-2.5 text-slate-500 transition hover:bg-white/[0.06] hover:text-white"><Search className="h-[18px] w-[18px]" /></button>
                  <button type="button" title="Conversation details" className="rounded-lg p-2.5 text-slate-500 transition hover:bg-white/[0.06] hover:text-white"><Info className="h-[18px] w-[18px]" /></button>
                  <button type="button" title="More options" className="rounded-lg p-2.5 text-slate-500 transition hover:bg-white/[0.06] hover:text-white"><MoreHorizontal className="h-[18px] w-[18px]" /></button>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
                <div className="mx-auto mb-7 flex max-w-3xl items-center gap-3">
                  <span className="h-px flex-1 bg-white/[0.07]" /><span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Conversation</span><span className="h-px flex-1 bg-white/[0.07]" />
                </div>
                {loadingMessages ? (
                  <div className="mx-auto max-w-3xl space-y-5"><div className="h-16 w-2/3 animate-pulse rounded-2xl bg-white/[0.04]" /><div className="ml-auto h-16 w-1/2 animate-pulse rounded-2xl bg-violet-500/10" /><div className="h-20 w-3/5 animate-pulse rounded-2xl bg-white/[0.04]" /></div>
                ) : messages.length ? (
                  <div className="mx-auto max-w-3xl space-y-5">
                    {messages.map((message, index) => {
                      const isMine = message.senderId === currentUserId;
                      const sender = message.sender || {};
                      const senderName = isMine ? 'You' : fullName(sender) || partnerName;
                      const previous = messages[index - 1];
                      const grouped = previous && previous.senderId === message.senderId && new Date(message.createdAt) - new Date(previous.createdAt) < 5 * 60 * 1000;
                      return (
                        <motion.div key={message.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${isMine ? 'flex-row-reverse' : ''} `}>
                          {!isMine && (grouped ? <div className="w-9 shrink-0" /> : <Avatar name={senderName} src={sender.avatar} size="sm" />)}
                          <div className={`flex max-w-[82%] flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                            {!grouped && <div className={`mb-1.5 flex items-center gap-2 ${isMine ? 'flex-row-reverse' : ''}`}><span className="text-xs font-semibold text-slate-300">{senderName}</span><span className="text-[10px] text-slate-600">{formatTime(message.createdAt)}</span></div>}
                            <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${isMine ? 'rounded-tr-md bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-violet-950/20' : 'rounded-tl-md border border-white/[0.06] bg-[#20202b] text-slate-200'}`}>
                              <p className="whitespace-pre-wrap break-words">{message.content}</p>
                              {message.isEdited && <span className="mt-1 block text-[9px] text-white/50">edited</span>}
                            </div>
                            {isMine && <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-600">{message.isRead ? <><CheckCheck className="h-3 w-3 text-violet-400" /> Read</> : <><Check className="h-3 w-3" /> Sent</>}</div>}
                          </div>
                        </motion.div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                ) : (
                  <div className="flex h-full min-h-64 flex-col items-center justify-center text-center">
                    <Avatar name={partnerName} src={partner.avatar} size="lg" />
                    <h3 className="mt-4 text-lg font-bold text-white">{partnerName}</h3>
                    <p className="mt-1 max-w-xs text-sm text-slate-500">This is the beginning of your direct conversation. Say hello and get the collaboration moving.</p>
                  </div>
                )}
              </div>

              {error && <div className="mx-5 mb-2 rounded-lg border border-rose-400/15 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">{error}</div>}
              <div className="px-4 pb-4 pt-2 sm:px-6">
                <form onSubmit={handleSendMessage} className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-white/[0.09] bg-[#1c1c27] p-2 shadow-lg shadow-black/10 transition focus-within:border-violet-400/30 focus-within:ring-2 focus-within:ring-violet-500/10">
                  <button type="button" title="More attachments" className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-white/[0.06] hover:text-violet-300"><Plus className="h-5 w-5" /></button>
                  <textarea ref={inputRef} rows={1} value={messageInput} onChange={(event) => setMessageInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); handleSendMessage(event); } }} placeholder={`Message ${partnerName}...`} className="max-h-32 min-h-10 flex-1 resize-y border-0 bg-transparent px-2 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:ring-0" />
                  <button type="button" title="Attach a file (coming soon)" className="mb-0.5 hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-white/[0.06] hover:text-violet-300 sm:flex"><Paperclip className="h-[18px] w-[18px]" /></button>
                  <button type="button" title="Add image (coming soon)" className="mb-0.5 hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-white/[0.06] hover:text-violet-300 sm:flex"><ImageIcon className="h-[18px] w-[18px]" /></button>
                  <button type="submit" disabled={!messageInput.trim() || sending} title="Send message" className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500 text-white shadow-md shadow-violet-950/30 transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-40">{sending ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Send className="h-[18px] w-[18px]" />}</button>
                </form>
                <p className="mx-auto mt-2 max-w-3xl text-[10px] text-slate-700">Enter to send <span className="mx-1">•</span> Shift + Enter for a new line</p>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-violet-400/15 bg-violet-500/10 text-violet-300"><MessageCircle className="h-7 w-7" /></div>
              <h2 className="mt-5 text-xl font-bold text-white">Your collaboration hub</h2>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">Choose a client or editor from your conversations to pick up where the project left off.</p>
            </div>
          )}
        </main>

        {/* Context panel */}
        <aside className="hidden min-h-0 flex-col border-l border-white/[0.06] bg-[#15151f] xl:flex">
          {partner ? (
            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              <div className="flex flex-col items-center border-b border-white/[0.06] pb-6 text-center">
                <Avatar name={partnerName} src={partner.avatar} size="lg" />
                <h3 className="mt-3 text-base font-bold text-white">{partnerName}</h3>
                <p className="mt-1 text-xs capitalize text-slate-500">{partner.role || 'ClipConnect member'}</p>
                <span className="mt-3 rounded-full border border-emerald-400/15 bg-emerald-400/[0.08] px-2.5 py-1 text-[10px] font-medium text-emerald-300">ClipConnect member</span>
              </div>
              <section className="border-b border-white/[0.06] py-5">
                <div className="mb-3 flex items-center justify-between"><h4 className="text-xs font-bold text-slate-200">About</h4><button type="button" className="text-slate-600 hover:text-white"><MoreHorizontal className="h-4 w-4" /></button></div>
                <div className="space-y-3 text-xs text-slate-500">
                  <div className="flex items-center gap-2"><Users className="h-4 w-4 text-slate-600" /><span className="capitalize">{partner.role || 'Member'} account</span></div>
                  {partner.username && <div className="flex items-center gap-2"><Hash className="h-4 w-4 text-slate-600" /><span>@{partner.username}</span></div>}
                  <div className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-slate-600" /><span>Direct conversation</span></div>
                </div>
              </section>
              <section className="border-b border-white/[0.06] py-5">
                <div className="mb-3 flex items-center justify-between"><h4 className="text-xs font-bold text-slate-200">Shared files</h4><span className="text-[10px] text-slate-600">Coming soon</span></div>
                <div className="rounded-xl border border-dashed border-white/[0.09] px-3 py-5 text-center"><FileText className="mx-auto h-5 w-5 text-slate-700" /><p className="mt-2 text-[11px] text-slate-600">Files shared in this conversation will appear here.</p></div>
              </section>
              <section className="py-5">
                <h4 className="mb-3 text-xs font-bold text-slate-200">Quick note</h4>
                <div className="rounded-xl border border-violet-400/10 bg-violet-500/[0.06] p-3"><div className="flex items-center gap-2 text-[11px] font-semibold text-violet-300"><Sparkles className="h-3.5 w-3.5" /> Keep projects moving</div><p className="mt-2 text-[11px] leading-relaxed text-slate-500">Use this space to coordinate edits, feedback, timelines and project handoffs.</p></div>
              </section>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center p-6 text-center text-xs text-slate-600">Conversation details will appear here.</div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default Chat;
