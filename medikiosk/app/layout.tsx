import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { AppearanceProvider } from '@/components/providers/AppearanceProvider';

export const metadata: Metadata = {
  title: 'MediKiosk - Doctor Consultation Dashboard',
  description: 'Complete History • Structured Summary • Quick Review • Better Decisions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var raw = localStorage.getItem('medikiosk_appearance_settings');
                  var stored = raw ? JSON.parse(raw) : {};
                  var size = typeof stored.textSize === 'number' ? stored.textSize : 100;
                  var isWide = window.innerWidth >= 1440;
                  var basePx = isWide ? 19 : 18;
                  var px = Math.round(((basePx * size) / 100) * 100) / 100;
                  document.documentElement.style.setProperty('font-size', px + 'px', 'important');
                  document.documentElement.style.setProperty('--app-base-font-size', px + 'px', 'important');
                  document.documentElement.style.setProperty('--app-font-scale', size + '%', 'important');
                  document.documentElement.setAttribute('data-text-size', size);
                  if (stored.theme === 'dark' || (!stored.theme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] text-[#0F172A] dark:text-[#F8FAFC] antialiased transition-colors duration-200">
        <AppearanceProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </AppearanceProvider>
      </body>
    </html>
  );
}
