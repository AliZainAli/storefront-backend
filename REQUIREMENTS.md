# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index 
- Show (args: product id)
- Create (args: Product)[token required]
- [OPTIONAL] Top 5 most popular products 
- [OPTIONAL] Products by category (args: product category)

#### Users
- Index [token required]
- Show (args: id)[token required]
- Create (args: User)[token required]

#### Orders
- Current Order by user (args: user id)[token required]
- [OPTIONAL] Completed Orders by user (args: user id)[token required]

## Data Shapes
#### Product
-  id
- name     -> integer
- price    -> integer
- quantity -> integer
- [OPTIONAL] category -> string

#### User  

- id  
- username  -> string
- firstname -> string  
- lastname  -> string  
- password  -> string  
- role      -> (admin, user)  

#### Orders

- id  
- id of each product in the order   (in order_products table)  
- quantity of each product in the order   (in order_products table)  
- user_id  
- status of order (active or complete)  

#### order_products

- id  
- quantity    -> integer  
- order_id    -> integer    
- product_id  -> integer    

