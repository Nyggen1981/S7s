import Image from 'next/image'
import Link from 'next/link'
import { Mountain, Award, Camera, Users, ExternalLink } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 to-mountain-900/60 z-10"></div>
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
          alt="Mountain background"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        
        {/* Content */}
        <div className="relative z-20 text-center text-white px-4 max-w-4xl">
          <div className="mb-6 md:mb-8 flex justify-center">
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 backdrop-blur-sm rounded-3xl p-4 md:p-6 shadow-2xl">
              <Image 
                src="/S7S.png" 
                alt="Sauda Seven Summits" 
                width={200} 
                height={200}
                className="drop-shadow-xl w-[200px] h-[200px] md:w-[280px] md:h-[280px]"
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 drop-shadow-lg px-4">
            Sauda Seven Summits
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 drop-shadow-md px-4">
            Bestig 7 av Saudas gjevaste topper og få den eksklusive S7S-trøya!
          </p>
          <div className="flex flex-col items-center gap-3 md:gap-4 px-4">
            <Link 
              href="/dashboard" 
              className="bg-primary-600 hover:bg-primary-700 text-white px-10 md:px-12 py-3 md:py-4 rounded-lg text-lg md:text-xl font-semibold transition-all transform hover:scale-105 shadow-xl w-full max-w-xs md:w-auto"
            >
              Logg inn
            </Link>
            <Link 
              href="/register" 
              className="text-white hover:text-blue-200 text-sm font-medium transition-all underline decoration-white/50 hover:decoration-blue-200"
            >
              Registrer deg no
            </Link>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-mountain-900">
            Kva er Sauda Seven Summits?
          </h2>
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 space-y-6 text-mountain-700 leading-relaxed">
            <p className="text-lg">
              S7S er eit turkonsept der 7 utvalgte topper blir plukka ut kvart år blant dei gjevaste fjella rundt Sauda. 
              Det er varierende oppmerking og det er derfor viktig at du har kunnskap om det å ferdes i fjellet på eigenhånd.
            </p>
            
            <div className="border-l-4 border-primary-500 pl-6 py-2 bg-blue-50 rounded-r-lg">
              <p className="font-semibold text-mountain-900">⚠️ Viktig informasjon:</p>
              <p className="mt-2">
                Alle sju turer er krevjande høgfjellsturar og føreset at du sjølv kan finne fram under dei gjeldande vêr- og føreforhold. 
                Turane i dette heftet har kart med innteigna ruteforslag, men ver obs på at dette <strong>ikkje er definitive ruteanbefalingar</strong>!
              </p>
            </div>

            <p>
              Ver obs på at du sjølv er ansvarleg for di eiga tryggleik og må sørge for å ha den nødvendige kunnskapen 
              om navigasjon, bekledning, mat og drikke. Ved påmelding til S7S og kjøp av dette heftet bekreftar du at 
              du har ansvar for di eiga tryggleik og er kjent med at Sauda idrettslag fraskriver seg alt ansvar i 
              samband med di topptour.
            </p>

            <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-6 border border-primary-200">
              <h3 className="text-2xl font-bold text-primary-700 mb-3 flex items-center gap-2">
                <Award className="w-6 h-6" />
                Premie
              </h3>
              <p>
                Alle som deltar og kan dokumentere at dei har fullført samtlege sju turer innen fristen vil få ein 
                <strong className="text-primary-700"> unik kvalitetstrøye</strong> med S7S-logoen trykt på.
              </p>
            </div>

            <div className="text-center pt-4">
              <p className="text-xl font-semibold text-mountain-900">
                📅 Sesongen går frå <span className="text-primary-600">oktober 2025</span> til <span className="text-primary-600">15. september 2026</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-mountain-900">
            Slik fungerer det
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="text-center p-6">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-mountain-800">1. Registrer deg</h3>
              <p className="text-mountain-600">
                Fyll ut registreringsskjemaet med dine opplysningar
              </p>
            </div>

            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-mountain-800">2. Betal og få tilgang</h3>
              <p className="text-mountain-600">
                Betal startavgift og få tilgang til S7S-katalogen med detaljert informasjon
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mountain className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-mountain-800">3. Gå på fjell</h3>
              <p className="text-mountain-600">
                Bestig dei 7 utvalgte toppene i Sauda
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-mountain-800">4. Ta bilete</h3>
              <p className="text-mountain-600">
                Dokumenter turen med eit bilete frå toppen
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-mountain-800">5. Få T-skjorta</h3>
              <p className="text-mountain-600">
                Fullfør alle 7 topper og motta den eksklusive S7S-trøya!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Katalog Info Section */}
      <div className="py-20 px-4 bg-gradient-to-br from-mountain-100 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3 bg-gradient-to-br from-primary-600 to-primary-800 p-8 md:p-12 flex items-center justify-center">
                <div className="text-center text-white">
                  <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <p className="text-lg font-semibold">S7S Katalog</p>
                </div>
              </div>
              <div className="md:w-2/3 p-8 md:p-12">
                <h2 className="text-3xl font-bold mb-4 text-mountain-900">
                  Komplett fjellguide
                </h2>
                <p className="text-mountain-600 mb-6">
                  Når du har registrert deg og betalt får du tilgang til vår komplette S7S-katalog med detaljert informasjon om årets 7 utvalgte topper.
                </p>
                <ul className="space-y-2 mb-6 text-mountain-700">
                  <li className="flex items-start gap-2">
                    <Mountain className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <span>Detaljert info om årets 7 topper</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <span>Kart og rutebeskrivingar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Nyttige tips og sikkerheitsråd</span>
                  </li>
                </ul>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>📥 Tilgang:</strong> Katalogen blir tilgjengeleg på ditt dashboard når du har registrert deg og betalt startavgift
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 bg-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-blue-900">
            Klar for utfordringa?
          </h2>
          <p className="text-xl text-blue-800">
            Bli med på Sauda Seven Summits i dag og start din fjellopplevelse!
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            {/* Kontakt */}
            <div className="text-center">
              <h3 className="font-bold text-lg mb-4">Kontakt oss</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p className="font-semibold text-white">Kristina Sandanger</p>
                <p>📞 Telefon: 994 58 575</p>
                <p>✉️ E-post: post@saudail.no</p>
                <p className="pt-2 flex items-center justify-center gap-2">
                  <a 
                    href="https://saudail.no/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Image 
                      src="/cropped-logo.png" 
                      alt="Sauda Idrettslag" 
                      width={24} 
                      height={24}
                      className="object-contain"
                    />
                    Sauda Idrettslag
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-blue-800 pt-6 text-center text-sm text-gray-400">
            <p className="mb-2">© 2024-2025 Sauda Seven Summits. Alle rettar reservert.</p>
            <p className="text-xs text-gray-500 mb-2">v25.12.5</p>
            <Link 
              href="/admin/login" 
              className="text-primary-300 hover:text-primary-200 transition-colors"
            >
              Admin-innlogging
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

