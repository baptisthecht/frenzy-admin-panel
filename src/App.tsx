import { useEffect, useState } from "react"
import Order from "./components/order"
import CompanyData from '../data.json'
import axios from "axios"

function App() {

  const [screen, setScreen] = useState(1)
  const [orders, setOrders] = useState([])
  const [newOrders, setNewOrders] = useState([])

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get("http://localhost:3000/api/orders").then(res => {
      console.log(res.data)
      setOrders(res.data)
      const new_orders = res.data.filter((order: any) => order.end === false && order.cancelled === false)
      setNewOrders(new_orders)
    })
    }, 500);
    return () => clearInterval(interval);
    
  }, [])

  return (
    <div className="flex flex-col relative">
      <div className="fixed w-full">
        <div className="w-full h-10 flex items-center justify-center bg-indigo-600 text-white font-semibold uppercase text-xl">GESTION DES COMMANDES DE {CompanyData.name}</div>
        <div className="flex cursor-pointer">
          <div onClick={() => setScreen(1)} className={`text-lg font-semibold h-12 w-full flex items-center justify-center border-b-2 border-indigo-600 ${screen === 1 ? "bg-gray-200" : "bg-gray-100"}`}>Nouvelles commandes</div>
          <div onClick={() => setScreen(2)} className={`text-lg font-semibold h-12 w-full flex items-center justify-center border-b-2 border-indigo-600 ${screen === 2 ? "bg-gray-200" : "bg-gray-100"}`}>Toutes les commandes</div>
        </div>
      </div>
      <div className={`mt-24 flex-col p-3 gap-3 ${screen === 2 ? "flex" : "hidden"}`}>
        {orders.reverse().map((order: any) => (
          <Order order={order} />
        ))}  
      </div>
      <div className={`mt-24 flex-col p-3 gap-3 ${screen === 1 ? "flex" : "hidden"}`}>
        {newOrders.map((order: any) => (
          <Order order={order} />
        ))}  
        {newOrders.length === 0 && <div className="w-full h-96 px-5 py-3 flex flex-col items-center justify-center text-2xl gap-3">Aucune nouvelle commande</div>}
      </div>
    </div>
  )
}

export default App
