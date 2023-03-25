"use client"

import React, { Suspense } from 'react';
import styles from './page.module.css'
import CommitGraph from './components/commit-graph'
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <div className={styles.graph}>
          <Suspense fallback={<></>}>
            <QueryClientProvider client={queryClient}>
              <CommitGraph />
            </QueryClientProvider> 
          </Suspense>
        </div>
      </div>
    </main>
  )
}
