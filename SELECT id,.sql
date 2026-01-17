SELECT id,
       email,
       password,
       role,
       "createdAt",
       "collegeId"
FROM public."User"
LIMIT 1000;