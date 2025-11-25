"use client";
import { useParams } from 'next/navigation';
import StorageDetails from '@/components/StorageDetails';

export default function LocationPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;  
  return (
    <div>
      <div className='container mt-12 mx-auto px-4 py-8 bg-white'>
        <StorageDetails locationId={id} />
      </div>
    </div>
  );
}