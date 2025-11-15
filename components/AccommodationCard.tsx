
import React from 'react';
import { type Accommodation } from '../types';

interface AccommodationCardProps {
  accommodation: Accommodation;
  sourceUri?: string;
}

const AccommodationCard: React.FC<AccommodationCardProps> = ({ accommodation, sourceUri }) => {
  const cardContent = (
    <div className="p-6">
      <div className="flex justify-between items-start">
          <div>
              <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold">{accommodation.tipe}</div>
              <h3 className="block mt-1 text-lg leading-tight font-bold text-black">{accommodation.nama}</h3>
              <div className="mt-2 flex items-center text-slate-500 flex-wrap">
                  <span>{accommodation.alamat}</span>
                  {accommodation.jarak && (
                      <>
                          <span className="mx-2 font-bold text-slate-400">&middot;</span>
                          <span className="text-slate-600 font-medium">{accommodation.jarak}</span>
                      </>
                  )}
              </div>
          </div>
          {accommodation.estimasi_harga && accommodation.estimasi_harga.toLowerCase() !== 'harga tidak tersedia' && (
            <div className="flex-shrink-0 ml-4 text-right">
                <p className="text-md font-semibold text-green-600">{accommodation.estimasi_harga}</p>
            </div>
          )}
      </div>
      <p className="mt-4 text-slate-600 text-sm">{accommodation.deskripsi}</p>
    </div>
  );

  const cardContainerClasses = "bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02]";

  if (sourceUri) {
    return (
        <a 
            href={sourceUri} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`${cardContainerClasses} block cursor-pointer hover:shadow-xl outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
            {cardContent}
        </a>
    );
  }

  return (
    <div className={cardContainerClasses}>
      {cardContent}
    </div>
  );
};

export default AccommodationCard;