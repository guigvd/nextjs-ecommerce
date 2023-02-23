import { useContext, useEffect, useState } from "react";
import Footer from "../components/Footer";
import Layout from "../components/Layout";
import { ProductsContext } from "../components/ProductsContext";

const checkout = () => {
  const { selectedProducts, setSelectedProducts } = useContext(ProductsContext);
  const [productsInfos, setProductsInfos] = useState([]);

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const uniqIds = [...new Set(selectedProducts)];
    fetch("/api/products?ids=" + uniqIds.join(","))
      .then((response) => response.json())
      .then((json) => setProductsInfos(json));
  }, [selectedProducts]);

  function moreOfThisProduct(id) {
    setSelectedProducts((prev) => [...prev, id]);
  }

  function lessOfThisProduct(id) {
    const pos = selectedProducts.indexOf(id);

    if (pos !== -1) {
      setSelectedProducts((prev) => {
        return prev.filter((value, index) => index !== pos);
      });
    }
  }

  const deliveryPrice = 5;

  let subtotal = 0;
  if (selectedProducts?.length) {
    for (let id of selectedProducts) {
      const price = productsInfos.find((p) => p._id === id)?.price || 0;
      subtotal += price;
    }
  }

  const total = subtotal + deliveryPrice;

  return (
    <div>
      <Layout>
        {!productsInfos.length && <div>no products in your shopping cart</div>}
        {productsInfos.length && productsInfos.map((productInfo) => {

          const amount = selectedProducts.filter((id) => id === productInfo._id).length;
          if (amount === 0) return;

          return (
            <div className="flex gap-5 mb-5" key={productInfo._id}>
              <div className="bg-blue-100 p-3 rounded-xl shrink-0">
                <img
                  className="w-24 object-cover"
                  src={productInfo.picture}
                  alt={productInfo.name}
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">{productInfo.name}</h3>
                <p className="text-sm leading-4">{productInfo.description}</p>
                <div className="flex mt-2">
                  <div className="grow">${productInfo.price} </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => lessOfThisProduct(productInfo._id)}
                      className="border-2 border-emerald-500 px-2 rounded-lg text-emerald-500 text-bold text-xs"
                    >
                      -
                    </button>
                    <span>
                      {selectedProducts.filter((id) => id === productInfo._id).length}
                    </span>

                    <button
                      onClick={() => moreOfThisProduct(productInfo._id)}
                      className="bg-emerald-500 px-2 rounded-lg text-white text-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )})}

        <form action="/api/checkout" method="POST">
          <div className="border-t border-gray-500 pt-2">
            <input
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-gray-100 w-full rounded-lh px-4 py-2 mb-2"
              type="text"
              placeholder="Street address, number"
            />
            <input
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="bg-gray-100 w-full rounded-lh px-4 py-2 mb-2"
              type="text"
              placeholder="City and postal code"
            />
            <input
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-100 w-full rounded-lh px-4 py-2 mb-2"
              type="text"
              placeholder="Email address"
            />
            <input
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-100 w-full rounded-lh px-4 py-2 mb-2"
              type="text"
              placeholder="Your Name"
            />
          </div>

          <div>
            <div className="flex">
              <h3 className="grow text-gray-500 font-bold">Subtotal:</h3>
              <h3>${subtotal}</h3>
            </div>
            <div className="flex">
              <h3 className="grow text-gray-500 font-bold">Delivery:</h3>
              <h3>${deliveryPrice}</h3>
            </div>
            <div className="flex mt-3 border-t-2 border-dashed border-emerald-500">
              <h3 className="grow text-gray-500 font-bold">Total:</h3>
              <h3>${total}</h3>
            </div>
          </div>

          <input
            type="hidden"
            name="products"
            value={selectedProducts ? selectedProducts.join(',') : ''}
          />
          <button
            type="submit"
            className="bg-emerald-500 px-5 text-white w-full rounded-lg font-bold my-4 py-2 shadow-emerald-200 shadow-lg"
          >
            Pay ${total}
          </button>
        </form>
      </Layout>
    </div>
  );
};

export default checkout;
