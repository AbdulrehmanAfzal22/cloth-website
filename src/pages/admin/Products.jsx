import {useState} from 'react';
import {Link} from 'react-router-dom';
import {Plus,Trash2} from 'lucide-react';
import {useProducts} from '../../hooks/useProducts';
import {deleteProduct} from '../../services/catalog';
import {Loading,Empty,ErrorState} from '../../components/Feedback';
import {money,imageUrl} from '../../lib/supabase';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';

export default function Products({isAccessory=null,showHeading=true}){
  const query=useProducts({admin:true,isAccessory});
  const [search,setSearch]=useState('');
  const [status,setStatus]=useState('');
  const [sort,setSort]=useState({key:'product',direction:'asc'});
  const [busy,setBusy]=useState(null);
  const [actionError,setActionError]=useState('');

  async function remove(product){
    if(!window.confirm(`Delete "${product.name}" from the storefront? It will be archived; order history and related records will be preserved.`))return;
    setBusy(product.id);setActionError('');
    try{await deleteProduct(product.id);await query.refresh();}
    catch(error){setActionError(error.message);}
    finally{setBusy(null);}
  }

  const rows=[...(query.data||[])].filter(product=>(!search||`${product.name} ${product.categories?.name||''}`.toLowerCase().includes(search.toLowerCase()))&&(!status||product.status===status)).sort((a,b)=>{
    const direction=sort.direction==='asc'?1:-1;
    const stock=product=>product.product_variants.filter(variant=>variant.active).reduce((sum,variant)=>sum+variant.stock,0);
    const left=sort.key==='price'?a.price_cents:sort.key==='stock'?stock(a):sort.key==='status'?a.status:a.name.toLowerCase();
    const right=sort.key==='price'?b.price_cents:sort.key==='stock'?stock(b):sort.key==='status'?b.status:b.name.toLowerCase();
    return (left>right?1:left<right?-1:0)*direction;
  });

  function sortBy(key){setSort(current=>({key,direction:current.key===key&&current.direction==='asc'?'desc':'asc'}));}

  const columns=[
    {key:'product',label:'Product',sortable:true,render:product=><div className="table-product">{product.product_images?.[0]&&<img src={imageUrl(product.product_images[0].path)} alt="" loading="lazy"/>}<div><b>{product.name}</b><small>{product.categories?.name||'Uncategorised'}</small></div></div>},
    {key:'price',label:'Price',sortable:true,numeric:true,render:product=>money(product.price_cents)},
    {key:'stock',label:'Inventory',sortable:true,render:product=>`${product.product_variants.filter(variant=>variant.active).reduce((sum,variant)=>sum+variant.stock,0)} units`},
    {key:'status',label:'Status',sortable:true,render:product=><StatusBadge status={product.status}/>},
    {key:'actions',label:'Actions',render:product=><div className="admin-table-actions"><Link to={`/admin/products/${product.id}/edit${isAccessory===null?'':`?group=${isAccessory?'accessories':'collections'}`}`}>Edit</Link><button className="text-button" type="button" disabled={busy===product.id||product.status==='archived'} onClick={()=>remove(product)} aria-label={`Archive ${product.name}`} title={product.status==='archived'?'Already archived':'Archive and remove from the storefront'}>{busy===product.id?'Archiving…':<><Trash2 size={14}/><span>Archive</span></>}</button></div>},
  ];

  return <>
    {showHeading&&<div className="section-heading admin-page-heading"><div><p className="eyebrow">CATALOG</p><h1>{isAccessory===null?'All Products':isAccessory?'Accessories products':'Collections products'}</h1><p className="admin-page-intro">Manage pieces, pricing, availability and publication status.</p></div><Link to={`/admin/products/create${isAccessory===null?'':`?group=${isAccessory?'accessories':'collections'}`}`} className="button"><Plus size={15}/> Add product</Link></div>}
    <div className="admin-list-toolbar"><label className="admin-search-field"><span className="visually-hidden">Search products</span><input type="search" placeholder="Search product or category" aria-label="Search products" value={search} onChange={event=>setSearch(event.target.value)}/></label><label className="admin-select-field"><span>Status</span><select value={status} onChange={event=>setStatus(event.target.value)}><option value="">All statuses</option><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select></label><span className="admin-list-toolbar__count">{rows.length} {rows.length===1?'product':'products'}</span></div>
    {actionError&&<p className="error" role="alert">{actionError}</p>}
    {query.loading&&!query.data?<Loading label="Loading products…"/>:query.error?<ErrorState error={query.error} retry={query.refresh}/>:!query.data?.length?<Empty title="Your first piece starts here." text="Create a product, add its photographs and variants, then publish it to the shop." link={`/admin/products/create${isAccessory===null?'':`?group=${isAccessory?'accessories':'collections'}`}`} action="Add your first product"/>:<DataTable caption="Product catalog" columns={columns} rows={rows} rowKey={product=>product.id} sortKey={sort.key} sortDirection={sort.direction} onSort={sortBy} empty="No products match these filters."/>}
  </>;
}
