# Important Notes:

- there is a folder postman_data which contains postman collection file which you can import and use directly.  
- create environment in postman with a token variable (I import this variable in required requests).  
- All data keys supplied in post requests are the same as tables column names.  
## API Endpoints  

#### Products  

- /products [GET]       (index)
- /products/id [GET]    (show)
- /products [POST]      (Create) (requires Admin Token)
- /products/id [PATCH]   (update) (requires Admin Token)
- /products/id [DELETE]   (delete) (requires Admin Token)

#### Users  

- /users [GET]      (index) (requires Admin Token)  
- /users/id [GET]   (show) (token required)  
- /users [POST]     (Create) (requires Admin Token)  
- /users/register   (Create) (user role is always user)  
- /users/login      (login by username and password)  (generate token)  
#### Orders  

- /orders/current [GET]   Current Order by user (requires Admin Token)  
- [OPTIONAL] Completed Orders by user (args: user id)[token required] /orders/completed [GET]  

## Data Shapes  

#### Product  

- id  
- name  
- price  
- [OPTIONAL] category   (exist and can be null)  

#### User  

- id  
- username    (for authentication)  
- firstName  
- lastName  
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
