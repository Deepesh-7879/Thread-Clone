// src/styles/common.js — Central Tailwind class library

export const layout = {
  page:        'min-h-screen bg-cream font-sans',
  appShell:    'flex max-w-[1200px] mx-auto min-h-screen',
  feedWrapper: 'flex-1 min-w-0 border-r border-cream-border',
  authPage:    'min-h-screen bg-cream flex items-center justify-center p-4 sm:p-5',
}

export const card = {
  base:        'bg-white rounded-2xl border border-cream-border',
  padded:      'bg-white rounded-2xl border border-cream-border p-5',
  section:     'bg-white rounded-2xl border border-cream-border overflow-hidden',
  post:        'border-b border-cream-border bg-cream hover:bg-cream-dark transition-colors duration-150 cursor-pointer',
  postStatic:  'border-b border-cream-border bg-cream px-3 sm:px-5 py-3.5 sm:py-4',
  notifRead:   'flex gap-3 sm:gap-4 px-3 sm:px-5 py-3.5 sm:py-4 border-b border-cream-border bg-cream hover:bg-cream-dark transition-colors cursor-pointer',
  notifUnread: 'flex gap-3 sm:gap-4 px-3 sm:px-5 py-3.5 sm:py-4 border-b border-cream-border bg-white hover:bg-cream-dark transition-colors cursor-pointer',
}

export const text = {
  logo:        'font-display text-2xl font-bold text-accent tracking-tight',
  logoBark:    'text-bark',
  pageTitle:   'font-display text-base sm:text-lg font-semibold text-ink tracking-tight',
  h1:          'font-display text-xl sm:text-2xl font-bold text-ink',
  h2:          'font-display text-lg sm:text-xl font-semibold text-ink',
  h3:          'font-display text-sm sm:text-base font-semibold text-ink',
  bodyMd:      'text-[14px] sm:text-[15px] text-ink-light leading-relaxed',
  postContent: 'text-[14px] sm:text-[15px] text-ink-light leading-[1.65] whitespace-pre-wrap break-words',
  label:       'text-[13px] font-semibold text-ink-light block mb-1.5',
  meta:        'text-[13px] text-ink-muted',
  metaSm:      'text-xs text-ink-muted',
  username:    'text-[13px] sm:text-[14px] text-ink-muted',
  displayName: 'font-bold text-[14px] sm:text-[15px] text-ink',
  link:        'text-accent font-semibold hover:underline cursor-pointer',
  muted:       'text-ink-muted',
  error:       'text-red-600 text-[13px]',
  stat:        'font-bold text-lg sm:text-xl text-ink font-display',
  statLabel:   'text-xs text-ink-muted',
}

export const btn = {
  primary:     'inline-flex items-center justify-center gap-1.5 bg-accent hover:bg-accent-hover text-white font-bold text-sm rounded-xl px-4 sm:px-5 py-2 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-0',
  primaryLg:   'inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white font-bold text-[15px] rounded-xl px-6 py-3 w-full transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-0',
  primarySm:   'inline-flex items-center justify-center gap-1 bg-accent hover:bg-accent-hover text-white font-bold text-xs rounded-xl px-3 py-1.5 transition-colors duration-150 disabled:opacity-50 cursor-pointer border-0',
  secondary:   'inline-flex items-center justify-center gap-1.5 bg-transparent hover:bg-cream-dark text-ink font-semibold text-sm rounded-xl px-4 sm:px-5 py-2 border border-cream-border transition-colors duration-150 cursor-pointer',
  secondaryLg: 'inline-flex items-center justify-center gap-2 bg-transparent hover:bg-cream-dark text-ink font-semibold text-[15px] rounded-xl px-6 py-3 w-full border border-cream-border transition-colors duration-150 cursor-pointer',
  secondarySm: 'inline-flex items-center justify-center bg-transparent hover:bg-cream-dark text-ink font-semibold text-xs rounded-xl px-3 py-1.5 border border-cream-border transition-colors duration-150 cursor-pointer',
  ghost:       'inline-flex items-center justify-center gap-1.5 bg-transparent hover:bg-cream-dark text-ink-muted font-medium text-sm rounded-xl px-3 py-2 transition-colors duration-150 cursor-pointer border-0',
  danger:      'inline-flex items-center justify-center gap-1.5 bg-transparent hover:bg-red-50 text-red-600 font-semibold text-sm rounded-xl px-4 py-2 border border-red-200 transition-colors duration-150 cursor-pointer',
  follow:      'inline-flex items-center justify-center bg-accent hover:bg-accent-hover text-white font-bold text-xs rounded-xl px-3 py-1.5 transition-colors duration-150 cursor-pointer border-0',
  following:   'inline-flex items-center justify-center bg-transparent hover:bg-red-50 text-ink hover:text-red-600 font-bold text-xs rounded-xl px-3 py-1.5 border border-cream-border hover:border-red-200 transition-all duration-150 cursor-pointer',
  sidebarPost: 'w-full py-2.5 bg-accent hover:bg-accent-hover text-white font-bold rounded-2xl border-0 cursor-pointer transition-colors',
  composePost: 'bg-accent hover:bg-accent-hover disabled:bg-sand text-white font-bold text-sm rounded-2xl px-4 sm:px-5 py-2 transition-colors duration-150 disabled:cursor-not-allowed cursor-pointer border-0 flex items-center gap-2',
}

export const input = {
  base:          'w-full px-3 sm:px-4 py-2.5 bg-cream border border-cream-border rounded-xl text-[15px] text-ink outline-none focus:border-accent transition-colors duration-150 placeholder:text-ink-muted',
  textarea:      'w-full px-3 sm:px-4 py-2.5 bg-cream border border-cream-border rounded-xl text-[15px] text-ink outline-none focus:border-accent transition-colors duration-150 resize-none placeholder:text-ink-muted',
  search:        'flex-1 bg-transparent border-none outline-none text-[14px] text-ink placeholder:text-ink-muted',
  searchWrapper: 'flex items-center gap-2.5 bg-white border border-cream-border rounded-2xl px-4 py-2.5 focus-within:border-accent transition-colors duration-150',
  comment:       'flex-1 bg-cream-dark border border-cream-border rounded-2xl px-3 py-2 text-[13px] text-ink outline-none focus:border-accent transition-colors duration-150 placeholder:text-ink-muted',
  compose:       'w-full bg-transparent border-none outline-none resize-none text-[15px] sm:text-[17px] text-ink leading-relaxed placeholder:text-ink-muted',
  errorMsg:      'bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-red-600 text-[13px]',
}

export const nav = {
  sidebar:    'hidden md:flex w-[60px] lg:w-[240px] shrink-0 h-screen sticky top-0 border-r border-cream-border bg-cream flex-col px-2 lg:px-3 py-4 overflow-y-auto',
  item:       'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl border-0 cursor-pointer font-sans transition-all duration-150 text-left text-ink bg-transparent hover:bg-cream-dark font-medium',
  itemActive: 'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl border-0 cursor-pointer font-sans transition-all duration-150 text-left text-accent bg-accent-light font-bold',
  dot:        'ml-auto w-1.5 h-1.5 rounded-full bg-accent hidden lg:block',
  mobileBar:  'md:hidden fixed bottom-0 left-0 right-0 z-50 bg-cream border-t border-cream-border flex items-center justify-around px-1 py-1',
}

export const navbar = {
  wrapper: 'sticky top-0 z-40 bg-cream/90 backdrop-blur-md border-b border-cream-border px-3 sm:px-5 py-3 sm:py-3.5 flex items-center gap-3 min-h-[52px] sm:min-h-[56px]',
  backBtn: 'bg-transparent hover:bg-cream-dark border-0 cursor-pointer text-ink text-lg px-2 py-1 rounded-xl transition-colors duration-150 shrink-0',
}

export const av = {
  xs: 'w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 select-none border-2',
  sm: 'w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none border-2',
  md: 'w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 select-none border-2',
  lg: 'w-14 h-14 rounded-full flex items-center justify-center font-bold text-base shrink-0 select-none border-[3px]',
  xl: 'w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg shrink-0 select-none border-[3px]',
}

export const post = {
  wrapper:       'px-3 sm:px-5 py-3.5 sm:py-4 border-b border-cream-border bg-cream hover:bg-cream-dark transition-colors duration-150 cursor-pointer',
  wrapperStatic: 'px-3 sm:px-5 py-3.5 sm:py-4 border-b border-cream-border bg-cream',
  body:          'flex gap-2.5 sm:gap-3',
  authorName:    'font-bold text-[14px] sm:text-[15px] text-ink hover:underline cursor-pointer',
  image:         'mt-2.5 rounded-xl sm:rounded-2xl overflow-hidden border border-cream-border',
  actionBtn:     'flex items-center gap-1 sm:gap-1.5 text-[12px] sm:text-[13px] font-medium text-ink-muted px-1.5 sm:px-2 py-1.5 rounded-xl border-0 bg-transparent transition-all duration-150 cursor-pointer hover:text-brand-blue hover:bg-brand-blue-light',
}

export const profile = {
  banner:    'h-24 sm:h-32 relative',
  info:      'px-4 sm:px-5 pt-10 pb-4 border-b border-cream-border',
  tabBar:    'flex border-b border-cream-border',
  tab:       'flex-1 py-3 sm:py-3.5 border-0 cursor-pointer font-sans font-medium text-sm text-ink-muted bg-transparent border-b-2 border-transparent hover:text-ink transition-all duration-150',
  tabActive: 'flex-1 py-3 sm:py-3.5 border-0 cursor-pointer font-sans font-bold text-sm text-accent bg-transparent border-b-2 border-accent transition-all duration-150',
}

export const modal = {
  overlay:  'fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-[1000] p-0 sm:p-5',
  panel:    'bg-cream rounded-t-3xl sm:rounded-3xl w-full border border-cream-border shadow-strong max-h-[90vh] overflow-y-auto',
  header:   'flex items-center justify-between px-5 sm:px-6 py-4 border-b border-cream-border',
  body:     'px-5 sm:px-6 py-5',
  closeBtn: 'w-8 h-8 flex items-center justify-center bg-transparent hover:bg-cream-dark border-0 cursor-pointer text-ink-muted text-lg rounded-lg transition-colors duration-150',
}

export const auth = {
  card:     'bg-white rounded-2xl sm:rounded-3xl border border-cream-border shadow-strong p-6 sm:p-10 w-full max-w-[440px]',
  logo:     'font-display text-[26px] sm:text-[28px] font-bold text-accent',
  title:    'font-display text-[20px] sm:text-[22px] font-semibold text-ink mt-3 sm:mt-4',
  subtitle: 'text-sm text-ink-muted mt-1',
  divider:  'text-center text-[14px] text-ink-muted mt-5',
}

export const misc = {
  spinner:    'rounded-full border-2 border-cream-border border-t-accent animate-spin',
  spinnerSm:  'w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin',
  emptyState: 'flex flex-col items-center justify-center py-16 sm:py-20 gap-3 text-ink-muted px-5 text-center',
  emptyIcon:  'text-4xl sm:text-5xl opacity-20',
}
