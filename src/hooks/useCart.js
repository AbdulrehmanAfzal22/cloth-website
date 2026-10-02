import {getCart,removeCartItem,updateCartItem} from '../services/cart';
import {useQuery} from './useQuery';

export function useCart(userId){
  const query=useQuery(()=>getCart(userId),[userId]);
  return {
    ...query,
    items:query.data||[],
    setQuantity:async(variantId,quantity)=>{await updateCartItem(variantId,quantity);await query.refresh();},
    remove:async variantId=>{await removeCartItem(variantId);await query.refresh();},
  };
}