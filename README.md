# Cafetaria App API

## Introduction

Hi, **I'm Muhammad Farhan Hamidie**.

And I'm a Junior Web Developer. You can check out my [portfolio](https://muhfarhan.vercel.app) or my [linkedin](https://www.linkedin.com/in/muhammad-farhan-18bb1b235/).

I'm currently applying for a Beck-end Engineer position at PT GAMATECHA SOLUSI NUSANTARA.

## Overview

This project is an API for Cafetaria Application built with Express.js, TypeScript, and MySQL. 
The application allows admins to manage cafetaria data.

## Features

- **Authentication**: JWT authentication, multirole based
- **Authorization**: superadmin, owner, manager role for middleware
- **CRUD**: Create, Read, Update, Delete Cafetaria and menu data.

## Installation

To get started with this project locally, follow these steps:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/muhammadfarhan19/cafetaria-app.git
   cd cafetaria-app
   ```

2. **Install Dependencies**

   ```bash
   yarn install
   ```

3. **Create .env file**

   ```bash
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=root
   DB_NAME=cafetaria-app
   PORT=8000
   ```

4. **Run migration script**

   ```bash
   yarn migrate
   ```

5. **Run Development**

   ```bash
   yarn dev
   ```

6. **Localhost**

   ```bash
   Server is running at http://localhost:8000/api/v1/
   ```

## Routes

1. **Base**
   | Method | Route | Description | Authorization |
   | ------ | -------------------------- | --------------------------------- | ------------- |
   | GET | `/` | Base route | `none` |

2. **Authentication**
   | Method | Route | Description | Authorization | Parameters | Note
   | ------ | -------------------------- | -----| --------------------------------- | ------------- | --- |
   | POST | `/auth/register` | new-user | `none`| req.body: `fullname`, `username`, `password`, `role?`| role enum (`superadmin`, `owner`, `manager`). Default role is `null` for user |
   | POST | `/auth/login` | login | `none`| req.body: `username`, `password` | `none` |

3. **CRUD Users**
   | Method | Route | Description | Authorization | Parameters | Note
   | ------ | -------------------------- | -----| --------------------------------- |------------- | --- |
   | GET | `/users` | get all of users list | `bearer`| `none` | `none` |
   | GET | `/users/detail` | user's detail | `bearer`| req.query: `id` | `id: number` |
   | PUT | `/users/update` | edit user's data | `bearer`| req.query: `id`, req.body: `fullname`, `username`, `role` | `none` |
   | DELETE | `/users/delete` | delete user | `bearer`| req.query: `id` | `id: number` |

4. **CRUD Cafe**
   | Method | Route | Description | Authorization | Parameters | Note
   | ------ | -------------------------- | -----| --------------------------------- |------------- | --- |
   | GET | `/cafe` | get all of cafe list | `bearer`| `none` | `none` |
   | GET | `/cafe/detail` | cafe detail | `bearer`| req.query: `id` | `id: number` |
   | GET | `/cafe/by-owner` | owner's cafe | `bearer`| req.query: `owner_id` | `owner_id: number` |
   | POST | `/cafe/create` | create new cafe | `bearer`| req.body: `name`, `address`, `phone_number` | `id: number` |
   | PUT | `/cafe/update` | edit cafe data | `bearer`| req.query: `id`, req.body: `name`, `address`, `phone_number` | `id: number` |
   | DELETE | `/cafe/delete` | delete cafe | `bearer`| req.query: `id` | `id: number` |

5. **CRUD menu**
   | Method | Route | Description | Authorization | Parameters | Note
   | ------ | -------------------------- | -----| --------------------------------- |------------- | --- |
   | GET | `/menu` | get all of menu list | `bearer`| `none` | `none` |
   | GET | `/menu/detail` | menu detail | `bearer`| req.query: `id` | `id: number` |
   | GET | `/menu/by-cafe` | cafe's menu | `bearer`| req.query: `cafe_id` | `cafe_id: number` |
   | POST | `/menu/create` | create new menu | `bearer`| req.body: `name`, `price`, `isRecommendation` | `id: number` |
   | PUT | `/menu/update` | edit menu data | `bearer`| req.query: `id`, req.body: `name`, `price`, `isRecommendation` | `id: number` |
   | DELETE | `/menu/delete` | delete menu | `bearer`| req.query: `id` | `id: number` |
