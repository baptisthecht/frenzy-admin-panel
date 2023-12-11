import { useState } from "react"
import Item from "./Item"
import axios from "axios"

export default function Order(props: any) {

  const [cancelButton, setCancelButton] = useState(false)

    const setAsPaid = async () => {
        try {
            await axios.post(`http://localhost:3000/api/setaspaid`, {
                _id: props.order._id,
                API_KEY: import.meta.env.VITE_API_KEY
            })
        } catch (error) {
            console.log(error)
        }
    }

    const setAsDelivered = async () => {
        try {
            await axios.post(`http://localhost:3000/api/setasdelivered`, {
                _id: props.order._id,
                API_KEY: import.meta.env.VITE_API_KEY
            })
        } catch (error) {
            console.log(error)
        }
    }

const order = props.order
const date = new Date(order.created_at)
const options: any = { day: "2-digit", month: "2-digit", year: 'numeric', hour: "2-digit", minute: "2-digit" };
const formattedDate = new Intl.DateTimeFormat('fr-FR', options).format(date)
const diff = Math.abs(new Date().getTime() - date.getTime());
const minutes = Math.floor((diff/1000)/60)
const secondes = Math.floor((diff/1000)%60)

const cancelOrder = async () => {
    try {
        await axios.post(`http://localhost:3000/api/setascancelled`, {
            _id: order._id,
            API_KEY: import.meta.env.VITE_API_KEY
        })
    } catch (error) {
        console.log(error)
    }
}

const changeToCancelButton = async () => {
    setCancelButton(true)
    setTimeout(() => {
        setCancelButton(false)
    }, 5000);
}

  return (
    <div className="bg-gray-100 rounded-xl w-full h-auto px-5 py-3 flex flex-col gap-3">
    <div className="flex justify-between">
      <div className="flex gap-3">
        <h1 className="text-lg font-semibold">Commande {order.command_number < 10 ? "0" : ""}{order.command_number < 100 ? "0" : ""}{order.command_number}</h1>
        <h1 className="text-lg font-semibold">·</h1>
        <h1 className="text-lg font-semibold">{order.whereToEat} {order.whereToEat === "Sur place" ? "("+order.eatHereChoice.toLowerCase()+")" : ""}</h1>
      </div>
      <div className="flex gap-5">
      <h1 className={`text-lg font-semibold`}>{order.end || order.cancelled ? formattedDate : "Il y a " + minutes+ ":"}{!order.end && secondes < 10 ? "0" + secondes :""}{!order.end && !order.cancelled && secondes >= 10 ? secondes : "" }</h1>
      <h1 className="text-lg font-semibold"> · </h1>
        {!order.end && !order.cancelled && <h1 className={`text-lg font-semibold  ${order.paid ? "text-indigo-600" : "text-red-600"}`}>{order.paid ? "Reglée" : "À encaisser"}{order.paid && order.paidOnBorne ? " à la borne" : ""}{order.paid && !order.paidOnBorne ? " en caisse" : ""}</h1>}
        {order.end && <h1 className={`text-lg font-semibold text-green-600`}>Livrée</h1>}
        {order.cancelled && <h1 className={`text-lg font-semibold text-red-600`}>Annulée</h1>}
      </div>
    </div>
    <div>
        {order.items.map((item: any) => (
            <Item item={item} />
        ))}
    </div>
    <div className="flex justify-between items-center">
      <h1 className="text-lg font-semibold">{order.total.toFixed(2)} €</h1>

      <div className="flex gap-5">
      {order.end && <h1 className={`text-lg font-semibold text-indigo-600`}>Commande réglée {order.paid && order.paidOnBorne ? " à la borne" : ""}{order.paid && !order.paidOnBorne ? " en caisse" : ""}</h1>}
      {!order.end && !order.cancelled && !cancelButton && <button onClick={() => changeToCancelButton()} className="rounded-xl bg-gray-200 px-3 py-2 text-red-600">Annuler cette commande</button>}
      {cancelButton && <button onClick={() => cancelOrder()} className="rounded-xl bg-red-600 px-3 py-2 text-white">Confirmer l'annulation</button>}
      {!order.paid && !order.cancelled && <button onClick={() => setAsPaid()} className="rounded-xl bg-gray-200 px-3 py-2">Marquer comme reglée</button>}
      {!order.end && !order.cancelled && order.paid && <button onClick={() => setAsDelivered()} className="rounded-xl bg-gray-200 px-3 py-2">Marquer comme livrée</button>}
      </div>
    </div>
  </div>
  )
}
