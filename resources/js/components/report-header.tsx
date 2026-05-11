import React from 'react';

interface ReportHeaderProps {
    title: string;
}

export default function ReportHeader({ title }: ReportHeaderProps) {
    const today = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="mb-8 border-b-2 border-primary pb-4 print:border-black print:text-black">
            <div className="flex flex-col items-center text-center">
                <h1 className="text-3xl font-bold uppercase tracking-wider text-primary print:text-black">PT. NABIL RENTAL MOBIL PADANG</h1>
                <p className="text-sm text-muted-foreground mt-1 print:text-black">Jl. Jendral Sudirman No. 123, Padang, Sumatera Barat</p>
                <p className="text-sm text-muted-foreground print:text-black">Telp: (0751) 123456 | Email: info@nabilrental.com</p>
                
                <div className="mt-6 w-full flex justify-between items-end border-t border-primary pt-4 print:border-black">
                    <h2 className="text-xl font-semibold uppercase print:text-black">{title}</h2>
                    <p className="text-sm italic text-muted-foreground print:text-black">Tanggal Cetak: {today}</p>
                </div>
            </div>
        </div>
    );
}
