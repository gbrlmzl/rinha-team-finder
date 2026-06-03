import { LaneOption } from '@/types';

export const PLAYER_POSITIONS: LaneOption[] = [
  {
    key: 'TOP',
    label: 'Top',
    icon: '/assets/icons/Position-Top.png',
  },
  {
    key: 'JUNGLE',
    label: 'Jungle',
    icon: '/assets/icons/Position-Jungle.png',
  },
  {
    key: 'MID',
    label: 'Mid',
    icon: '/assets/icons/Position-Mid.png',
  },
  {
    key: 'ADC',
    label: 'ADC',
    icon: '/assets/icons/Position-Bot.png',
  },
  {
    key: 'SUPPORT',
    label: 'Support',
    icon: '/assets/icons/Position-Support.png',
  },
  {
    key: 'FILL',
    label: 'Fill',
    icon: '/assets/icons/Position-Fill.png',
  },
];

export const DEFAULT_POSITION_ICON = '/assets/icons/DefaultIcon.svg';
