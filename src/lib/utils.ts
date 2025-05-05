import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines Tailwind CSS classes with clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as a percentage
 */
export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

/**
 * Format a number with fixed decimal places
 */
export function formatNumber(value: number, decimals = 2): string {
  return value.toFixed(decimals);
}

/**
 * Get a random color from a predefined palette
 */
export function getRandomColor(index: number): string {
  const colors = [
    'rgba(59, 130, 246, 0.7)', // blue
    'rgba(20, 184, 166, 0.7)',  // teal
    'rgba(249, 115, 22, 0.7)',  // orange
    'rgba(139, 92, 246, 0.7)',  // purple
    'rgba(16, 185, 129, 0.7)',  // green
    'rgba(239, 68, 68, 0.7)',   // red
    'rgba(245, 158, 11, 0.7)',  // amber
  ];
  
  return colors[index % colors.length];
}

/**
 * Delay execution (with promise)
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate random data for demo purposes
 */
export function generateRandomData(count: number) {
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      id: i,
      studyHours: Math.random() * 10 + 1,
      previousScore: Math.round(Math.random() * 100),
      attendance: Math.random() * 100,
      difficulty: Math.random() * 5 + 1,
      internetAccess: Math.random() > 0.2,
      predictedScore: Math.round(Math.random() * 100),
    });
  }
  return data;
}