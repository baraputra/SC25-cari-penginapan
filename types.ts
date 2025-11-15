export type AccommodationType = 
  | 'Hotel' 
  | 'Apartemen' 
  | 'Kos' 
  | 'Rumah' 
  | 'Vila' 
  | 'Guesthouse' 
  | 'Losmen' 
  | 'Resor' 
  | 'Motel' 
  | 'Hostel' 
  | 'Bungalo';

export interface SearchCriteria {
  area: string;
  rentalPeriod: RentalPeriod;
}

export interface Accommodation {
  nama: string;
  alamat: string;
  estimasi_harga: string;
  tipe: string;
  deskripsi: string;
  latitude?: number;
  longitude?: number;
  jarak?: string;
}

export interface MapSource {
    uri: string;
    title: string;
    placeAnswerSources?: { reviewSnippets: { text: string }[] }[]
}

export type GeolocationStatus = 'loading' | 'success' | 'error';

export type GeolocationState = {
  status: GeolocationStatus;
  coords?: {
    latitude: number;
    longitude: number;
  };
  message?: string;
};

export enum RentalPeriod {
  HOURLY = 'Jam',
  DAILY = 'Harian',
  WEEKLY = 'Mingguan',
  MONTHLY = 'Bulanan',
  YEARLY = 'Tahunan',
}