export default function Item(props: any) {

  const item = props.item

  return (
    <>
      {item.quantity > 0 && <div className="flex gap-3 font-medium"><span>{item.quantity}</span><span>·</span><span>{item.product.name}</span></div>}
      <div className="flex flex-col pl-14">
      {item.product.variants && item.product.variants.map((variant: any) => (
        variant.choice !== "" ? <div>{variant.choice}</div> : ""
      ))}
      </div>
    </>
  )
}
