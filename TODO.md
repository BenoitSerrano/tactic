## Implémenter système de login

<!-- -   créer page /sign-up -->
<!-- -   page sign-up contient e-mail et mot de passe -->
<!-- -   page sign-in contient bouton "Créer un compte" -->
<!-- -   créer une entité users : email, hashedPassword, unicité sur email -->

<!-- -   créer une route server POST /users qui créé un user avec username, et qui hash le password -->
<!-- -   quand je clique sur le bouton, je créé un user avec le bon username et password -->

<!-- -   créer page /sign-in -->
<!-- -   page sign-in contient email et mot de passe -->
<!-- -   page sign in contient bouton se connecter -->

<!-- -   créer une route server GET /login qui trouve l'utilisateur, et vérifie si son mot de passe correspond. Si oui, renvoie un JWT token -->
<!-- -   quand je clique sur le bouton sign-in, j'envoie le mdp et email et je reçois un jwt -->

<!-- -   quand je reçois le JWT, je le stocke dans le localstorage -->

<!-- -   dans tous mes appels API, j'ajoute le Bearer à Authorization -->

<!-- -   dans buildController, j'ajoute l'option pour demander le signup -->

<!-- -   dans buildController, si l'option est activée, je vérifie le JWT token. S'il est OK, je continue, sinon je renvoie 401 -->

<!-- -   interdire la consultation de l'exam si on n'en est pas le propriétaire -->

<!-- -   binder l'exam à l'user si c'est lui qui le créé -->

-   ajouter bouton déconnexion en haut des admin page

-   Si je reçois une 401, je supprime le JWT token chez le client, et je suis redirigé vers la page de login avec une alerte
-   si je tente d'accéder à une page alors que je n'ai pas de JWT token, alors je suis redirigé vers le login (créer une AuthenticatedRoute)
-
