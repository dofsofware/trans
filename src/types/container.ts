export interface Container {
  id: string;
  containerNumber: string;
  volume: number; // en m³
  weight: number; // en kg
  containerType: 'dry' | 'refrigerated' | 'open_top' | 'flat_rack' | 'tank' | 'other';
  size: 'ft20' | 'ft40' | 'ft_hc40' | 'ft45';
}

export interface ContainerFormData {
  containerNumber: string;
  volume: string;
  weight: string;
  containerType: 'dry' | 'refrigerated' | 'open_top' | 'flat_rack' | 'tank' | 'other';
  size:  'ft20' | 'ft40' | 'ft_hc40' | 'ft45';
}