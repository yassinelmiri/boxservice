import dynamic from 'next/dynamic';

const DynamicMapComponent = dynamic(
  () => import('./MapComponent'),
  {
    ssr: false,
    loading: () => <div className="flex justify-center items-center h-[800px]">Chargement de la carte...</div>
  }
);

const DynamicMapWrapper = () => {
  return <DynamicMapComponent />;
};

export default DynamicMapWrapper;