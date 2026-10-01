import type { ReactNode } from 'react';
import { useScrollTop } from '@/hooks/useScrollTop';
import { Header } from './Header';
import { Footer } from './Footer';
import { Breadcrumbs } from './Breadcrumbs';
import { ScrollToTopButton } from './ScrollToTopButton';

/** Общий каркас: ссылка «к содержимому», шапка, крошки, контент, футер. */
export function Layout({ children }: { children: ReactNode }) {
  useScrollTop();
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="skip-link">
        Перейти к содержимому
      </a>
      <Header />
      <Breadcrumbs />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
