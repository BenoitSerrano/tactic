<!-- -   ajouter une entité Group : ManyToOne vers User, name, createdAt -->

<!-- -   ajouter une ManyToOne nullable de Student vers Group -->

<!-- -   pour chaque User, créer un groupe par défaut. Faire pointer tous les students de ce user vers ce groupe -->
<!-- -   migration -->

<!-- -   rendre ManyToOne pas nullable -->

<!-- -   créer route GET groups qui renvoie les groups -->

<!-- -   créer une route côté front vers composant Groups -->

<!-- -   au clic sur "Mes groupes", naviguer vers la route Groups -->

<!-- -   dans Groups, appeler GET groups et afficher dans un tableau les groups avec leur name -->

<!-- -   ajouter une colonne Actions avec une icône de List -->

<!-- -   changer le path de STUDENTS pour ajouter le groupId -->
<!-- -   au clic sur l'icône List, naviguer vers STUDENTS pour groupId -->

-   changer la route GET /students pour une route GET /groups/groupId/students dans studentController
-   changer la route POST /students pour une route POST /groups/:groupId/students

-   créer une route POST /groups
-   créer une modale de création de groupe, qui appelle la route
-
