/**
 * Constantes e utilitários para validação de arquivos
 */

import {
  FileAudio,
  FileChartPie,
  File as FileDefault,
  FileImage,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';

export const ALLOWED_EXTENSIONS = [
  'pdf',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
  'txt',
  'csv',
  'json',
  'xml',
  'md',
  'png',
  'jpg',
  'jpeg',
  'gif',
  'svg',
  'webp',
  'mp3',
  'wav',
  'mp4',
  'webm',
];

export const ICONS_CONFIG = {
  default: { color: 'var(--color-text-2)', Icon: FileDefault },
  docx: { color: '#6B84C9', Icon: FileText },
  jpg: { color: '#E38F40', Icon: FileImage },
  mp3: { color: '#9949BF', Icon: FileAudio },
  pdf: { color: '#C95252', Icon: FileDefault },
  pptx: { color: '#BFA149', Icon: FileChartPie },
  xlsx: { color: '#24A254', Icon: FileSpreadsheet },
} as const;

export type FileType = keyof typeof ICONS_CONFIG;

export const MAX_FILE_SIZE_MB = 100;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

/**
 * Helper function to format file size in bytes/KB/MB
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes.toString()} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const getFileExtension = (fileName: string): string => {
  return fileName.split('.').pop()?.toLowerCase() ?? '';
};

export const getFileType = (fileName: string): FileType => {
  const extension = getFileExtension(fileName);
  if (['pdf'].includes(extension)) return 'pdf';
  if (['doc', 'docx'].includes(extension)) return 'docx';
  if (['gif', 'jpeg', 'jpg', 'png', 'svg'].includes(extension)) return 'jpg';
  if (['ppt', 'pptx'].includes(extension)) return 'pptx';
  if (['csv', 'xls', 'xlsx'].includes(extension)) return 'xlsx';
  if (
    ['aac', 'avi', 'flac', 'm4a', 'mov', 'mp3', 'mp4', 'mpeg', 'ogg', 'wav', 'webm'].includes(
      extension,
    )
  )
    return 'mp3';
  return 'default';
};

/**
 * Verifica se a extensão de um arquivo é permitida
 */
export const isAllowedExtension = (fileName: string): boolean => {
  return ALLOWED_EXTENSIONS.includes(getFileExtension(fileName));
};

/**
 * Verifica se o arquivo está dentro do limite de tamanho
 */
export const isWithinSizeLimit = (file: File): boolean => {
  return file.size <= MAX_FILE_SIZE_BYTES;
};
