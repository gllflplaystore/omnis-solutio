import GlobalNetwork from "@/components/GlobeNetwork";

export default function PricingPage() {
    return (

        <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0 flex items-center justify-center">
                <GlobalNetwork />
            </div>
            <div className="relative z-10 text-center px-6">
                <h1 className="mt-6 text-4xl md:text-4xl font-semibold text-white">
                    Exciting things are happening
                    <br />
                    behind the scenes!
                </h1>
                <button className="mt-8 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md">
                    Back to home page →
                </button>
            </div>
        </section>
    );
}
