import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { type SearchCriteria } from '../types';

export const searchAccommodations = async (
  criteria: SearchCriteria,
  coords: { latitude: number; longitude: number }
): Promise<GenerateContentResponse> => {
    
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Cari daftar penginapan/tempat tinggal (termasuk hotel, apartemen, kos, rumah sewa, vila, guesthouse, losmen, resor, motel, hostel, bungalo, dll.) di sekitar area "${criteria.area}" dengan masa sewa ${criteria.rentalPeriod}.

    Urutkan hasil berdasarkan jarak dari yang terdekat hingga terjauh.

    Berikan jawaban dalam format array JSON yang terbungkus dalam blok kode markdown \`\`\`json.
    Setiap objek dalam array harus memiliki properti berikut: "nama", "alamat", "estimasi_harga" (jika tersedia, jika tidak, kembalikan string "Harga tidak tersedia"), "tipe" (contoh: Hotel, Apartemen, Kos, Rumah, Vila, Guesthouse), "deskripsi" singkat, "latitude" dan "longitude" untuk lokasinya, dan "jarak" (string yang merepresentasikan estimasi jarak dari "${criteria.area}", contoh: "sekitar 5 km").
    Pastikan latitude dan longitude adalah angka (number). Jika tidak dapat menemukan koordinat, biarkan null.
    Contoh:
    \`\`\`json
    [
      {
        "nama": "Hotel Bintang Lima",
        "alamat": "Jl. Merdeka No. 1, Jakarta",
        "estimasi_harga": "Rp 1.000.000 / malam",
        "tipe": "Hotel",
        "deskripsi": "Hotel mewah di pusat kota dengan fasilitas lengkap.",
        "latitude": -6.175392,
        "longitude": 106.827153,
        "jarak": "sekitar 2 km"
      },
      {
        "nama": "Vila Asri",
        "alamat": "Jl. Damai No. 10, Bandung",
        "estimasi_harga": "Harga tidak tersedia",
        "tipe": "Vila",
        "deskripsi": "Vila sewa dengan 3 kamar tidur dan kolam renang pribadi, cocok untuk keluarga.",
        "latitude": -6.9024,
        "longitude": 107.6186,
        "jarak": "sekitar 8 km"
      }
    ]
    \`\`\`
  `;

  // FIX: `toolConfig` must be nested inside the `config` object, not a sibling to it.
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: {
            latitude: coords.latitude,
            longitude: coords.longitude,
          },
        },
      },
    },
  });

  return response;
};