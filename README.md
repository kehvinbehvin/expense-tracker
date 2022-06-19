# Expense Tracker

# Steps to run this project without docker

1. Run `npm install` command
2. Set up a database
3. Setup database settings inside `data-source.ts` file
4. Create .env file
5. Run `npm run dev` at project root

# Building docker image
- docker login
- docker build . -t kehvinbehvin/expensetracker:<commit>

# Test docker image
- docker run -p 3000:3000 -d --env-file ./.env kehvinbehvin/expensetracker:latest

# Push image to registry
- docker push kehvinbehvin/expensetracker:<commit>

# Modules descriptions

Authentication module
- Manage application wide authentication

Expense module
- Manage expensed transactions

Payable module
- Manage payable transactions

Receivable module
- Manage receivable transactions

User module
- Manage application security related logic for users

User_profile module
- Manage business related logic for users

Analytics module
- Churn out user data for insights into finances.
