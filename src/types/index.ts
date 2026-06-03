export type Lane = 'TOP' | 'JUNGLE' | 'MID' | 'ADC' | 'SUPPORT' | 'FILL';
export type Role = 'USER' | 'ADMIN';

export interface LaneOption {
  key: Lane;
  label: string;
  icon: string;
}

export interface FreeAgentData {
  id: string;
  nickname: string;
  lanePrincipal: Lane;
  laneSecundaria: Lane;
  contato: string;
  createdAt: string;
  userId: string;
}

export interface EquipeData {
  id: string;
  nome: string;
  contatoCapitao: string;
  laneCapitao: Lane;
  vagasLanes: Lane[];
  createdAt: string;
  userId: string;
}

export interface SessionUser {
  id: string;
  username: string;
  role: Role;
}
