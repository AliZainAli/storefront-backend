# Important Notes:

- there is a folder postman_data which contains postman collection file which you can import and use directly.  
- create environment in postman with a token variable (I import this variable in required requests).  
- All data keys supplied in post requests are the same as tables column names.  
## API Endpoints  

#### Products  

- /products  [GET]       (index)
- /products/id  [GET]    (show)
- /products  [POST]      (Create) (requires Admin Token)
- /products/id  [PATCH]   (update) (requires Admin Token)
- /products/id  [DELETE]   (delete) (requires Admin Token)

#### Users  

- /users/createFirstAdmin   create admin user to user in required routes (pass all parameters of user database parameters with role as admin)
- /users  [GET]      (index) (requires Admin Token)  
- /users/id  [GET]   (show) (token required)  
- /users  [POST]     (Create) (requires Admin Token)
- /users/register   (Create) (user role is always user)  
- /users/login      (login by username and password)  (generate token)  
#### Orders  

- /orders   [POST]
- /orders   [GET]   all orders of authenticated user (requires User Token)
- /orders/all   [GET]  all orders in the system (requires Admin Token)
- /orders/id/current  [GET]   Current Active Order by user (requires User Token)  
- [OPTIONAL] Completed Orders by user (args: user id)[token required] /orders/completed [GET] 
- /orders/id/products   [POST]   add product to order {productId: productId, quantity: number}
- /order/id   [GET]  get order status (requires User Token)
- /order/id   [PATCH]  change order status (requires Admin Token) {status: "Active"} or complete
- /order/id   [DELETE]  delete order (requires Admin Token)

## Data Shapes  

#### Product  

- id  
- name  
- price  
- [OPTIONAL] quantity (has default value)
- [OPTIONAL] category   (exist and can be null)  

#### User  

- id  
- username    (for authentication)  
- firstname  
- lastname  
- password  
- role (admin, user)  

#### Orders

- id  
- id of each product in the order   (in order_products table)  
- quantity of each product in the order   (in order_products table)  
- user_id  
- status of order (active or complete)  

#### order_products

- id  
- quantity  
- order_id  
- product_id  
