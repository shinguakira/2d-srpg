import type { ChapterData } from '../../core/types';
import { CHAPTER_1 } from './chapter1';
import { CHAPTER_2 } from './chapter2';

export const CHAPTERS: Record<string, ChapterData> = {
  ch1: CHAPTER_1,
  ch2: CHAPTER_2,
};

export const CHAPTER_ORDER: string[] = ['ch1', 'ch2'];
