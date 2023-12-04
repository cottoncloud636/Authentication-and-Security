Add environment variables to level up level 2 security-------------------------------------
-------------------------------------------------------------------------------------------

https://www.npmjs.com/package/dotenv

1) npm i dotenv

2) import 'dotenv/config'

3) create a .env file in root directory

4) add my own environment variables to .env file I just created
How to do? In level 2, I created a string "Thisisourlittlesecret.", add this string to .env file following the required format --> NAME=VALUE





Level 4 security: bcrypt--------------------------------------------------------------------
--------------------------------------------------------------------------------------------
1) download npm bcrypt: https://www.npmjs.com/package/bcrypt
PS: I have hard time downloading brcypt, instead I do in terminal > npm i bcryptjs. It is a pure js implementation, only main difference is bcrypt is based on C++ but with strict rule of version compability. 
bcrypths is the optimized bcrypt in JavaScript with zero dependencies. https://www.npmjs.com/package/bcryptjs

2) each bcrypt version requires a match node version for security reason, in case I need to install an older version of bcrypt, in terminal > npm i bcrypt@3.0.2
