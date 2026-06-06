# Update Schema

Add the following additional fields to the better-auth user record.  Be sure to properly update the better-auth config file and the Drizzle schema file.   


- Role: A string type with legal values "admin", "director", "user".  Default is "user".

- Privacy - a set of Boolean values which all default to False
    - ShareEmail -  Let others see my email.
    - SharePhone -  Let others see my phone number.
    - ClubEmail  -  Let me receive Club-wide email.

Tell me what skills you used and run `bun db:generate`