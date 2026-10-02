import { supabase } from "../lib/supabase";

// Server computes prices and locks stock; the client only supplies the
// shipping details. See supabase/migrations/*_cart_checkout_reviews.sql.
export async function placeOrder(shippingAddress, requestId) {
  const { data, error } = await supabase
    .rpc("checkout_order", { p_shipping: shippingAddress, p_request_id: requestId })
    .single();

  if (error) throw error;
  return data; // { order_id, order_number, total_cents }
}
