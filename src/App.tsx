import { lazy, Suspense, type ReactNode } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { PageLoader } from '@/components/layout/PageLoader';
import { pageTransition } from '@/lib/motion';

const HomePage = lazy(() => import('@/pages/HomePage'));
const HeroesPage = lazy(() => import('@/pages/HeroesPage'));
const HeroDetailPage = lazy(() => import('@/pages/HeroDetailPage'));
const MapPage = lazy(() => import('@/pages/MapPage'));
const BeginnersPage = lazy(() => import('@/pages/BeginnersPage'));
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'));
const PatchPage = lazy(() => import('@/pages/PatchPage'));
const ComparePage = lazy(() => import('@/pages/ComparePage'));
const PickPage = lazy(() => import('@/pages/PickPage'));
const CounterPage = lazy(() => import('@/pages/CounterPage'));
const MePage = lazy(() => import('@/pages/MePage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

/** Обёртка страницы для анимированного перехода. */
function Page({ children }: { children: ReactNode }) {
  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit">
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();
  return (
    <Layout>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Page><HomePage /></Page>} />
          <Route path="/heroes" element={<Page><HeroesPage /></Page>} />
          <Route path="/heroes/:slug" element={<Page><HeroDetailPage /></Page>} />
          <Route path="/map" element={<Page><MapPage /></Page>} />
          <Route path="/beginners" element={<Page><BeginnersPage /></Page>} />
          <Route path="/favorites" element={<Page><FavoritesPage /></Page>} />
          <Route path="/patch" element={<Page><PatchPage /></Page>} />
          <Route path="/compare" element={<Page><ComparePage /></Page>} />
          <Route path="/pick" element={<Page><PickPage /></Page>} />
          <Route path="/counter" element={<Page><CounterPage /></Page>} />
          <Route path="/me" element={<Page><MePage /></Page>} />
          <Route path="*" element={<Page><NotFoundPage /></Page>} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}
