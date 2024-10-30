\lo_import (path)


\lo_import 'C:\\Sela\\final_project\\website\\client\\src\\images\\lollypop.png'
-- Suppose this returns an OID of 12345

-- Update the product with the imported image OID
UPDATE Products
SET image = lo_get(12345)
WHERE product_name = 'Lollypop';

\lo_import 'C:\\Sela\\final_project\\website\\client\\src\\assets\\peachy2.jpg'




I want to implement a filter based on selected category. since I want to reuse the code I'm considering
creating yet another element that only fetches the products (aka- the current ProductList), then from productList and from selectCategoryBTN 