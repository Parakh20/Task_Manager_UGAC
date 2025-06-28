import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { TaskProvider } from '@/context/TaskContext'
import { ThemeProvider } from '@/context/ThemeContext';
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Task Manager',
  description: 'A modern task management application built with Next.js',
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <TaskProvider>
            {children}
          </TaskProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}