import { FooterIcon } from "flowbite-react";
import {BsWhatsapp, BsInstagram, BsEnvelope} from "react-icons/bs";

export default function CallToAction() {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto p-10 bg-gradient-to-r  to-red-500 text-gray-700 rounded-tl-3xl rounded-br-3xl shadow-xl">
<div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-600 dark:text-white lg:text-5xl drop-shadow-lg">
          Selamat Datang di Jurnal Resonansi
        </h1>
        <p className="mt-4 text-sm sm:text-lg text-gray-600 dark:text-white leading-relaxed">
          Temukan berbagai artikel dan informasi terkini.
        </p>
<div className="mt-6 flex justify-center space-x-4">
<FooterIcon 
  href="https://www.instagram.com/pa_gmni_purbalingga/" 
  icon={BsInstagram} 
  className="text-xl hover:text-gray-300 transition" 
/>
<FooterIcon 
  href="https://wa.me/6285791889626" 
  icon={BsWhatsapp} 
  className="text-xl hover:text-gray-300 transition" 
/>
<FooterIcon 
  href="mailto:resonansi2106@gmail.com" 
  icon={BsEnvelope} 
  className="text-xl hover:text-gray-300 transition" 
/>
        </div>
      </div>
    </div>
  );
}