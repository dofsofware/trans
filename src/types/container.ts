export interface Container {
  id: string;
  containerNumber: string;
  volume: number; // en m³
  weight: number; // en kg
  containerType: 'dry' | 'refrigerated' | 'open_top' | 'flat_rack' | 'tank' | 'other';
  size: '20ft' | '40ft' | '40ft_hc' | '45ft';
}

export interface ContainerFormData {
  containerNumber: string;
  volume: string;
  weight: string;
  containerType: 'dry' | 'refrigerated' | 'open_top' | 'flat_rack' | 'tank' | 'other';
  size: '20ft' | '40ft' | '40ft_hc' | '45ft';
}