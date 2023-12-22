-   Refacto : ne plus stocker le nombre de points, mais une lettre (A, B, C ou D) dans les réponses acceptables
-   [x] créer migration
-   [x] dans migration, passer sur chaque question : attribuer A, B, C ou D selon la valeur. Si aucune valeur ne correspond à 1/4, 2/4, 3/4 ou 4/4, et n'est pas non plus A, B, C ou D, console.log et itérer
        - [ ] changer type points: number dans acceptableAnswersWithPoints en grade: "A"|"B"|"C"|"D"
-   [ ] changer test encoder
-   [ ] changer encoder et decoder

-   Refacto : avoir un questionDtoType différent si type qcm et si type autre

-   Refacto : avoir un questionDtoType différent si type qcm, tàt, ou autre

-   ajouter possibilité de noter un trou d'un texte à trous

-   ETQP, sur la page des étudiants, j'ai le résultat de chaque étudiant·e à chaque examen

-   ETQP, j'ai un autofocus du champ texte quand pertinent dans la modale

-   ETQP, sur la page des étudiants, je vois les examens triés par ordre de création ascendant

-   ETQP, quand une copie n'est pas encore corrigée, je peux voir immédiatement dans quelle exercice est la question non corrigée

-   ETQP, je vois les réponses au Texte à trous dans le tableau de manière plus claire

-   ETQP, je vois les réponses au QCM dans la copie de manière plus claire

-   ETQP, je peux sélectionner le texte sur la page d'examen (preview ET checking)

-   ETQPE, je vois le pourcentage de remplissage de l'exercice qui prend en compte le remplissage partiel du texte à trous

-   ETQP, dans le tableau des questions, je vois les réponses acceptées classées par point décroissant

-   ETQP, je peux créer un examen sans durée

-   ETQE, je ne peux pas me connecter à un examen si mon User et le User de l'examen diffèrent

-   ETQE, j'ai des boutons plus clairs en bas pour les étudiantes (Enregistrer mes réponses centré, Terminer l'examen à droite)
