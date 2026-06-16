import React, { useState, useEffect } from 'react';

export default function QuoteCalculator({ lang = 'es' }) {
  // =========================================================================
  // CONFIGURACIÓN: Cambia este número por el de Quality Freight (con código de país)
  // Ejemplo para Venezuela: 584241234567. No incluir "+" ni espacios.
  // =========================================================================
  const WHATSAPP_NUMBER = "584241234567"; 

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    origin: '', destination: '', type: 'aereo',
    length: 0, width: 0, height: 0, weight: 0,
  });

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setStep(1);
    };
    window.addEventListener('open-calculator', handleOpen);
    return () => window.removeEventListener('open-calculator', handleOpen);
  }, []);

  if (!isOpen) return null;

  const t = {
    es: {
      title: "Calculadora de Envío Express",
      origin: "Origen", dest: "Destino", typeLabel: "Modo de Transporte",
      typeAir: "✈️ Carga Aérea Express",
      typeOcean: "🚢 Carga Marítima Consolidada",
      next: "Siguiente", back: "Atrás", calc: "Calcular Costo",
      length: "Largo (cm)", width: "Ancho (cm)", height: "Alto (cm)", weight: "Peso Real (kg)",
      volWeight: "Peso Volumétrico", chargeWeight: "Peso Cobrable", totalEst: "Monto Estimado",
      restart: "Reiniciar",
      submitBtn: "🚀 Solicitar Cotización Formal"
    },
    en: {
      title: "Express Shipping Calculator",
      origin: "Origin", dest: "Destination", typeLabel: "Transportation Mode",
      typeAir: "✈️ Express Air Freight",
      typeOcean: "🚢 Consolidated Ocean Freight",
      next: "Next", back: "Back", calc: "Calculate Cost",
      length: "Length (cm)", width: "Width (cm)", height: "Height (cm)", weight: "Real Weight (kg)",
      volWeight: "Volumetric Weight", chargeWeight: "Chargeable Weight", totalEst: "Estimated Total",
      restart: "Reset",
      submitBtn: "🚀 Request Formal Quote"
    }
  }[lang];

  // Lógica matemática de conversión y tarifas
  const volWeight = ((formData.length * formData.width * formData.height) / 5000);
  const chargeableWeight = Math.max(formData.weight, volWeight);
  const totalAmount = chargeableWeight * (formData.type === 'aereo' ? 6.50 : 3.20);

  // FUNCIÓN PARA GENERAR EL MENSAJE DINÁMICO DE WHATSAPP CON SOPORTE BILINGÜE
  const getWhatsAppLink = () => {
    const modeText = formData.type === 'aereo' ? t.typeAir : t.typeOcean;

    const messageEs = `Hola Quality Freight Service. Deseo solicitar una cotización formal con los siguientes datos calculados en la web:\n\n` +
      `📍 *Origen:* ${formData.origin}\n` +
      `🏁 *Destino:* ${formData.destination}\n` +
      `📦 *Modo:* ${modeText}\n` +
      `衡量 *Medidas:* ${formData.length} x ${formData.width} x ${formData.height} cm\n` +
      `⚖️ *Peso Real:* ${formData.weight.toFixed(2)} kg\n` +
      `📊 *Peso Volumétrico:* ${volWeight.toFixed(2)} kg\n` +
      `⭐ *Peso Cobrable:* ${chargeableWeight.toFixed(2)} kg\n` +
      `💰 *Monto Estimado:* $${totalAmount.toFixed(2)} USD\n\n` +
      `Quedo atento a su pronta respuesta.`;

    const messageEn = `Hello Quality Freight Service. I would like to request a formal quote with the following data calculated on the website:\n\n` +
      `📍 *Origin:* ${formData.origin}\n` +
      `🏁 *Destination:* ${formData.destination}\n` +
      `📦 *Mode:* ${modeText}\n` +
      `衡量 *Dimensions:* ${formData.length} x ${formData.width} x ${formData.height} cm\n` +
      `⚖️ *Real Weight:* ${formData.weight.toFixed(2)} kg\n` +
      `📊 *Volumetric Weight:* ${volWeight.toFixed(2)} kg\n` +
      `⭐ *Chargeable Weight:* ${chargeableWeight.toFixed(2)} kg\n` +
      `💰 *Estimated Total:* $${totalAmount.toFixed(2)} USD\n\n` +
      `I look forward to your reply.`;

    const selectedMessage = lang === 'es' ? messageEs : messageEn;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(selectedMessage)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 max-w-xl w-full relative text-slate-800 animate-in fade-in zoom-in-95 duration-200">
        
        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-xl p-2 cursor-pointer">✕</button>

        <div className="flex justify-between mb-6 pr-6">
          {[1, 2, 3].map((num) => (
            <div key={num} className={`h-1.5 flex-1 mx-1 rounded-full ${step >= num ? 'bg-brand-orange' : 'bg-slate-100'}`} />
          ))}
        </div>

        <h2 className="text-xl font-black text-brand-blue-dark mb-6 text-center">{t.title}</h2>

        {/* PASO 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase mb-1 text-slate-600">{t.origin}</label>
              <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="Ej: Miami, USA" value={formData.origin} onChange={(e) => setFormData({...formData, origin: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-1 text-slate-600">{t.dest}</label>
              <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="Ej: Caracas, Venezuela" value={formData.destination} onChange={(e) => setFormData({...formData, destination: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-1 text-slate-600">{t.typeLabel}</label>
              <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                <option value="aereo">{t.typeAir}</option>
                <option value="maritimo">{t.typeOcean}</option>
              </select>
            </div>
            <button onClick={() => setStep(2)} disabled={!formData.origin || !formData.destination} className="w-full bg-brand-blue-dark text-white font-bold py-3.5 rounded-xl disabled:opacity-50 mt-2 cursor-pointer">
              {t.next}
            </button>
          </div>
        )}

        {/* PASO 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">{t.length}</label>
                <input type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-bold" onChange={(e) => setFormData({...formData, length: parseFloat(e.target.value) || 0})} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">{t.width}</label>
                <input type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-bold" onChange={(e) => setFormData({...formData, width: parseFloat(e.target.value) || 0})} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">{t.height}</label>
                <input type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-bold" onChange={(e) => setFormData({...formData, height: parseFloat(e.target.value) || 0})} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-1 text-slate-600">{t.weight}</label>
              <input type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" placeholder="0.00" onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value) || 0})} />
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setStep(1)} className="flex-1 bg-slate-100 py-3.5 rounded-xl font-bold cursor-pointer">{t.back}</button>
              <button onClick={() => setStep(3)} className="flex-1 bg-brand-orange text-white py-3.5 rounded-xl font-bold cursor-pointer">{t.calc}</button>
            </div>
          </div>
        )}

        {/* PASO 3 */}
        {step === 3 && (
          <div className="text-center space-y-4">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold uppercase text-slate-500 border-b pb-2">
                <div>{t.volWeight}: <span className="text-slate-800 block text-xs font-black">{volWeight.toFixed(2)} kg</span></div>
                <div>{t.chargeWeight}: <span className="text-slate-800 block text-xs font-black">{chargeableWeight.toFixed(2)} kg</span></div>
              </div>
              <div>
                <p className="text-slate-500 text-[10px] uppercase font-bold mb-0.5">{t.totalEst}</p>
                <span className="text-4xl font-black text-green-600">${totalAmount.toFixed(2)} <span className="text-sm text-slate-500">USD</span></span>
              </div>
            </div>
            
            {/* ENLACE DINÁMICO A WHATSAPP COMPORTÁNDOSE COMO BOTÓN VERDE */}
            <a 
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-colors text-center block cursor-pointer"
            >
              {t.submitBtn}
            </a>

            <button onClick={() => setStep(1)} className="w-full text-brand-blue-light font-bold text-xs hover:underline cursor-pointer">
              {t.restart}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}