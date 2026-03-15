import React from 'react'
import { createRoot } from 'react-dom/client'


// Data: items and prices from the menu image
const ITEMS = [
  { id: 'pal', name: 'பால்', price: 12 },
  { id: 'inji_tea', name: 'இஞ்சி டீ', price: 12 },
  { id: 'nattu_tea', name: 'நாட்டு சக்கரை டீ', price: 13 },
  { id: 'coffee', name: 'காபி', price: 12 },
  { id: 'nattu_coffee', name: 'நாட்டு சக்கரை காபி', price: 14 },
  { id: 'karupatti_coffee', name: 'கருப்பட்டி காபி', price: 20 },
  { id: 'kadunga_coffee', name: 'கடுங்காபி', price: 10 },
  { id: 'paruppu_vadai', name: 'பருப்பு வட', price: 8 },
  { id: 'ulunthu_vadai', name: 'உளுந்து வடை', price: 8 },
  { id: 'kara_vadai', name: 'காரா வடை', price: 8 },
  { id: 'vaazha_vadai', name: 'வாழைப்பூ வடை', price: 8 },
  { id: 'vengaya_vadai', name: 'வெங்காய வடை', price: 10 },
  { id: 'bajji', name: 'பஜ்ஜி', price: 8 },
  { id: 'susi', name: 'சூசியம்', price: 10 },
  { id: 'samosa', name: 'சமோசா', price: 15 },
  { id: 'idli', name: 'இட்லி', price: 10 },
  { id: 'poori_set', name: 'பூரி (செட்)', price: 35 },
  { id: 'appam_set', name: 'ஆப்பம் (செட்)', price: 25 },
  { id: 'pongal', name: 'பொங்கல்', price: 40 },
  { id: 'kal_dosa', name: 'கல் தோசை', price: 20 },
  { id: 'podi_kal_dosa', name: 'பொடி கல் தோசை', price: 40 },
  { id: 'onion_uthappam', name: 'ஆனியன் ஊத்தப்பம்', price: 40 },
  { id: 'nei_uthappam', name: 'நெய் ஊத்தப்பம்', price: 40 },
  { id: 'onion_podi_uthappam', name: 'ஆனியன் பொடி ஊத்தப்பம்', price: 50 },
  { id: 'roast', name: 'ரோஸ்ட்', price: 40 },
  { id: 'nei_roast', name: 'நெய் ரோஸ்ட்', price: 60 },
  { id: 'onion_roast', name: 'ஆனியன் ரோஸ்ட்', price: 60 },
  { id: 'masala_roast', name: 'மசாலா ரோஸ்ட்', price: 60 },
  { id: 'podi_roast', name: 'பொடி ரோஸ்ட்', price: 60 },
  { id: 'onion_podi_roast', name: 'ஆனியன் பொடி ரோஸ்ட்', price: 70 },
  { id: 'chapati_set', name: 'சப்பாத்தி (செட்)', price: 30 },
  { id: 'kothumai_dosa', name: 'கோதுமை தோசை', price: 25 },
  { id: 'thengai_paal', name: 'தேன்காய் பால்', price: 20 }
]


function formatINR(n){ return n.toFixed(0) + ' ₹' }


function App(){
  const [cart, setCart] = React.useState({})
  const [customer, setCustomer] = React.useState({ name: '', phone: '' })
  const [sending, setSending] = React.useState(false)
  const addQty = (id, delta) => {
    setCart(prev => {
      const cur = prev[id] || 0
      const next = Math.max(0, cur + delta)
      return {...prev, [id]: next}
    })
  }


  const setQty = (id, v) => {
    const q = Math.max(0, parseInt(v) || 0)
    setCart(prev => ({...prev, [id]: q}))
  }


  const subtotal = Object.entries(cart).reduce((sum,[id,q])=>{
    const item = ITEMS.find(i=>i.id===id)
    return sum + (item ? item.price * q : 0)
  },0)


  const handleSubmit = async () => {
    if(subtotal === 0) return alert('ஒரு பொருளை தேர்ந்தெடுக்கவும்')
    if(!customer.name || !customer.phone) return alert('பெயரும் தொலைபேசி எண்ணும் அளிக்கவும்')


    const order = {
      customer, cart, subtotal, timestamp: Date.now()
    }
    setSending(true)
    try{
      const res = await fetch('/backend/order_api.php', {
        method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(order)
      })
      const data = await res.json()
      if(data.success){
        alert('Order saved. Order ID: '+data.order_id)
        // offer download PDF
        if(data.pdf_url) window.open(data.pdf_url, '_blank')
        setCart({});
      } else alert('Save failed')
    }catch(e){
      console.error(e); alert('Network error')
    }
    setSending(false)
  }


  return (
    <div className="max-w-5xl mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">காரிங்ஸ் - Order Page</h1>
        <div className="text-right">
          <div className="text-sm">Phone / WhatsApp: 85089 89504</div>
        </div>
      </header>


      <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="md:col-span-2 bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">Menu</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ITEMS.map(item=> (
              <div key={item.id} className="flex items-center justify-between border p-2 rounded">
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-600">{formatINR(item.price)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={()=>addQty(item.id,-1)} className="px-2 py-1 rounded bg-gray-200">-</button>
                  <input type="number" className="w-16 text-center border rounded p-1" value={cart[item.id]||0} onChange={(e)=>setQty(item.id,e.target.value)} />
                  <button onClick={()=>addQty(item.id,1)} className="px-2 py-1 rounded bg-gray-200">+</button>
                </div>
              </div>
            ))}
          </div>
        </section>


        <aside className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Order Summary</h3>
          <div className="space-y-2 max-h-80 overflow-auto">
            {Object.entries(cart).filter(([,q])=>q>0).map(([id,q])=>{
              const it = ITEMS.find(i=>i.id===id)
              return (
                <div key={id} className="flex justify-between">
                  <div>{it.name} x {q}</div>
                  <div>{formatINR(it.price * q)}</div>
                </div>
              )
            })}
          </div>
          <hr className="my-3" />
          <div className="flex justify-between font-bold mb-3"> <div>Subtotal</div> <div>{formatINR(subtotal)}</div> </div>


          <div className="space-y-2">
            <input className="w-full border rounded p-2" placeholder="Customer name" value={customer.name} onChange={e=>setCustomer({...customer,name:e.target.value})} />
            <input className="w-full border rounded p-2" placeholder="Phone" value={customer.phone} onChange={e=>setCustomer({...customer,phone:e.target.value})} />
            <button onClick={handleSubmit} disabled={sending} className="w-full bg-green-600 text-white p-2 rounded">{sending? 'Sending...' : 'Place Order & Generate PDF'}</button>
          </div>


          <div className="mt-4 text-sm text-gray-600">Tip: Click Place Order to save to server and get a printable PDF receipt.</div>
        </aside>
      </main>


      <footer className="mt-6 text-center text-sm text-gray-500">Designed for mobile & desktop.</footer>
    </div>
  )
}


// Mount app
const root = createRoot(document.getElementById('root'))
root.render(<App />)
