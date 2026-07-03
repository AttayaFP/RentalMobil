import LogoMobil from '@/assets/images/logo.jpg';
export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-white">
                <img src={LogoMobil} />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="text-sidebar-foreground mb-0.5 truncate leading-tight font-semibold">PT. Nabil Rental Padang</span>
            </div>
        </>
    );
}
