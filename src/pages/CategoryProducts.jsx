import {Link,Navigate,useParams} from 'react-router-dom';
import {useQuery} from '../hooks/useQuery';
import {getActiveCategories,getProductsByCategory} from '../services/catalog';
import {ErrorState,Empty,Loading} from '../components/Feedback';
import ProductGrid from '../components/commerce/ProductGrid';
import {usePageMetadata} from '../hooks/usePageMetadata';
import {categoriesForSection,findCategoryByRoute} from '../lib/categoryMatching';
import {collectionImageAlt,collectionImage} from '../lib/collectionImage';
import {motion,useReducedMotion} from 'framer-motion';

export default function CategoryProducts({section='collections'}){
  const reducedMotion=useReducedMotion();
  const isAccessoryRoute=section==='accessories';
  const {category:routeCategory=''}=useParams();
  const categoriesQuery=useQuery(getActiveCategories);
  const category=findCategoryByRoute(categoriesQuery.data||[],routeCategory);
  const productsQuery=useQuery(()=>category?getProductsByCategory(category.id):Promise.resolve([]),[category?.id]);
  const title=category?.name||routeCategory.replace(/-/g,' ');
  usePageMetadata({title:`${title} ${isAccessoryRoute?'accessories':'collection'}`,description:`Explore ${title} from Maison Élan.`,noindex:Boolean(categoriesQuery.data&&!category)});

  if(categoriesQuery.loading&&!categoriesQuery.data)return <Loading label="Opening this collection…"/>;
  if(categoriesQuery.error)return <ErrorState error={categoriesQuery.error} retry={categoriesQuery.refresh}/>;
  if(!category)return <Empty title="Collection not found" text="This collection may have moved. Browse all of Maison Élan instead." link={isAccessoryRoute?'/accessories':'/collections'} action={`Explore all ${isAccessoryRoute?'accessories':'collections'}`}/>;
  if(category.is_accessory!==isAccessoryRoute)return <Navigate to={`${category.is_accessory?'/accessories':'/collections'}/${encodeURIComponent(category.slug)}`} replace/>;
  if(productsQuery.loading&&!productsQuery.data)return <Loading label={`Discovering ${category.name}…`}/>;
  if(productsQuery.error)return <ErrorState error={productsQuery.error} retry={productsQuery.refresh}/>;

  const products=productsQuery.data||[];
  const categoryIndex=categoriesForSection(categoriesQuery.data,!isAccessoryRoute).findIndex(item=>item.slug===category.slug);
  const firstProductImage=products.flatMap(product=>product.product_images||[]).sort((left,right)=>(left.position||0)-(right.position||0))[0]||null;
  const heroImage=collectionImage(category,firstProductImage,Math.max(categoryIndex,0));
  const heroAlt=collectionImageAlt(category,firstProductImage);
  return <section className="page category-collection-page">
    <p className="eyebrow"><Link to={isAccessoryRoute?'/accessories':'/collections'}>{isAccessoryRoute?'Accessories':'Collections'}</Link> / {category.name}</p>
    <motion.div className="category-collection-page__hero" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:reducedMotion?0:.45,ease:[.22,1,.36,1]}}>
      <motion.img src={heroImage} alt={heroAlt} layoutId={reducedMotion?undefined:`collection-${category.slug}`} transition={{duration:reducedMotion?0:1,ease:[.22,1,.36,1]}}/>
      <span aria-hidden="true"/>
    </motion.div>
    <header className="category-collection-page__heading"><h1>{category.name}</h1><p>{products.length} {products.length===1?'piece':'pieces'}</p></header>
    {products.length?<ProductGrid products={products}/>:<Empty variant="premium" className="category-collection-page__empty" title="No pieces available in this collection yet." text="Explore the full collection and discover another point of view." link={isAccessoryRoute?'/accessories':'/collections'} action={`Explore all ${isAccessoryRoute?'accessories':'collections'}`}/>}
  </section>;
}