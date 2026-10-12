import {
  Archive, BookOpen, Briefcase, Camera, Code, Download, FileText, Folder, FolderPlus, Image, Music, Video,
  type LucideIcon,
} from 'lucide-react';
import type { IconName } from '../../../lib/types';

export const PRESET_ICONS: Record<IconName, LucideIcon> = {
  'file-text': FileText, image: Image, video: Video, archive: Archive, music: Music,
  folder: Folder, book: BookOpen, code: Code, briefcase: Briefcase, camera: Camera,
};
export const DefaultIcon = Download;
export const CustomIcon = FolderPlus;
