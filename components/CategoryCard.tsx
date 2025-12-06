import Image, { StaticImageData } from 'next/image';

interface CategoryCardProps {
  name: string;
  bgColor: string;
  iconColor: string;
  iconShape: 'square' | 'circle';
  image?: StaticImageData;
}

export default function CategoryCard({ 
  name, 
  bgColor, 
  iconColor, 
  iconShape = 'circle',
  image
}: CategoryCardProps) {
  return (
    <div 
      className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
    >
      <div className={`w-16 h-16 ${bgColor} rounded-xl flex items-center justify-center mb-2`}>
        {image ? (
          <Image 
            src={image} 
            alt={name}
            width={32}
            height={32}
            className="object-contain"
          />
        ) : (
          <div className={`w-8 h-8 ${iconColor} ${iconShape === 'circle' ? 'rounded-full' : 'rounded-sm'} flex items-center justify-center`}>
            <div className={`w-4 h-4 bg-white ${iconShape === 'circle' ? 'rounded-full' : 'rounded-sm'}`}></div>
          </div>
        )}
      </div>
      <span className="text-xs text-gray-600 text-center leading-tight">{name}</span>
    </div>
  );
}